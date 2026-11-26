import { Badge } from '@taxonlabs/fern/badge';
import { Button } from '@taxonlabs/fern/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@taxonlabs/fern/card';
import { Icon } from '@taxonlabs/fern/icon';
import { cdxIconArticle } from '@wikimedia/codex-icons';
import { createSignal } from 'solid-js';

export default function CardWithActionsDemo() {
  const [reviewed, setReviewed] = createSignal(false);

  return (
    <Card as="article" class="w-full max-w-sm">
      <CardHeader>
        <CardTitle>
          <Icon icon={cdxIconArticle} class="me-2 -translate-y-px text-content-subtle" />
          Review article changes
        </CardTitle>
        <CardDescription>Check the latest changes to Ashtamudi Lake.</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge role="status" status={reviewed() ? 'success' : 'warning'}>
          {reviewed() ? 'Reviewed' : 'Needs review'}
        </Badge>
      </CardContent>
      <CardFooter class="flex-wrap gap-2">
        <Button
          as="a"
          href="https://en.wikipedia.org/wiki/Ashtamudi_Lake"
          target="_blank"
          rel="noopener noreferrer"
          variant="surface"
        >
          Open article
        </Button>
        <Button variant="ghost" onClick={() => setReviewed(!reviewed())}>
          {reviewed() ? 'Reopen review' : 'Mark reviewed'}
        </Button>
      </CardFooter>
    </Card>
  );
}
