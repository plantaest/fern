import { Kbd } from '@taxonlabs/fern/kbd';

export default function KbdKeyCombinationsDemo() {
  return (
    <p>
      Press{' '}
      <span dir="ltr">
        <Kbd>Shift</Kbd> + <Kbd>Tab</Kbd>
      </span>{' '}
      to move focus backward.
    </p>
  );
}
