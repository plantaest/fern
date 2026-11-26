import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@taxonlabs/fern/card';

export default function CardBasicDemo() {
  return (
    <Card as="article" class="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Wiki Loves Monuments</CardTitle>
        <CardDescription>An annual photo competition for cultural heritage.</CardDescription>
      </CardHeader>
      <CardContent class="text-small">
        Contributors photograph historic places and share their images on Wikimedia Commons.
      </CardContent>
    </Card>
  );
}
