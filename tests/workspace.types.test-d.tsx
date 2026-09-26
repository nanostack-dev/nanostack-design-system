import { SourcePane } from '../src/components/source-pane.js';
import { ChoiceCard } from '../src/components/choice-card.js';
import { VariableText } from '../src/components/variable-text.js';
import { PreviewFrame, WorkspaceSplit } from '../src/blocks/workspace.js';
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
