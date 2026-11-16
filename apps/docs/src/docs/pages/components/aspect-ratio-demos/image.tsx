import { AspectRatio } from '@taxonlabs/fern/aspect-ratio';

export default function AspectRatioImageDemo() {
  return (
    <AspectRatio
      ratio={16 / 9}
      class="w-full max-w-md overflow-hidden rounded-base bg-surface-neutral"
    >
      <img
        class="block size-full object-cover"
        src="/images/ashtamudi-mangrove.jpg"
        alt="A lone mangrove tree reflected in Ashtamudi Lake, Kerala"
      />
    </AspectRatio>
  );
}
