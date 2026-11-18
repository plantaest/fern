import { Message } from '@taxonlabs/fern/message';

export default function MessageWithATitleDemo() {
  return (
    <Message class="w-full max-w-md" type="warning" title="Edit conflict">
      Someone edited this page while you were working. Review the latest revision before publishing.
    </Message>
  );
}
