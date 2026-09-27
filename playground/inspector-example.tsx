import { useRef, useState } from 'react';
import * as UI from '../src/index.js';

export function InspectorExample() {
  const canvas = useRef<UI.GraphCanvasHandle>(null);
  const [panel, setPanel] = useState<'none' | 'sidebar' | 'bottom-sheet'>('none');
  const [selected, setSelected] = useState('first');
  const [preview, setPreview] = useState<string | null>(null);
  const [outsideClicks, setOutsideClicks] = useState(0);
  const inspect = (next: typeof panel) => {
    setPanel(next);
    canvas.current?.revealNode('node', { occlusion: next, entering: panel === 'none' });
  };
  const detail = <UI.Surface padding="md"><UI.Stack><UI.Heading level={2}>Item details</UI.Heading><UI.Input aria-label="Item name" defaultValue="Selected item" /><UI.Button onClick={() => setPanel('none')}>Close inspector</UI.Button></UI.Stack></UI.Surface>;
  return <UI.Stack>
    <UI.Cluster>
      <UI.Button onClick={() => inspect('sidebar')}>Open sidebar</UI.Button>
      <UI.Button onClick={() => inspect('bottom-sheet')}>Open sheet</UI.Button>
      <UI.Button onClick={() => canvas.current?.revealNode('node', { occlusion: panel })}>Reveal again</UI.Button>
      <UI.Button onClick={() => setOutsideClicks(outsideClicks + 1)}>Canvas action</UI.Button>
    </UI.Cluster>
    <UI.Text>Canvas actions: {outsideClicks}</UI.Text>
    <UI.Dock>
      <UI.DockBody>
        <UI.DockMain>
          <UI.GraphCanvas ref={canvas} label="Inspector graph" nodes={[{
            id: 'node', position: { x: 500, y: 360 }, data: {}, width: 'compact', ariaLabel: 'Selected item',
            content: <><UI.GraphNodeHeader>Selected item</UI.GraphNodeHeader><UI.GraphNodeBody>Keep this item visible while inspecting it.</UI.GraphNodeBody></>,
          }]} edges={[]} controls={<UI.GraphViewportControls />} />
          <UI.DockSheet open={panel === 'bottom-sheet'} aria-label="Bottom inspector">{detail}</UI.DockSheet>
        </UI.DockMain>
        <UI.DockSidebar open={panel === 'sidebar'} size="inspector" side="end" aria-label="Side inspector">{detail}</UI.DockSidebar>
      </UI.DockBody>
    </UI.Dock>
    <UI.BarStrip label="Choose a run" selection="single" selectedId={selected} onSelect={setSelected} onPreview={setPreview} points={[
      { id: 'first', value: 40, label: 'First run', tone: 'success' },
      { id: 'second', value: 70, label: 'Second run', tone: 'danger' },
      { id: 'live', value: 50, label: 'Live run', tone: 'info' },
    ]} />
    <UI.Text role="status">Selected: {selected}; preview: {preview ?? 'none'}</UI.Text>
  </UI.Stack>;
}

