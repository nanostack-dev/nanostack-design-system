import { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Autocomplete,
  Button,
  Cluster,
  Code,
  DataTable,
  Heading,
  Grid,
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
  Progress,
  ResourceRowButton,
  Select,
  Sparkline,
  Stack,
  Surface,
  Text,
  Theme,
  VirtualList,
  WorkerAvatar,
} from '../../../src/index.js';
import '../../../src/styles.css';

const serverRuns = Array.from({ length: 42 }, (_, index) => ({
  id: `run-${index + 1}`,
  name: `Run ${index + 1}`,
}));

function ServerRuns() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [selectedRunIds, setSelectedRunIds] = useState<string[]>([]);
  const start = pagination.pageIndex * pagination.pageSize;
  return (
    <Stack>
      <DataTable
        label="Server runs"
        mode="manual"
        data={serverRuns.slice(start, start + pagination.pageSize)}
        rowCount={serverRuns.length}
        pagination={pagination}
        onPaginationChange={(update) =>
          setPagination((current) => (typeof update === 'function' ? update(current) : update))
        }
        pageSizeOptions={[5, 10]}
        columns={[{ accessorKey: 'name', header: 'Name' }]}
        enableColumnVisibility={false}
        enableRowSelection
        getRowId={(run) => run.id}
        getRowLabel={(run) => run.name}
        selectedRowIds={selectedRunIds}
        onSelectedRowIdsChange={setSelectedRunIds}
      />
      <Text>Selected runs: {selectedRunIds.join(', ') || 'none'}</Text>
    </Stack>
  );
}

function Deliveries() {
  const [count, setCount] = useState(4);
  const [requests, setRequests] = useState(0);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const offline = useRef(true);
  return (
    <Stack>
      <VirtualList
        label="Deliveries"
        items={Array.from({ length: count }, (_, index) => ({ id: String(index) }))}
        getItemKey={(item) => item.id}
        hasMore={count < 12}
        loadingMore={loading}
        loadMoreFailed={failed}
        loadMoreFailedMessage="Deliveries could not be loaded."
        onEndReached={() => {
          setRequests((value) => value + 1);
          setFailed(false);
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            if (offline.current) setFailed(true);
            else setCount((value) => value + 4);
          }, 50);
        }}
        renderItem={(item) => (
          <ResourceRowButton>
            <Text>Delivery {item.id}</Text>
          </ResourceRowButton>
        )}
      />
      <Cluster>
        <Text>Delivery requests: {requests}</Text>
        <Button variant="secondary" onClick={() => (offline.current = false)}>
          Restore network
        </Button>
      </Cluster>
    </Stack>
  );
}

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
          <ServerRuns />
          <Deliveries />
        </Stack>
      </Surface>
    </Theme>
  );
}
createRoot(document.getElementById('root')!).render(<Collections />);
