import { useState } from 'react';
import { Code as CodeGlyph, Play } from '@phosphor-icons/react';
import * as UI from '../../src/index.js';
import { Example } from './example.js';

const initialDocument =
  '{\n  "event": "release.ready",\n  "environment": "staging",\n  "verified": true\n}';
export function Editors() {
  const [fileName, setFileName] = useState('payload.json');
  const [document, setDocument] = useState(initialDocument);
  const [saved, setSaved] = useState(true);
  const [result, setResult] = useState('{\n  "checked": false\n}');
  const valid = result.includes('"valid": true');
  return (
    <UI.Stack gap="xl">
      <Example
        title="Code editor and viewer"
        description="Editor geometry, syntax colors, focus, undo history and read-only behavior belong to the library. This example owns only the document state."
      >
        <UI.PreviewFrame width="wide">
          <UI.Grid columns={2} gap="lg">
            <UI.Card>
              <UI.CardHeader>
                <UI.Cluster>
                  <UI.Icon glyph={CodeGlyph} size="sm" />
                  <UI.EditableText
                    value={fileName}
                    label="Document name"
                    variant="code"
                    onCommit={setFileName}
                  />
                </UI.Cluster>
              </UI.CardHeader>
              <UI.CardContent>
                <UI.CodeEditor
                  label="Example document"
                  value={document}
                  onChange={(value) => {
                    setDocument(value);
                    setSaved(false);
                  }}
                  language="json"
                  lineNumbers
                />
              </UI.CardContent>
              <UI.CardFooter>
                <UI.Cluster justify="between">
                  <UI.Text size="xs" tone="muted">
                    {saved ? 'Saved in this preview' : 'Unsaved preview changes'}
                  </UI.Text>
                  <UI.Cluster gap="sm">
                    <UI.Button
                      variant="ghost"
                      size="sm"
                      disabled={saved}
                      onClick={() => setSaved(true)}
                    >
                      Save document
                    </UI.Button>
                    <UI.Button
                      size="sm"
                      onClick={() => setResult('{\n  "valid": true,\n  "fields": 3\n}')}
                    >
                      <UI.Icon glyph={Play} size="sm" />
                      Check example
                    </UI.Button>
                  </UI.Cluster>
                </UI.Cluster>
              </UI.CardFooter>
            </UI.Card>
            <UI.Card tone="subtle">
              <UI.CardHeader>
                <UI.Cluster>
                  <UI.Badge tone={valid ? 'success' : 'neutral'}>
                    {valid ? 'Valid' : 'Not checked'}
                  </UI.Badge>
                  <UI.CardTitle>Result</UI.CardTitle>
                </UI.Cluster>
              </UI.CardHeader>
              <UI.CardContent>
                <UI.CodeViewer label="Example result" value={result} language="json" lineNumbers />
              </UI.CardContent>
            </UI.Card>
          </UI.Grid>
        </UI.PreviewFrame>
      </Example>
      <UI.Callout>
        <UI.Text size="sm">
          Try editing the document, renaming it and checking the example. Everything is local sample
          data.
        </UI.Text>
      </UI.Callout>
    </UI.Stack>
  );
}
