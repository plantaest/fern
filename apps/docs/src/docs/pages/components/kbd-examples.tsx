import KbdInTextDemo from './kbd-demos/in-text';
import inTextSource from './kbd-demos/in-text.tsx?raw';
import KbdKeyCombinationsDemo from './kbd-demos/key-combinations';
import keyCombinationsSource from './kbd-demos/key-combinations.tsx?raw';
import KbdWithAButtonDemo from './kbd-demos/with-a-button';
import withAButtonSource from './kbd-demos/with-a-button.tsx?raw';

export const kbdInTextExample = {
  component: KbdInTextDemo,
  source: inTextSource,
};

export const kbdKeyCombinationsExample = {
  component: KbdKeyCombinationsDemo,
  source: keyCombinationsSource,
};

export const kbdWithAButtonExample = {
  component: KbdWithAButtonDemo,
  source: withAButtonSource,
};
