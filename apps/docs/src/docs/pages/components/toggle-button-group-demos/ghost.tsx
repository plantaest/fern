import { ToggleButtonGroup, ToggleButtonGroupItem } from '@taxonlabs/fern/toggle-button-group';

export default function ToggleButtonGroupGhostDemo() {
  return (
    <ToggleButtonGroup
      aria-label="Page types"
      variant="ghost"
      multiple
      defaultValue={['article', 'talk']}
    >
      <ToggleButtonGroupItem value="article">Article</ToggleButtonGroupItem>
      <ToggleButtonGroupItem value="talk">Talk</ToggleButtonGroupItem>
      <ToggleButtonGroupItem value="help">Help</ToggleButtonGroupItem>
    </ToggleButtonGroup>
  );
}
