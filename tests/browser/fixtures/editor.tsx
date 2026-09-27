import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Label, Surface } from '../../../src/components/layout.js';
import { Theme } from '../../../src/theme.js';
import { CodeEditor, CodeViewer } from '../../../src/components/code-editor.js';
import '../../../src/styles.css';
import '../../../src/styles/editor.css';

function Fixture() {
  const [value, setValue] = useState('');
  const [readOnly, setReadOnly] = useState(false);
  const [dark, setDark] = useState(false);
  return (
    <Theme colorScheme={dark ? 'dark' : 'light'} brand="echopoint">
      <Surface padding="md">
        <h1>Editor interactions</h1>
        <button onClick={() => setDark((current) => !current)}>Toggle theme</button>
        <button onClick={() => setReadOnly((current) => !current)}>Toggle readonly</button>
        <CodeEditor
          label="JSON body"
          language="json"
          value={value}
          onChange={setValue}
          readOnly={readOnly}
          placeholder="Enter JSON…"
          height="compact"
          lineNumbers
        />
        <output aria-label="Current value">{value}</output>
        <CodeViewer
          label="Response"
          height="content"
          autoDetectLanguage
          value={'{"long":"' + 'unbroken'.repeat(70) + '"}'}
        />
        <button>After editors</button>
        <Label id="request-path-label" htmlFor="request-path">
          Request path
        </Label>
        <CodeEditor id="request-path" aria-labelledby="request-path-label" height="compact" />
      </Surface>
    </Theme>
  );
}
createRoot(document.getElementById('root')!).render(<Fixture />);
