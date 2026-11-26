import type { PolymorphicProps } from '@kobalte/core/polymorphic';
import { dynamic, type JSX, type ValidComponent } from '@solidjs/web';
import { cva, type VariantProps } from 'class-variance-authority';
import { omit } from 'solid-js';

const cardMediaVariants = cva('fern-card-media', {
  variants: {
    position: {
      'block-start': 'fern-card-media-position--block-start',
      'inline-start': 'fern-card-media-position--inline-start',
      'inline-end': 'fern-card-media-position--inline-end',
    },
  },
  defaultVariants: { position: 'block-start' },
});

export type CardProps<T extends ValidComponent = 'div'> = PolymorphicProps<T>;
export type CardMediaPosition = NonNullable<VariantProps<typeof cardMediaVariants>['position']>;
export type CardMediaProps = JSX.HTMLAttributes<HTMLDivElement> & {
  position?: CardMediaPosition;
};
export type CardHeaderProps = JSX.HTMLAttributes<HTMLDivElement>;
export type CardTitleProps<T extends ValidComponent = 'div'> = PolymorphicProps<T>;
export type CardDescriptionProps = JSX.HTMLAttributes<HTMLDivElement>;
export type CardContentProps = JSX.HTMLAttributes<HTMLDivElement>;
export type CardFooterProps = JSX.HTMLAttributes<HTMLDivElement>;

export function Card<T extends ValidComponent = 'div'>(props: CardProps<T>) {
  const rest = omit(props as CardProps, 'as', 'class');
  const Root = dynamic(() => props.as ?? 'div');

  return <Root {...rest} class={['fern-card', props.class]} />;
}

export function CardMedia(props: CardMediaProps) {
  const rest = omit(props, 'position', 'class');

  return <div {...rest} class={[cardMediaVariants({ position: props.position }), props.class]} />;
}

export function CardHeader(props: CardHeaderProps) {
  const rest = omit(props, 'class');

  return <div {...rest} class={['fern-card-header', props.class]} />;
}

export function CardTitle<T extends ValidComponent = 'div'>(props: CardTitleProps<T>) {
  const rest = omit(props as CardTitleProps, 'as', 'class');
  const Root = dynamic(() => props.as ?? 'div');

  return <Root {...rest} class={['fern-card-title', props.class]} />;
}

export function CardDescription(props: CardDescriptionProps) {
  const rest = omit(props, 'class');

  return <div {...rest} class={['fern-card-description', props.class]} />;
}

export function CardContent(props: CardContentProps) {
  const rest = omit(props, 'class');

  return <div {...rest} class={['fern-card-content', props.class]} />;
}

export function CardFooter(props: CardFooterProps) {
  const rest = omit(props, 'class');

  return <div {...rest} class={['fern-card-footer', props.class]} />;
}
