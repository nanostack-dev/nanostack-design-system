import { useState } from 'react';
import { Clock } from '@phosphor-icons/react';
import * as UI from '../../src/index.js';
import { Example } from './example.js';

const historyRows = Array.from({ length: 30 }, (_, index) => ({
  id: `run_${index + 1}`,
  name: `Example run ${index + 1}`,
  duration: 120 + ((index * 37) % 500),
  failed: index % 7 === 0,
}));

function MeasuredHistory() {
  const [selected, setSelected] = useState('run_1');
  return (
    <UI.Grid columns={2} gap="lg">
      <UI.VirtualList
        label="Example run history"
        items={historyRows}
        getItemKey={(row) => row.id}
        renderItem={(row) => (
          <UI.ResourceRowButton selected={selected === row.id} onClick={() => setSelected(row.id)}>
            <UI.Cluster justify="between">
              <UI.Text weight="medium" size="sm">
                {row.name}
              </UI.Text>
              <UI.StatusMarker variant="dot" tone={row.failed ? 'danger' : 'success'}>
                {row.failed ? 'Failed' : 'Passed'}
              </UI.StatusMarker>
            </UI.Cluster>
            <UI.Text size="xs" tone="muted">
              {row.duration} ms · {row.id}
            </UI.Text>
          </UI.ResourceRowButton>
        )}
      />
      <UI.Surface>
        <UI.Stack gap="lg">
          <UI.Heading level={3}>Selected record</UI.Heading>
          <UI.Text size="sm" role="status">
            Selected: {selected}
          </UI.Text>
          <UI.Divider />
          <UI.TimelineItem
            label="Receive"
            detail="120 ms"
            tone="success"
            interval={{ start: 0, end: 28 }}
            selected={selected === 'receive'}
            onClick={() => setSelected('receive')}
          />
          <UI.TimelineItem
            label="Verify"
            detail="280 ms"
            tone="info"
            annotation="Retried once"
            interval={{ start: 28, end: 94 }}
            selected={selected === 'verify'}
            onClick={() => setSelected('verify')}
          />
        </UI.Stack>
      </UI.Surface>
    </UI.Grid>
  );
}

export function DataDisplay() {
  return (
    <UI.Stack gap="xl">
      <Example
        title="Trends and progress"
        description="Metric summarizes a value. Sparkline shows a trend with a label that states its meaning. Progress is determinate or indeterminate."
      >
        <UI.Grid columns={3}>
          <UI.Surface>
            <UI.Stack gap="sm">
              <UI.Metric label="Requests this week" value="12,480" hint="Up 8% from last week" />
              <UI.Sparkline
                label="Requests rose from 1,420 to 2,010 over seven days"
                values={[1420, 1610, 1580, 1720, 1690, 1880, 2010]}
                tone="info"
              />
            </UI.Stack>
          </UI.Surface>
          <UI.Surface>
            <UI.Stack gap="sm">
              <UI.Metric
                label="Error rate"
                value="0.4%"
                hint="Below the 1% target"
                tone="success"
              />
              <UI.Sparkline
                label="Errors fell from 1.2% to 0.4% over seven days"
                values={[1.2, 1.1, 0.9, 0.8, 0.7, 0.5, 0.4]}
                tone="success"
              />
            </UI.Stack>
          </UI.Surface>
          <UI.Surface>
            <UI.Stack gap="md">
              <UI.Text size="sm" weight="medium">
                Import progress
              </UI.Text>
              <UI.Progress label="Import progress" value={64} />
              <UI.Text size="sm" weight="medium">
                Preparing the export
              </UI.Text>
              <UI.Progress label="Preparing the export" />
            </UI.Stack>
          </UI.Surface>
        </UI.Grid>
      </Example>
      <Example
        title="Status markers"
        description="A compact state label: a pill, inline text or a dot, with an optional active pulse. The meaning of each state belongs to the application."
      >
        <UI.Stack gap="md">
          <UI.Cluster>
            <UI.StatusMarker>Draft</UI.StatusMarker>
            <UI.StatusMarker tone="info" activity="active">
              Syncing
            </UI.StatusMarker>
            <UI.StatusMarker tone="success">Healthy</UI.StatusMarker>
            <UI.StatusMarker tone="warning">Degraded</UI.StatusMarker>
            <UI.StatusMarker tone="danger">Offline</UI.StatusMarker>
          </UI.Cluster>
          <UI.Cluster gap="lg">
            <UI.StatusMarker
              variant="inline"
              tone="info"
              leading={<UI.Icon glyph={Clock} size="sm" />}
            >
              Scheduled for 09:00
            </UI.StatusMarker>
            <UI.StatusMarker variant="dot" tone="success">
              Connected
            </UI.StatusMarker>
            <UI.StatusMarker variant="dot" tone="warning" activity="active">
              Reconnecting
            </UI.StatusMarker>
          </UI.Cluster>
        </UI.Stack>
      </Example>
      <Example
        title="Measured history"
        description="Virtual rows accept records and measure each row. Timeline items place numeric intervals. Their dimensions and visual treatment remain private."
      >
        <MeasuredHistory />
      </Example>
      <Example
        title="Report"
        description="A record surface whose heading stays visible while its content scrolls past."
      >
        <UI.Report aria-labelledby="catalog-report-title">
          <UI.ReportHeader>
            <UI.Cluster justify="between">
              <UI.Heading id="catalog-report-title" level={3} size="lg">
                Weekly summary
              </UI.Heading>
              <UI.Badge tone="success">On track</UI.Badge>
            </UI.Cluster>
          </UI.ReportHeader>
          <UI.ReportContent>
            <UI.DefinitionList layout="stacked">
              <UI.DefinitionItem label="Period">September 21 to 27</UI.DefinitionItem>
              <UI.DefinitionItem label="Completed">42 of 45 checks</UI.DefinitionItem>
              <UI.DefinitionItem label="Needs review">
                Three checks waited longer than their limit.
              </UI.DefinitionItem>
            </UI.DefinitionList>
          </UI.ReportContent>
        </UI.Report>
      </Example>
    </UI.Stack>
  );
}
