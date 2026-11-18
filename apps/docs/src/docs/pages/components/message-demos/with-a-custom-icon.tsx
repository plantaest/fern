import { Message } from '@taxonlabs/fern/message';
import { cdxIconArticle } from '@wikimedia/codex-icons';

export default function MessageWithACustomIconDemo() {
  return (
    <Message class="w-full max-w-md" variant="soft" icon={cdxIconArticle}>
      You are viewing an earlier revision of this article.
    </Message>
  );
}
