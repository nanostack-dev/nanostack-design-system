import { CodeEditor, CodeViewer } from '../src/components/code-editor.js';
import { VariableAwareInput } from '../src/components/variable-aware-input.js';

<CodeEditor height="compact" variant="editor" language="json" />;
<CodeViewer height="fill" value="{}" />;
<VariableAwareInput multiline height="content" />;
// @ts-expect-error Only finite library heights are supported.
<CodeEditor height="200px" />;
// @ts-expect-error No raw CSS dimensions.
<CodeEditor minHeight="10rem" />;
// @ts-expect-error No custom CSS.
<CodeEditor style={{ height: 100 }} />;
// @ts-expect-error No custom classes.
<CodeViewer className="override" />;
// @ts-expect-error No CodeMirror theme/extension escape.
<CodeEditor extensions={[]} />;
// @ts-expect-error The editor owns its DOM.
<CodeEditor render={<input />} />;
// @ts-expect-error No custom CSS in the variable-aware facade.
<VariableAwareInput className="override" />;
// @ts-expect-error Refs expose behavior, never the CodeMirror API.
<CodeEditor ref={{ current: { dispatch() {} } }} />;
