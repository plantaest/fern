import { Avatar, AvatarFallback, AvatarImage } from '@taxonlabs/fern/avatar';

export default function AvatarImageAndFallbackDemo() {
  return (
    <div class="flex items-center gap-4">
      <Avatar>
        <AvatarImage src="https://github.com/plantaest.png" alt="Alex Miller" />
        <AvatarFallback>AM</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>SR</AvatarFallback>
      </Avatar>
      <Avatar />
    </div>
  );
}
