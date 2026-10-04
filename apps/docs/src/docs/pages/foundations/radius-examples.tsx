import { Button } from '@taxon-labs/fern/button';
import { Example } from '../../docs';

export function RadiusDefault() {
  return (
    <div
      class="
        flex gap-8 items-center p-8 border border-line
        rounded-fern docs-mobile:py-6 docs-mobile:px-4 docs-mobile:gap-5
      "
    >
      <div
        class="
          size-24 bg-docs-selected border-2 border-docs-action-line
          rounded-fern shrink-0 docs-mobile:size-18
        "
      />
      <div>
        <code>4px · 0.25rem</code>
        <p class="text-muted text-[13px] leading-5 mt-2">The default for controls and panels.</p>
      </div>
    </div>
  );
}

export function RadiusInUse() {
  return (
    <Example
      title="Controls and panels"
      code={
        '<Button variant="outline">Edit</Button>\n<div class="rounded-fern border border-line p-6">Panel content</div>'
      }
    >
      <div
        class="
          flex gap-8 items-center text-[14px] flex-wrap rounded-fern
          border border-line p-6
        "
      >
        <span>Panel content</span>
        <Button variant="outline">Edit</Button>
      </div>
    </Example>
  );
}
