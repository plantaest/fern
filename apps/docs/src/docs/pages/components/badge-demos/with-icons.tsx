import { Badge } from '@taxonlabs/fern/badge';
import { Icon } from '@taxonlabs/fern/icon';
import { cdxIconArticle, cdxIconStar } from '@wikimedia/codex-icons';

export default function BadgeWithIconsDemo() {
  return (
    <>
      <Badge>
        <Icon icon={cdxIconArticle} />
        Article
      </Badge>
      <Badge status="success">
        Featured
        <Icon icon={cdxIconStar} />
      </Badge>
    </>
  );
}
