import { render } from '@solidjs/web';
import '@fontsource-variable/inter';
import '@fontsource-variable/source-serif-4';
import '@fontsource-variable/jetbrains-mono';
import '@taxon-labs/fern/styles.css';
import './docs/styles.css';
import { App } from './docs/app';

const host = document.getElementById('root');

if (!host) {
  throw new Error('Missing root element');
}

render(() => <App />, host);
