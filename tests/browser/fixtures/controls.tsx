import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Button,
  Checkbox,
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
  Field,
  FieldDescription,
  FieldLabel,
  Heading,
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuLabel,
  MenuTrigger,
  Stack,
  Surface,
  Text,
  Textarea,
  Theme,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../src/index.js';
import '../../../src/styles.css';

function Controls() {
  const [dark, setDark] = useState(false);
  const [archived, setArchived] = useState(false);
  return (
    <Theme colorScheme={dark ? 'dark' : 'light'}>
      <Surface padding="lg">
        <Stack gap="lg">
          <Heading level={1}>Shared controls</Heading>
          <Field name="notifications">
            <FieldLabel>Notifications</FieldLabel>
            <Checkbox />
            <FieldDescription>Email me when a run finishes.</FieldDescription>
          </Field>
          <Field name="description">
            <FieldLabel>Description</FieldLabel>
            <Textarea height="compact" />
          </Field>
          <Menu>
            <MenuTrigger>Actions</MenuTrigger>
            <MenuContent>
              <MenuGroup>
                <MenuLabel>Manage</MenuLabel>
                <MenuItem onClick={() => setArchived(true)}>Archive</MenuItem>
                <MenuCheckboxItem>Show metadata</MenuCheckboxItem>
                <MenuItem disabled>Unavailable</MenuItem>
                <MenuItem tone="danger">Delete</MenuItem>
              </MenuGroup>
            </MenuContent>
          </Menu>
          <Disclosure>
            <DisclosureTrigger>Advanced options</DisclosureTrigger>
            <DisclosurePanel>
              <Text>Optional settings are available here.</Text>
            </DisclosurePanel>
          </Disclosure>
          <Tooltip>
            <TooltipTrigger aria-label="Refresh activity">Refresh</TooltipTrigger>
            <TooltipContent>Refresh activity</TooltipContent>
          </Tooltip>
          <Text role="status">{archived ? 'Archived' : 'Ready'}</Text>
          <Button variant="secondary" onClick={() => setDark(!dark)}>
            Toggle theme
          </Button>
        </Stack>
      </Surface>
    </Theme>
  );
}

createRoot(document.getElementById('root')!).render(<Controls />);
