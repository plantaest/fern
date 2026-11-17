import { Spinner } from '@taxonlabs/fern/spinner';

export default function SpinnerWithALabelDemo() {
  return (
    <span class="inline-flex items-center gap-2 text-small" role="status">
      <Spinner aria-hidden="true" />
      Loading search results…
    </span>
  );
}
