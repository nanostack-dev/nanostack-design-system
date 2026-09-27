import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ScrollRegion, Stack, Surface } from '../../../src/components/layout.js';
import { Text } from '../../../src/components/typography.js';
import { Theme } from '../../../src/theme.js';
import { CodeEditor, CodeViewer } from '../../../src/components/code-editor.js';
import { VariableAwareInput } from '../../../src/components/variable-aware-input.js';
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
        <VariableAwareInput
          aria-label="URL"
          value={value}
          onChange={setValue}
          readOnly={readOnly}
          variables={[{ name: 'host', value: 'https://example.com', description: 'API endpoint' }]}
          placeholder="Enter URL…"
        />
        <output aria-label="Current value">{value}</output>
        <CodeEditor
          aria-label="JSON body"
          language="json"
          defaultValue={'{\n  "hello": true\n}'}
          height="compact"
          lineNumbers
        />
        <CodeViewer
          aria-label="Response"
          height="content"
          autoDetectLanguage
          value={'{"long":"' + 'unbroken'.repeat(70) + '"}'}
        />
        <button>After editors</button>
        <ScrollRegion label="Request form">
          <Stack gap="md">
            <VariableAwareInput aria-label="Scrolling URL" defaultValue="https://example.com" />
            {Array.from({ length: 16 }, (_, index) => (
              <Text key={index}>Request form section {index + 1}</Text>
            ))}
          </Stack>
        </ScrollRegion>
      </Surface>
    </Theme>
  );
}
createRoot(document.getElementById('root')!).render(<Fixture />);
