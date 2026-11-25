import { Avatar, AvatarFallback } from '@taxonlabs/fern/avatar';

export default function AvatarSizesDemo() {
  return (
    <div class="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarFallback>SR</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>SR</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>SR</AvatarFallback>
      </Avatar>
    </div>
  );
}
