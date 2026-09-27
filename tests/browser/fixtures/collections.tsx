import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Autocomplete,
  Button,
  Cluster,
  Code,
  Heading,
  Grid,
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
  Progress,
  Select,
  Sparkline,
  Stack,
  Surface,
  Text,
  Theme,
  WorkerAvatar,
} from '../../../src/index.js';
import '../../../src/styles.css';
function Collections() {
  const [dark, setDark] = useState(false);
  const [environment, setEnvironment] = useState('');
  return (
    <Theme colorScheme={dark ? 'dark' : 'light'}>
      <Surface padding="lg">
        <Stack gap="lg">
          <Heading level={1}>Collection building blocks</Heading>
          <Grid layout="navigation">
            <Surface data-testid="navigation-track">
              <Text>Navigation</Text>
            </Surface>
            <Surface data-testid="detail-track">
              <Text>Selected record</Text>
            </Surface>
          </Grid>
          <Cluster>
            <Select
              aria-label="Toolbar environment"
              width="content"
              options={[{ value: 'staging', label: 'Staging' }]}
            />
            <Select
              aria-label="Toolbar runner"
              width="content"
              options={[{ value: 'cloud', label: 'Cloud' }]}
            />
            <Button>Run task</Button>
          </Cluster>
          <Autocomplete
            label="Environment"
            suggestions={['production', 'preview', 'staging']}
            value={environment}
            onValueChange={setEnvironment}
          />
          <Button variant="secondary" aria-label="Copy endpoint URL">
            <Code>
              https://webhooks.example.com/receive/a-very-long-endpoint-identifier-that-needs-to-wrap-safely-without-overflowing-the-viewport
            </Code>
          </Button>
          <Cluster>
            <Sparkline values={[3, 0, 4, 8, 2, 6]} label="Traffic over six days" tone="info" />
            <WorkerAvatar load={1} alarmed size="lg" label="Worker with an expired lease" />
            <Text>Capacity full</Text>
          </Cluster>
          <Progress label="Sending requests" value={3} max={10} />
          <Popover>
            <PopoverTrigger>Inspect capacity</PopoverTrigger>
            <PopoverContent align="end">
              <PopoverTitle>Workers</PopoverTitle>
              <Stack>
                <Text>3 of 10 slots busy</Text>
                <Button>View jobs</Button>
              </Stack>
            </PopoverContent>
          </Popover>
          <Button variant="secondary" onClick={() => setDark(!dark)}>
            Toggle theme
          </Button>
        </Stack>
      </Surface>
    </Theme>
  );
}
createRoot(document.getElementById('root')!).render(<Collections />);
