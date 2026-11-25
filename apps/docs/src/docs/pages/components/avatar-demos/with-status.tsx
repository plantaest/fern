import { Avatar, AvatarFallback, AvatarImage, AvatarStatus } from '@taxonlabs/fern/avatar';

export default function AvatarWithStatusDemo() {
  return (
    <ul class="m-0 grid gap-3 p-0">
      <li class="flex items-center gap-2">
        <Avatar aria-hidden="true">
          <AvatarImage src="https://github.com/plantaest.png" />
          <AvatarFallback>AM</AvatarFallback>
          <AvatarStatus />
        </Avatar>
        <span>Alex Miller · Online</span>
      </li>
      <li class="flex items-center gap-2">
        <Avatar aria-hidden="true">
          <AvatarFallback>SR</AvatarFallback>
          <AvatarStatus status="away" />
        </Avatar>
        <span>Sam Rivera · Away</span>
      </li>
      <li class="flex items-center gap-2">
        <Avatar aria-hidden="true">
          <AvatarFallback>CR</AvatarFallback>
          <AvatarStatus status="busy" />
        </Avatar>
        <span>Casey Reed · Busy</span>
      </li>
      <li class="flex items-center gap-2">
        <Avatar aria-hidden="true">
          <AvatarFallback>JP</AvatarFallback>
          <AvatarStatus status="offline" />
        </Avatar>
        <span>Jamie Park · Offline</span>
      </li>
    </ul>
  );
}
