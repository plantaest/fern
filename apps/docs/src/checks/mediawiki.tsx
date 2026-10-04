import { render } from '@solidjs/web';
import { Button } from '@taxon-labs/fern/button';
import { Icon } from '@taxon-labs/fern/icon';
import fernCss from '@taxon-labs/fern/styles.css?inline';
import { cdxIconEdit } from '@wikimedia/codex-icons';
import { createSignal } from 'solid-js';

function Fixture() {
  const [theme, setTheme] = createSignal('light');

  return (
    <div class="fern" data-theme={theme()} style={{ padding: '24px' }}>
      <div style={{ display: 'flex', gap: '16px', 'flex-wrap': 'wrap' }}>
        <Button onClick={() => setTheme((value) => (value === 'light' ? 'dark' : 'light'))}>
          Switch theme
        </Button>
        <Button variant="outline">
          <Icon icon={cdxIconEdit} />
          Edit article
        </Button>
      </div>
      <p>Fern uses its own font and colors inside this container.</p>
    </div>
  );
}

const host = document.getElementById('fixture');

if (!host) {
  throw new Error('Missing fixture element');
}

const shadow = host.attachShadow({ mode: 'open' });
const stylesheet = document.createElement('style');
const mount = document.createElement('div');

stylesheet.textContent = fernCss;
shadow.append(stylesheet, mount);

render(() => <Fixture />, mount);
