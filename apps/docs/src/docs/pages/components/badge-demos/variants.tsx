import { Badge } from '@taxonlabs/fern/badge';

export default function BadgeVariantsDemo() {
  return (
    <>
      <Badge variant="solid" status="progressive">
        Solid
      </Badge>
      <Badge status="progressive">Soft</Badge>
      <Badge variant="surface" status="progressive">
        Surface
      </Badge>
      <Badge variant="outline" status="progressive">
        Outline
      </Badge>
      <Badge variant="ghost" status="progressive">
        Ghost
      </Badge>
    </>
  );
}
