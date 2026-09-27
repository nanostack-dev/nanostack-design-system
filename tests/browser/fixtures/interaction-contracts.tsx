import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Theme,
  DocumentTheme,
  Page,
  Heading,
  Button,
  Stack,
  Text,
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
        </Stack>
      </Page>
    </Theme>
  );
}
createRoot(document.getElementById('root')!).render(<Fixture />);
