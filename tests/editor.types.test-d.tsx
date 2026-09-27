import { CodeEditor, CodeViewer } from '../src/components/code-editor.js';
import { VariableAwareInput } from '../src/components/variable-aware-input.js';

<CodeEditor label="Body" height="compact" variant="editor" language="json" />;
<CodeViewer aria-labelledby="response-heading" height="fill" value="{}" />;
<VariableAwareInput label="Body" multiline height="content" />;
// @ts-expect-error An editor needs an accessible name.
<CodeEditor />;
// @ts-expect-error A viewer needs an accessible name.
<CodeViewer value="{}" />;
// @ts-expect-error A variable-aware input needs an accessible name.
<VariableAwareInput />;
// @ts-expect-error A generic ARIA label is not the editor's naming contract.
<VariableAwareInput aria-label="URL" />;
// @ts-expect-error Choose one naming source.
<CodeEditor label="Body" aria-labelledby="body-heading" />;
// @ts-expect-error A label is text, not an element.
<CodeEditor label={<span>Body</span>} />;
// @ts-expect-error Only finite library heights are supported.
<CodeEditor label="Body" height="200px" />;
// @ts-expect-error No raw CSS dimensions.
<CodeEditor label="Body" minHeight="10rem" />;
// @ts-expect-error No custom CSS.
<CodeEditor label="Body" style={{ height: 100 }} />;
// @ts-expect-error No custom classes.
<CodeViewer label="Response" className="override" />;
// @ts-expect-error No CodeMirror theme/extension escape.
<CodeEditor label="Body" extensions={[]} />;
// @ts-expect-error The editor owns its DOM.
<CodeEditor label="Body" render={<input />} />;
// @ts-expect-error No custom CSS in the variable-aware facade.
<VariableAwareInput label="URL" className="override" />;
// @ts-expect-error Refs expose behavior, never the CodeMirror API.
<CodeEditor label="Body" ref={{ current: { dispatch() {} } }} />;
