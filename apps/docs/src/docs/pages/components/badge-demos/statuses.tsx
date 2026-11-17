import { Badge } from '@taxonlabs/fern/badge';
import { Icon } from '@taxonlabs/fern/icon';
import { cdxIconAlert, cdxIconError, cdxIconSuccess } from '@wikimedia/codex-icons';

export default function BadgeStatusesDemo() {
  return (
    <>
      <Badge status="subtle">Subtle</Badge>
      <Badge>Notice</Badge>
      <Badge status="progressive">Progressive</Badge>
      <Badge status="success">
        <Icon icon={cdxIconSuccess} />
        Success
      </Badge>
      <Badge status="warning">
        <Icon icon={cdxIconAlert} />
        Warning
      </Badge>
      <Badge status="error">
        <Icon icon={cdxIconError} />
        Error
      </Badge>
    </>
  );
}
