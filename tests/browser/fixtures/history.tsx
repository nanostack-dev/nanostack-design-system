import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Theme,
  DocumentTheme,
  Page,
  Stack,
  Heading,
  Text,
  Button,
  VirtualList,
  ResourceRowButton,
  BarStrip,
  ResponsivePanel,
  InspectorHeader,
  ConversationLog,
  MessageBubble,
} from '../../../src/index';
import '../../../src/styles.css';
function Fixture() {
  const [scheme, setScheme] = useState<'light' | 'dark'>('light');
  const [count, setCount] = useState(40);
  const [calls, setCalls] = useState(0);
  const [selected, setSelected] = useState('0');
  const [open, setOpen] = useState(false);
  return (
    <Theme colorScheme={scheme}>
      <DocumentTheme />
      <Page>
        <Heading level={1}>History blocks</Heading>
        <Stack>
          <Button onClick={() => setScheme(scheme === 'light' ? 'dark' : 'light')}>
            Toggle theme
          </Button>
          <Text>Fetches: {calls}</Text>
          <Text>Selected: {selected}</Text>
          <VirtualList
            label="Records"
            items={Array.from({ length: count }, (_, i) => ({ id: String(i) }))}
            getItemKey={(item) => item.id}
            hasMore={count < 80}
            onEndReached={() => {
              setCalls(calls + 1);
              setCount(count + 20);
            }}
            renderItem={(item) => (
              <ResourceRowButton onClick={() => setSelected(item.id)}>
                <Text>Record {item.id}</Text>
                <Text size="sm">
                  {Number(item.id) % 2
                    ? 'A short result.'
                    : 'An expanded result with variable height. '.repeat(8)}
                </Text>
              </ResourceRowButton>
            )}
          />
          <BarStrip
            label="Durations"
            points={[
              { id: 'fast', value: 4, label: 'Fast, 4 milliseconds', tone: 'success' },
              { id: 'slow', value: 100, label: 'Slow, 100 milliseconds', tone: 'danger' },
            ]}
            reference={52}
            selectedId={selected}
            onSelect={setSelected}
          />
          <Button onClick={() => setOpen(true)}>Open detail</Button>
          <ResponsivePanel label="Details" open={open} onOpenChange={setOpen}>
            <InspectorHeader>
              <Heading level={2}>Details</Heading>
              <Button onClick={() => setOpen(false)}>Close detail</Button>
            </InspectorHeader>
            <Text>Selected record {selected}</Text>
          </ResponsivePanel>
          <ConversationLog label="Messages" entryCount={1}>
            <MessageBubble>First message</MessageBubble>
          </ConversationLog>
        </Stack>
      </Page>
    </Theme>
  );
}
createRoot(document.getElementById('root')!).render(<Fixture />);
