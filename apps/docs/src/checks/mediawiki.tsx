import { render } from '@solidjs/web';
import { Button } from '@taxon-labs/fern/button';
import { Icon } from '@taxon-labs/fern/icon';
import fernCss from '@taxon-labs/fern/styles.css?inline';
import { cdxIconEdit } from '@wikimedia/codex-icons';
import { createSignal } from 'solid-js';

function Fixture() {
  const [theme, setTheme] = createSignal('light');

  return (
    <div class="fern" data-theme={theme()} style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '1rem', 'flex-wrap': 'wrap' }}>
        <Button onClick={() => setTheme((value) => (value === 'light' ? 'dark' : 'light'))}>
          Switch theme
        </Button>
        <Button variant="outline">
          <Icon icon={cdxIconEdit} />
          Edit article
        </Button>
      </div>
      <article class="fern-prose" style={{ 'margin-block-start': '1.5rem' }}>
        <h2>Shared knowledge</h2>
        <p>
          Fern formats <strong>document content</strong> and <code>inline code</code> inside this
          container.
        </p>
        <ul>
          <li>Tri thức mở cho mọi người.</li>
          <li>Host controls keep their own styling.</li>
        </ul>
        <pre>
          <code>const enabled = true;</code>
        </pre>
        <p>
          <a href="#host">Read more</a>
        </p>
      </article>
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
