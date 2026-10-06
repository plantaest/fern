import RadiusControlsDemo from './radius-demos/controls-and-panels';
import radiusSource from './radius-demos/controls-and-panels.tsx?raw';

export function RadiusDefault() {
  return (
    <div
      class="
        flex gap-8 items-center p-8 border border-line
        rounded-base docs-mobile:py-6 docs-mobile:px-4 docs-mobile:gap-5
      "
    >
      <div
        class="
          size-24 bg-docs-selected border-2 border-docs-action-line
          rounded-base shrink-0 docs-mobile:size-18
        "
      />
      <div>
        <code>4px · 0.25rem</code>
        <p class="text-muted text-[0.8125rem] leading-5 mt-2">
          The default for controls and panels.
        </p>
      </div>
    </div>
  );
}

export const radiusInUse = {
  component: RadiusControlsDemo,
  source: radiusSource,
};
