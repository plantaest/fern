import type { JSX } from '@solidjs/web';
import { cva, type VariantProps } from 'class-variance-authority';
import { createContext, createMemo, createUniqueId, omit, useContext } from 'solid-js';

const progressVariants = cva('fern-progress', {
  variants: {
    color: {
      progressive: null,
      success: 'fern-progress-color--success',
      warning: 'fern-progress-color--warning',
      error: 'fern-progress-color--error',
    },
    size: {
      sm: 'fern-progress-size--sm',
      default: null,
      lg: 'fern-progress-size--lg',
    },
  },
  defaultVariants: { color: 'progressive', size: 'default' },
});

export type ProgressColor = NonNullable<VariantProps<typeof progressVariants>['color']>;
export type ProgressSize = NonNullable<VariantProps<typeof progressVariants>['size']>;
type ProgressValueDetails = { value: number; min: number; max: number };

export interface ProgressProps
  extends Omit<
    JSX.HTMLAttributes<HTMLDivElement>,
    'role' | 'aria-valuemin' | 'aria-valuemax' | 'aria-valuenow'
  > {
  value?: number;
  min?: number;
  max?: number;
  indeterminate?: boolean;
  color?: ProgressColor;
  size?: ProgressSize;
  disabled?: boolean;
  getValueLabel?: (details: ProgressValueDetails) => string;
}

export type ProgressLabelProps = Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'id'>;
export type ProgressValueProps = Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'children'>;

const ProgressContext = createContext<{
  labelId: () => string;
  valueLabel: () => string | undefined;
}>();

function useProgressContext() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('ProgressLabel and ProgressValue must be used within Progress.');
  }
  return context;
}

export function Progress(props: ProgressProps) {
  const rest = omit(
    props,
    'id',
    'children',
    'value',
    'min',
    'max',
    'indeterminate',
    'color',
    'size',
    'disabled',
    'aria-disabled',
    'aria-labelledby',
    'aria-valuetext',
    'class',
    'dir',
    'style',
    'getValueLabel',
  );
  const fallbackId = createUniqueId();
  const id = () => props.id || fallbackId;
  const labelId = () => `${id()}-label`;
  const range = createMemo(() => {
    const start = props.min ?? 0;
    const min = Number.isFinite(start) ? start : 0;
    const max = props.max ?? 100;

    return max > min && Number.isFinite(max - min) ? { min, max } : { min: 0, max: 1 };
  });
  const total = () => range().max - range().min;
  const value = () => {
    const current = props.value;
    if (props.indeterminate || current === undefined) {
      return undefined;
    }
    const { min, max } = range();
    return Number.isFinite(current) ? Math.min(Math.max(min, current), max) : min;
  };
  const percentage = () => (((value() ?? range().min) - range().min) / total()) * 100;
  const formattedValue = createMemo(() => {
    const current = value();
    return current === undefined
      ? undefined
      : props.getValueLabel?.({ value: current, ...range() });
  });
  const valueLabel = () =>
    value() === undefined ? undefined : (formattedValue() ?? `${Math.round(percentage())}%`);
  const ariaDisabled = () => (props.disabled ? 'true' : props['aria-disabled']);

  return (
    <ProgressContext value={{ labelId, valueLabel }}>
      <div
        class={[progressVariants({ color: props.color, size: props.size }), props.class]}
        style={props.style}
        dir={props.dir}
      >
        {props.children}
        <div
          {...rest}
          id={id()}
          class="fern-progress-track"
          role="progressbar"
          aria-labelledby={
            props['aria-labelledby'] ?? (props['aria-label'] ? undefined : labelId())
          }
          aria-valuemin={range().min}
          aria-valuemax={range().max}
          aria-valuenow={value()}
          aria-disabled={ariaDisabled()}
          aria-valuetext={props['aria-valuetext'] ?? formattedValue()}
          data-disabled={ariaDisabled() === 'true' ? '' : undefined}
          data-indeterminate={value() === undefined ? '' : undefined}
        >
          <div
            class="fern-progress-indicator"
            style={value() === undefined ? undefined : { 'inline-size': `${percentage()}%` }}
          />
        </div>
      </div>
    </ProgressContext>
  );
}

export function ProgressLabel(props: ProgressLabelProps) {
  const context = useProgressContext();
  return <span {...props} id={context.labelId()} />;
}

export function ProgressValue(props: ProgressValueProps) {
  const context = useProgressContext();
  return <span {...props}>{context.valueLabel()}</span>;
}
