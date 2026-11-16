import { ToggleButtonGroup, ToggleButtonGroupItem } from '@taxonlabs/fern/toggle-button-group';

export default function ToggleButtonGroupDisabledDemo() {
  return (
    <ToggleButtonGroup aria-label="Page type" disabled>
      <ToggleButtonGroupItem value="article">Article</ToggleButtonGroupItem>
      <ToggleButtonGroupItem value="talk">Talk</ToggleButtonGroupItem>
      <ToggleButtonGroupItem value="help">Help</ToggleButtonGroupItem>
    </ToggleButtonGroup>
  );
}
