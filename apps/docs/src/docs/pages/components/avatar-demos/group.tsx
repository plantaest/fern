import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@taxonlabs/fern/avatar';
import { Icon } from '@taxonlabs/fern/icon';
import { cdxIconEllipsis } from '@wikimedia/codex-icons';

export default function AvatarGroupDemo() {
  return (
    <div class="flex flex-wrap items-center justify-center gap-6">
      <AvatarGroup aria-label="Recent contributors">
        <Avatar>
          <AvatarImage src="https://github.com/plantaest.png" alt="Alex Miller" />
          <AvatarFallback>AM</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>SR</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
      <AvatarGroup aria-label="Reviewers">
        <Avatar size="sm">
          <AvatarFallback>JP</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarFallback>CR</AvatarFallback>
        </Avatar>
        <AvatarGroupCount role="img" aria-label="More reviewers">
          <Icon icon={cdxIconEllipsis} />
        </AvatarGroupCount>
      </AvatarGroup>
    </div>
  );
}
