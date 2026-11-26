import { Card, CardDescription, CardHeader, CardTitle } from '@taxonlabs/fern/card';

export default function CardLinkDemo() {
  return (
    <Card
      as="a"
      href="https://en.wikipedia.org/wiki/Help:Editing"
      target="_blank"
      rel="noopener noreferrer"
      class="w-full max-w-sm"
    >
      <CardHeader>
        <CardTitle>Editing Wikipedia</CardTitle>
        <CardDescription>Learn how to improve an article.</CardDescription>
      </CardHeader>
    </Card>
  );
}
