import { Avatar, AvatarFallback } from '@taxonlabs/fern/avatar';
import { Icon } from '@taxonlabs/fern/icon';
import { cdxIconCheck, cdxIconStar } from '@wikimedia/codex-icons';

export default function AvatarCustomizationDemo() {
  return (
    <div class="flex items-center gap-4">
      <Avatar class="bg-surface-progressive-subtle text-content-progressive">
        <AvatarFallback>
          <Icon icon={cdxIconStar} />
        </AvatarFallback>
      </Avatar>
      <Avatar
        class={[
          'border border-solid border-current',
          'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100',
        ]}
      >
        <AvatarFallback>
          <Icon icon={cdxIconCheck} />
        </AvatarFallback>
      </Avatar>
      <Avatar
        class={[
          'border border-dotted border-current',
          'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100',
        ]}
      />
    </div>
  );
}
