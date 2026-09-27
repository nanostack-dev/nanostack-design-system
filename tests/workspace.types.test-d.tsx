import { SourcePane } from '../src/components/source-pane.js';
import { ChoiceCard } from '../src/components/choice-card.js';
import { VariableText } from '../src/components/variable-text.js';
import {
  PreviewFrame,
  TreeItem,
  WorkspaceSplit,
  useWorkspaceLayout,
  type WorkspaceSplitLayout,
} from '../src/blocks/workspace.js';
// @ts-expect-error Consumer style is not a supported source presentation variant.
<SourcePane label="Base" lines={[]} style={{ color: 'red' }} />;
// @ts-expect-error Choice presentation belongs to the library.
<ChoiceCard title="Choice" description="Detail" className="custom" />;
// @ts-expect-error Variable content cannot replace its element implementation.
<VariableText value="{{name}}" as="div" />;
// @ts-expect-error Preview dimensions are finite library presets.
<PreviewFrame width="900px" />;
// @ts-expect-error Split pane engines remain encapsulated.
<WorkspaceSplit label="Split" primary={null} secondary={null} className="custom" />;
<WorkspaceSplit
  label="Split"
  primary={null}
  secondary={null}
  defaultLayout={{ primary: 60, secondary: 40 }}
  onLayoutChanged={(layout: WorkspaceSplitLayout, change) =>
    layout.primary + layout.secondary + Number(change.isUserInteraction)
  }
/>;
<WorkspaceSplit
  label="Split"
  primary={null}
  secondary={null}
  // @ts-expect-error Pane keys are library names, not engine panel ids.
  defaultLayout={{ request: 60, response: 40 }}
/>;
export function PersistedSplit() {
  const persistence = useWorkspaceLayout({ id: 'request-split' });
  const restored: WorkspaceSplitLayout | undefined = persistence.defaultLayout;
  // @ts-expect-error The engine's deprecated live callback is not part of the wrapper.
  void persistence.onLayoutChange;
  // @ts-expect-error Engine storage tuning stays private.
  useWorkspaceLayout({ id: 'request-split', debounceSaveMs: 0 });
  return (
    <WorkspaceSplit
      label="Split"
      primary={null}
      secondary={null}
      defaultLayout={restored}
      onLayoutChanged={persistence.onLayoutChanged}
    />
  );
}
<TreeItem expanded={false} onExpandedChange={(expanded: boolean) => expanded} />;
// @ts-expect-error Expansion is a boolean state, not a label.
<TreeItem expanded="open" />;
<VariableText value="{{name}}" interactive={false} />;
// @ts-expect-error Chip interactivity is on or off.
<VariableText value="{{name}}" interactive="tooltip" />;
