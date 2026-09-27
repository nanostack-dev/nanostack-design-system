import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as UI from '../../../src/index.js';
import '../../../src/styles.css';

import { InspectorExample } from '../../../playground/inspector-example.js';

function Fixture() {
  const [dark, setDark] = useState(false);
  return <UI.Theme colorScheme={dark ? 'dark' : 'light'}><UI.DocumentTheme /><UI.Page><UI.Heading level={1}>Inspector composition</UI.Heading><UI.Button onClick={() => setDark(!dark)}>Toggle theme</UI.Button><InspectorExample /></UI.Page></UI.Theme>;
}
createRoot(document.getElementById('root')!).render(<Fixture />);
