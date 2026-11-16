import { ToggleButtonGroup, ToggleButtonGroupItem } from '@taxonlabs/fern/toggle-button-group';

export default function ToggleButtonGroupDisabledItemDemo() {
  return (
    <ToggleButtonGroup aria-label="Page type" defaultValue="talk">
      <ToggleButtonGroupItem value="article">Article</ToggleButtonGroupItem>
      <ToggleButtonGroupItem value="talk" disabled>
        Talk
      </ToggleButtonGroupItem>
      <ToggleButtonGroupItem value="help">Help</ToggleButtonGroupItem>
    </ToggleButtonGroup>
  );
}
