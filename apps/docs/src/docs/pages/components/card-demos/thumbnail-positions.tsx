import {
  Card,
  CardDescription,
  CardHeader,
  CardMedia,
  type CardMediaPosition,
  CardTitle,
} from '@taxonlabs/fern/card';
import { For } from 'solid-js';

const positions = ['inline-start', 'inline-end'] as const satisfies readonly CardMediaPosition[];

export default function CardThumbnailPositionsDemo() {
  return (
    <div class="grid w-full max-w-sm gap-3">
      <For each={positions}>
        {(position) => (
          <Card>
            <CardMedia position={position}>
              <img
                class="block size-full object-cover"
                src="/images/ashtamudi-mangrove.jpg"
                alt="A mangrove tree reflected in Ashtamudi Lake"
              />
            </CardMedia>
            <CardHeader>
              <CardTitle>Ashtamudi Lake</CardTitle>
              <CardDescription>A lake and wetland in Kerala, India.</CardDescription>
            </CardHeader>
          </Card>
        )}
      </For>
    </div>
  );
}
