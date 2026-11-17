import { Spinner } from '@taxonlabs/fern/spinner';

export default function SpinnerSizesDemo() {
  return (
    <>
      <Spinner size="xs" aria-label="Loading (extra small)" />
      <Spinner size="sm" aria-label="Loading (small)" />
      <Spinner />
      <Spinner size="lg" aria-label="Loading (large)" />
    </>
  );
}
