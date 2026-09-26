import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Theme,
  DocumentTheme,
  Page,
  Heading,
  Button,
  Stack,
  Cluster,
  Text,
  ConversationLog,
  MessageRow,
  MessageBubble,
  PreviewFrame,
  WorkspaceMain,
  ResponsivePanel,
  Menu,
  MenuTrigger,
  MenuContent,
  MenuSub,
  MenuSubTrigger,
  MenuSubContent,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
} from '../../../src/index';
import '../../../src/styles.css';

function Fixture() {
  const [choice, setChoice] = useState('newest');
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: `message-${i}`,
      text: `Message ${i}: ${'An existing message with enough content to occupy several lines. '.repeat(5)}`,
    })),
  );
  return (
    <Theme colorScheme="dark">
      <DocumentTheme />
      <Page>
        <Heading level={1}>Interaction contracts</Heading>
        <Stack>
          <Menu>
            <MenuTrigger>Sort options</MenuTrigger>
            <MenuContent>
              <MenuSub>
                <MenuSubTrigger>Order</MenuSubTrigger>
                <MenuSubContent>
                  <MenuRadioGroup value={choice} onValueChange={setChoice}>
                    <MenuRadioItem value="newest" closeOnClick={false}>
                      Newest first
                    </MenuRadioItem>
                    <MenuRadioItem value="restricted" disabled closeOnClick={false}>
                      Restricted
                    </MenuRadioItem>
                    <MenuRadioItem value="oldest" closeOnClick={false}>
                      Oldest first
                    </MenuRadioItem>
                  </MenuRadioGroup>
                </MenuSubContent>
              </MenuSub>
              <MenuItem>Archive</MenuItem>
            </MenuContent>
          </Menu>
          <Text role="status">Order: {choice}</Text>
          <Button onClick={() => setOpen(true)}>Open supporting panel</Button>
          <ResponsivePanel open={open} label="Supporting detail" onOpenChange={setOpen}>
            <Stack>
              <Heading level={2}>Supporting detail</Heading>
              <Button onClick={() => setOpen(false)}>Close panel</Button>
              <Button>Panel action</Button>
            </Stack>
          </ResponsivePanel>
          <Cluster>
            <Button
              onClick={() =>
                setMessages((items) => [
                  ...items,
                  { id: `message-${items.length}`, text: 'Appended message. '.repeat(12) },
                ])
              }
            >
              Append message
            </Button>
            <Button
              onClick={() =>
                setMessages((items) =>
                  items.map((item, i) =>
                    i === items.length - 1
                      ? { ...item, text: item.text + 'Streamed text. '.repeat(20) }
                      : item,
                  ),
                )
              }
            >
              Stream text
            </Button>
            <Button
              onClick={() =>
                setMessages((items) => [
                  { id: `earlier-${items.length}`, text: 'Earlier history. '.repeat(30) },
                  ...items,
                ])
              }
            >
              Prepend history
            </Button>
          </Cluster>
          <PreviewFrame height="panel">
            <WorkspaceMain>
              <ConversationLog label="Conversation" entryCount={messages.length}>
                {messages.map((message) => (
                  <MessageRow key={message.id}>
                    <MessageBubble>{message.text}</MessageBubble>
                  </MessageRow>
                ))}
              </ConversationLog>
            </WorkspaceMain>
          </PreviewFrame>
        </Stack>
      </Page>
    </Theme>
  );
}
createRoot(document.getElementById('root')!).render(<Fixture />);
