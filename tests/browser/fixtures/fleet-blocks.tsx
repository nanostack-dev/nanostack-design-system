import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Theme } from '../../../src/theme.js';
import { CapacityMeter } from '../../../src/components/capacity-meter.js';
import { WorkerAvatar } from '../../../src/components/worker-avatar.js';
import { Stack, Surface } from '../../../src/components/layout.js';
import { Heading, Text } from '../../../src/components/typography.js';
import {
  ResourceTile,
  ResourceTileGrid,
  ResourceTileBody,
  ResourceTileHeader,
  ResourceTileLabel,
  ResourceTileMeta,
  ResourceTileStatus,
} from '../../../src/blocks/resource-tile.js';
import '../../../src/styles.css';

function Fixture() {
  const [selected, setSelected] = useState(false);
  const [readout, setReadout] = useState('Four workers online');
  const dark = new URLSearchParams(window.location.search).has('dark');
  return (
    <Theme colorScheme={dark ? 'dark' : 'light'}>
      <main>
        <Surface>
          <Stack>
            <Heading level={1}>Worker capacity</Heading>
            <Text role="status">{readout}</Text>
            <ResourceTileGrid>
              {(['idle', 'working', 'staling', 'alarmed'] as const).map((state, index) => (
                <ResourceTile
                  key={state}
                  aria-label={`Worker ${state}`}
                  aria-expanded={index === 0 && selected}
                  selected={index === 0 && selected}
                  tone={state === 'alarmed' ? 'danger' : 'default'}
                  onClick={() => setSelected(!selected)}
                >
                  <WorkerAvatar
                    variant="pebble"
                    load={index / 3}
                    staling={state === 'staling'}
                    alarmed={state === 'alarmed'}
                    beat="heartbeat"
                    seed={state}
                  />
                  <ResourceTileBody>
                    <ResourceTileHeader>
                      <ResourceTileLabel>Worker {state}</ResourceTileLabel>
                      <ResourceTileMeta>{index}/3</ResourceTileMeta>
                    </ResourceTileHeader>
                    <CapacityMeter
                      segments={[
                        {
                          id: 'one',
                          state: state === 'alarmed' ? 'expired' : index > 0 ? 'busy' : 'free',
                        },
                        { id: 'two', state: 'expiring' },
                        { id: 'three', state: 'free' },
                      ]}
                      hiddenCount={2}
                      onSegmentEnter={() => setReadout('Job details')}
                      onSegmentLeave={() => setReadout('Four workers online')}
                    />
                    <ResourceTileStatus
                      tone={
                        state === 'alarmed' ? 'danger' : state === 'staling' ? 'warning' : 'default'
                      }
                    >
                      {state}
                    </ResourceTileStatus>
                  </ResourceTileBody>
                </ResourceTile>
              ))}
            </ResourceTileGrid>
          </Stack>
        </Surface>
      </main>
    </Theme>
  );
}
createRoot(document.getElementById('root')!).render(<Fixture />);
