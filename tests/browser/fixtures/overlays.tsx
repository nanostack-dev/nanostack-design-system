import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Autocomplete,
  Button,
  Cluster,
  ConfirmationDialog,
  Dialog,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
  DocumentTheme,
  Heading,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  Page,
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
  ResponsivePanel,
  Stack,
  TagAutocomplete,
  Text,
  Theme,
  Toaster,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  toast,
} from '../../../src/index.js';
import '../../../src/styles.css';

function LayeredControls() {
  const [lastAction, setLastAction] = useState('none');
  const [environment, setEnvironment] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  return (
    <Stack>
      <Cluster>
        <Menu>
          <MenuTrigger variant="secondary">Flow actions</MenuTrigger>
          <MenuContent>
            <MenuItem onClick={() => setLastAction('duplicate')}>Duplicate</MenuItem>
            <MenuItem onClick={() => setLastAction('archive')}>Archive</MenuItem>
          </MenuContent>
        </Menu>
        <Popover>
          <PopoverTrigger variant="secondary">Schedule</PopoverTrigger>
          <PopoverContent>
            <Stack>
              <PopoverTitle>Schedule</PopoverTitle>
              <Button onClick={() => setLastAction('schedule')}>Save schedule</Button>
            </Stack>
          </PopoverContent>
        </Popover>
        <Tooltip>
          <TooltipTrigger variant="secondary" aria-label="Help">
            Help
          </TooltipTrigger>
          <TooltipContent>Runs on every push</TooltipContent>
        </Tooltip>
        <Button variant="secondary" onClick={() => toast('Flow saved')}>
          Show toast
        </Button>
      </Cluster>
      <Autocomplete
        label="Environment"
        suggestions={['production', 'preview', 'staging']}
        value={environment}
        onValueChange={setEnvironment}
      />
      <TagAutocomplete
        aria-label="Tags"
        value={tags}
        onChange={setTags}
        suggestions={['operations', 'payments']}
      />
      <Text role="status">Last action: {lastAction}</Text>
    </Stack>
  );
}

function Overlays() {
  const [dark, setDark] = useState(
    () => new URLSearchParams(window.location.search).get('theme') === 'dark',
  );
  const [panelOpen, setPanelOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteRequests, setDeleteRequests] = useState(0);
  return (
    <Theme colorScheme={dark ? 'dark' : 'light'}>
      <DocumentTheme />
      <Page>
        <Stack>
          <Heading level={1}>Overlays inside modal layers</Heading>
          <Cluster>
            <Button variant="secondary" onClick={() => setDark(!dark)}>
              Toggle theme
            </Button>
            <Dialog>
              <DialogTrigger>Open dialog</DialogTrigger>
              <DialogPopup>
                <Stack>
                  <DialogTitle>Edit flow</DialogTitle>
                  <LayeredControls />
                </Stack>
              </DialogPopup>
            </Dialog>
            <Button variant="secondary" onClick={() => setPanelOpen(true)}>
              Open panel
            </Button>
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>
              Delete flow
            </Button>
          </Cluster>
          <Text>Delete requests: {deleteRequests}</Text>
          <ResponsivePanel label="Flow details" open={panelOpen} onOpenChange={setPanelOpen}>
            <Stack>
              <Heading level={2}>Flow details</Heading>
              <LayeredControls />
              <Button variant="secondary" onClick={() => setPanelOpen(false)}>
                Close panel
              </Button>
            </Stack>
          </ResponsivePanel>
          <ConfirmationDialog
            open={confirmOpen}
            onOpenChange={(open) => {
              setConfirmOpen(open);
              if (!open) setDeleting(false);
            }}
            severity="destructive"
            title="Delete flow?"
            description="The flow and its run history are removed."
            actionLabel="Delete"
            pending={deleting}
            onAction={() => {
              setDeleteRequests((count) => count + 1);
              setDeleting(true);
            }}
          />
        </Stack>
      </Page>
      <Toaster />
    </Theme>
  );
}
createRoot(document.getElementById('root')!).render(<Overlays />);
