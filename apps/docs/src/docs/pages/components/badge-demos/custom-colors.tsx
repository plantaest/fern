import { Badge } from '@taxonlabs/fern/badge';

export default function BadgeCustomColorsDemo() {
  return (
    <>
      <Badge class="bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-purple-50">
        Bot
      </Badge>
      <Badge class="bg-pink-200 text-pink-900 dark:bg-pink-800 dark:text-pink-50">Gadget</Badge>
      <Badge class="bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-50">
        Template
      </Badge>
    </>
  );
}
