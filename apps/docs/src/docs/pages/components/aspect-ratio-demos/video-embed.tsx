import { AspectRatio } from '@taxonlabs/fern/aspect-ratio';

export default function AspectRatioVideoEmbedDemo() {
  return (
    <AspectRatio ratio={16 / 9} class="w-full max-w-md overflow-hidden bg-surface-neutral">
      <iframe
        class="block size-full border-0"
        src="https://www.youtube-nocookie.com/embed/MDnyhGLVkKU"
        title="How does Wikipedia work? | A Wiki Minute"
        loading="lazy"
        allowfullscreen
      />
    </AspectRatio>
  );
}
