import { Message } from '@taxonlabs/fern/message';

export default function MessageTypesDemo() {
  return (
    <div class="grid w-full max-w-md gap-3">
      <Message>This draft is only visible to you.</Message>
      <Message type="success">Your changes were published.</Message>
      <Message type="warning">This page has changed since you opened it.</Message>
      <Message type="error">Could not load search results.</Message>
    </div>
  );
}
