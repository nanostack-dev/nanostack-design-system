import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RepeatIcon } from '@phosphor-icons/react';
import {
  Theme,
  DocumentTheme,
  Heading,
  Page,
  Grid,
  Stack,
  Cluster,
  Button,
  GraphNodeFrame,
  GraphNodeBody,
  NodeHeading,
  NodeIcon,
  NodeMeter,
  NodeAttempts,
  NodeChecks,
  NodeSection,
  NodeRunGlyph,
  NodeRoutes,
  NodeRoute,
  NodeTelemetry,
  NodeCaption,
} from '../../../src/index.js';
import '../../../src/styles.css';
function Example() {
  const [phase, setPhase] = useState<'running' | 'success'>('running');
  const [dark, setDark] = useState(false);
  return (
    <Theme colorScheme={dark ? 'dark' : 'light'}>
      <DocumentTheme />
      <Page>
        <Stack>
          <Heading level={1}>Node presentation</Heading>
          <Cluster>
            <Button onClick={() => setPhase('success')}>Finish</Button>
            <Button onClick={() => setDark(!dark)}>Toggle theme</Button>
          </Cluster>
          <Grid>
            <GraphNodeFrame
              family="wait"
              phase={phase}
              instant={phase === 'success'}
              width="compact"
            >
              <GraphNodeBody>
                <NodeHeading
                  icon={
                    <NodeIcon
                      glyph={RepeatIcon}
                      motion={phase === 'running' ? 'tick' : 'steady'}
                      intervalMs={1000}
                    />
                  }
                  title="Verify readiness"
                  actions={<NodeRunGlyph phase={phase} />}
                />
                <NodeSection label="Progress">
                  {phase === 'running' ? (
                    <NodeMeter
                      label="Duration"
                      mode="duration"
                      durationMs={10000}
                      elapsedMs={5000}
                    />
                  ) : (
                    <NodeMeter label="Duration" value={1} />
                  )}
                </NodeSection>
                <NodeSection label="Attempts">
                  <NodeAttempts
                    label="Attempts"
                    total={4}
                    {...(phase === 'success' ? { used: 3, outcome: 'passed' } : {})}
                  />
                </NodeSection>
                <NodeChecks
                  items={[
                    { label: 'Result is ready', state: phase === 'success' ? 'passed' : 'pending' },
                  ]}
                />
                <NodeRoutes>
                  <NodeRoute target="complete" state={phase === 'success' ? 'taken' : 'idle'}>
                    ready equals true
                  </NodeRoute>
                </NodeRoutes>
              </GraphNodeBody>
              <NodeTelemetry phase={phase}>
                <NodeCaption>
                  {phase === 'running' ? 'Checking readiness' : 'Passed in 3 seconds'}
                </NodeCaption>
              </NodeTelemetry>
            </GraphNodeFrame>
          </Grid>
        </Stack>
      </Page>
    </Theme>
  );
}
createRoot(document.getElementById('root')!).render(<Example />);
