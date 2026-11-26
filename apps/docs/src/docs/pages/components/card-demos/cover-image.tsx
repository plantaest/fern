import { AspectRatio } from '@taxonlabs/fern/aspect-ratio';
import { Card, CardDescription, CardHeader, CardMedia, CardTitle } from '@taxonlabs/fern/card';

export default function CardCoverImageDemo() {
  return (
    <Card class="w-full max-w-sm">
      <CardMedia>
        <AspectRatio ratio={16 / 9}>
          <img
            class="block size-full object-cover"
            src="/images/ashtamudi-mangrove.jpg"
            alt="A mangrove tree reflected in Ashtamudi Lake"
          />
        </AspectRatio>
      </CardMedia>
      <CardHeader>
        <CardTitle>Ashtamudi Lake</CardTitle>
        <CardDescription>A lake and wetland in Kerala, India.</CardDescription>
      </CardHeader>
    </Card>
  );
}
