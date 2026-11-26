import { Card, CardMedia, CardTitle } from '@taxonlabs/fern/card';

export default function CardMediaAndTitleOnlyDemo() {
  return (
    <Card class="w-full max-w-sm justify-center">
      <CardMedia position="inline-start">
        <img
          class="block size-full object-cover"
          src="/images/ashtamudi-mangrove.jpg"
          alt="A mangrove tree reflected in Ashtamudi Lake"
        />
      </CardMedia>
      <CardTitle>Ashtamudi Lake</CardTitle>
    </Card>
  );
}
