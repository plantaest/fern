import RadiusControlsDemo from './radius-demos/controls-and-panels';
import radiusSource from './radius-demos/controls-and-panels.tsx?raw';

export function RadiusDefault() {
  return (
    <div
      class="
        fern-not-prose flex gap-8 items-center p-8 border border-line-subtle
        rounded-base screen-small:py-6 screen-small:px-4 screen-small:gap-5
      "
    >
      <div
        class="
          size-24 bg-surface-progressive-subtle border-2 border-line-progressive
          rounded-base shrink-0 screen-small:size-18
        "
      />
      <div>
        <code class="font-mono text-xs">4px · 0.25rem</code>
        <p class="text-content-subtle text-small-xs mt-2">The default for controls and panels.</p>
      </div>
    </div>
  );
}

export const radiusInUse = {
  component: RadiusControlsDemo,
  source: radiusSource,
};
