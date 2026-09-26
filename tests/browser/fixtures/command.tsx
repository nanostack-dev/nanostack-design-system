import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Theme,
  Page,
  Heading,
  Stack,
  Cluster,
  Text,
  Button,
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandStatus,
  TagAutocomplete,
} from '../../../src/index.js';
import '../../../src/styles.css';

function Fixture() {
  const [mode, setMode] = useState<'ready' | 'loading' | 'error'>('ready');
  const [open, setOpen] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [selected, setSelected] = useState('Nothing selected');
  const [tags, setTags] = useState<string[]>([]);
  return (
    <Theme>
      <Page>
        <Heading level={1}>Command accessibility</Heading>
        <Stack>
          <Cluster>
            <Button onClick={() => setMode('ready')}>Ready</Button>
            <Button onClick={() => setMode('loading')}>Loading</Button>
            <Button onClick={() => setMode('error')}>Error</Button>
            <Button onClick={() => setOpen(!open)}>Toggle suggestions</Button>
            <Button onClick={() => setDisabled(!disabled)}>Toggle disabled</Button>
          </Cluster>
          <Command label="Tasks">
            <CommandInput
              expanded={open}
              disabled={disabled}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setOpen(false);
                if (event.key === 'ArrowDown') setOpen(true);
              }}
            />
            <CommandList hidden={!open || disabled}>
              {mode === 'ready' ? (
                <>
                  <CommandItem value="first" onSelect={() => setSelected('First task')}>
                    First task
                  </CommandItem>
                  <CommandItem value="second" onSelect={() => setSelected('Second task')}>
                    Second task
                  </CommandItem>
                  <CommandEmpty>No tasks match.</CommandEmpty>
                </>
              ) : (
                <CommandStatus>
                  {mode === 'loading' ? 'Loading tasks…' : 'Tasks could not be loaded.'}
                </CommandStatus>
              )}
            </CommandList>
          </Command>
          <Text role="status">{selected}</Text>
          <TagAutocomplete
            aria-label="Tags"
            value={tags}
            onChange={setTags}
            suggestions={['operations', 'payments']}
            allowCreate={false}
            disabled={disabled}
            loading={mode === 'loading'}
          />
        </Stack>
      </Page>
    </Theme>
  );
}
createRoot(document.getElementById('root')!).render(<Fixture />);
