import { Avatar, AvatarFallback, AvatarImage } from '@taxonlabs/fern/avatar';

export default function AvatarLinkDemo() {
  return (
    <Avatar as="a" href="#with-status" aria-label="View Alex Miller's status">
      <AvatarImage src="https://github.com/plantaest.png" />
      <AvatarFallback>AM</AvatarFallback>
    </Avatar>
  );
}
