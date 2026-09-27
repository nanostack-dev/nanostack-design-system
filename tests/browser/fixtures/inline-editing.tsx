import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Cluster, EditableText, Stack, Surface, Text, Theme } from '../../../src/index.js';
import '../../../src/styles.css';

function Fixture() {
  const [dark, setDark] = useState(false);
  const [name, setName] = useState('List invoices');
  return (
    <Theme colorScheme={dark ? 'dark' : 'light'} brand="echopoint">
      <Surface padding="md">
        <Stack gap="lg">
          <h1>Inline editing</h1>
          <Cluster>
            <Button size="sm" variant="secondary" onClick={() => setDark((current) => !current)}>
              Toggle theme
            </Button>
          </Cluster>
          <section aria-label="Request identity" data-testid="identity">
            <EditableText value={name} label="Request name" onCommit={setName} />
          </section>
          <Text size="sm" tone="muted">
            Saved name: <output aria-label="Saved name">{name}</output>
          </Text>
        </Stack>
      </Surface>
    </Theme>
  );
}

createRoot(document.getElementById('root')!).render(<Fixture />);
