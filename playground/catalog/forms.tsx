import { useState } from 'react';
import { CheckCircle, Cube } from '@phosphor-icons/react';
import * as UI from '../../src/index.js';
import { Example } from './example.js';

const installCommand = 'pnpm add --save-exact @nanostackorg/design-system';

function ComposedForm() {
  const [name, setName] = useState('Release verification');
  const [environment, setEnvironment] = useState('staging');
  const [tags, setTags] = useState(['release']);
  const [checked, setChecked] = useState(true);
  const [notice, setNotice] = useState('No network request is made.');
  return (
    <UI.Form
      onSubmit={(event) => {
        event.preventDefault();
        setNotice(`Saved preview: ${name} (${environment}).`);
      }}
    >
      <UI.Grid columns={2} gap="lg">
        <UI.Stack gap="lg">
          <UI.Field name="catalog-record-name">
            <UI.FieldLabel>Record name</UI.FieldLabel>
            <UI.Input value={name} onChange={(event) => setName(event.target.value)} required />
            <UI.FieldDescription>A short name that describes the outcome.</UI.FieldDescription>
          </UI.Field>
          <UI.Field name="catalog-environment">
            <UI.FieldLabel htmlFor="catalog-environment">Environment</UI.FieldLabel>
            <UI.Autocomplete
              id="catalog-environment"
              label="Environment"
              value={environment}
              onValueChange={setEnvironment}
              suggestions={['development', 'staging', 'production']}
            />
            <UI.FieldDescription>
              Choose a suggestion or enter a new environment.
            </UI.FieldDescription>
          </UI.Field>
          <UI.Field name="catalog-tags">
            <UI.FieldLabel htmlFor="catalog-tags">Tags</UI.FieldLabel>
            <UI.TagInput
              inputId="catalog-tags"
              value={tags}
              onChange={setTags}
              aria-label="Tags"
              placeholder="Add a tag…"
            />
          </UI.Field>
        </UI.Stack>
        <UI.Stack gap="lg">
          <UI.Field name="catalog-description">
            <UI.FieldLabel>Description</UI.FieldLabel>
            <UI.Textarea
              placeholder="What does this verify?"
              defaultValue="Verify the request and inspect the response before release."
            />
          </UI.Field>
          <UI.Field name="catalog-region">
            <UI.FieldLabel>Region</UI.FieldLabel>
            <UI.Select
              defaultValue="eu"
              options={[
                { value: 'eu', label: 'Europe' },
                { value: 'us', label: 'United States' },
                { value: 'ca', label: 'Canada' },
              ]}
            />
          </UI.Field>
          <UI.Label>
            <UI.Cluster>
              <UI.Checkbox checked={checked} onCheckedChange={setChecked} />
              Enable notifications
            </UI.Cluster>
          </UI.Label>
          <UI.Field name="catalog-owned" disabled>
            <UI.FieldLabel>Workspace</UI.FieldLabel>
            <UI.Input value="Example workspace" disabled />
            <UI.FieldDescription>Managed by an administrator.</UI.FieldDescription>
          </UI.Field>
        </UI.Stack>
      </UI.Grid>
      <UI.FormActions>
        <UI.Button type="submit">Save preview</UI.Button>
        <UI.Text size="sm" tone="muted" role="status">
          {notice}
        </UI.Text>
      </UI.FormActions>
    </UI.Form>
  );
}

function ValidationExample() {
  const [slug, setSlug] = useState('Release Notes');
  const [channels, setChannels] = useState({ failures: true, recoveries: false });
  const slugError =
    slug.length === 0
      ? 'Enter an address.'
      : /^[a-z0-9-]+$/.test(slug)
        ? null
        : 'Use lowercase letters, numbers and hyphens.';
  return (
    <UI.Grid columns={2} gap="lg">
      <UI.Field name="catalog-slug" invalid={slugError !== null}>
        <UI.FieldLabel>Public address</UI.FieldLabel>
        <UI.Input value={slug} onChange={(event) => setSlug(event.target.value)} />
        <UI.FieldDescription>Appears in shared links.</UI.FieldDescription>
        {slugError ? <UI.FieldError match>{slugError}</UI.FieldError> : null}
      </UI.Field>
      <UI.FieldGroup>
        <UI.FieldGroupLegend>Notify me about</UI.FieldGroupLegend>
        <UI.Stack gap="sm">
          <UI.Label>
            <UI.Cluster>
              <UI.Checkbox
                checked={channels.failures}
                onCheckedChange={(failures) => setChannels({ ...channels, failures })}
              />
              Failures
            </UI.Cluster>
          </UI.Label>
          <UI.Label>
            <UI.Cluster>
              <UI.Checkbox
                checked={channels.recoveries}
                onCheckedChange={(recoveries) => setChannels({ ...channels, recoveries })}
              />
              Recoveries
            </UI.Cluster>
          </UI.Label>
        </UI.Stack>
      </UI.FieldGroup>
    </UI.Grid>
  );
}

function TagsAndCopy() {
  const [labels, setLabels] = useState(['billing']);
  return (
    <UI.Grid columns={2} gap="lg">
      <UI.Field name="catalog-labels">
        <UI.FieldLabel htmlFor="catalog-labels">Labels</UI.FieldLabel>
        <UI.TagAutocomplete
          inputId="catalog-labels"
          aria-label="Labels"
          value={labels}
          onChange={setLabels}
          suggestions={['billing', 'onboarding', 'operations', 'payments', 'security']}
        />
        <UI.FieldDescription>Pick a suggestion or create a new label.</UI.FieldDescription>
      </UI.Field>
      <UI.Field name="catalog-install">
        <UI.FieldLabel>Install command</UI.FieldLabel>
        <UI.ControlRow>
          <UI.Input value={installCommand} readOnly />
          <UI.CopyButton variant="secondary" value={installCommand} label="Copy" />
        </UI.ControlRow>
        <UI.FieldDescription>
          Success shows only after the clipboard write resolves.
        </UI.FieldDescription>
      </UI.Field>
    </UI.Grid>
  );
}

export function Forms() {
  const [start, setStart] = useState<'template' | 'empty'>('template');
  return (
    <UI.Stack gap="xl">
      <Example
        title="Composed forms"
        description="Labels, descriptions and validation remain attached to the real control. Values and submission belong to the application."
      >
        <ComposedForm />
      </Example>
      <Example
        title="Validation and grouped fields"
        description="Field shows the application's error beside the control and marks it invalid. FieldGroup names a set of related controls."
      >
        <ValidationExample />
      </Example>
      <Example
        title="Suggestions and copying"
        description="TagAutocomplete filters suggestions as you type. CopyButton reports the result of the clipboard write."
      >
        <TagsAndCopy />
      </Example>
      <Example
        title="Whole-card choices"
        description="A choice card is one native button with a title, a description and an optional icon. Selection state is application data."
      >
        <UI.Grid columns={2}>
          <UI.ChoiceCard
            title="Start from a template"
            description="Copy a working example and adapt it to your data."
            icon={<UI.Icon glyph={Cube} />}
            selected={start === 'template'}
            onClick={() => setStart('template')}
          />
          <UI.ChoiceCard
            title="Start from scratch"
            description="Begin with an empty record and add each part yourself."
            icon={<UI.Icon glyph={CheckCircle} />}
            selected={start === 'empty'}
            onClick={() => setStart('empty')}
          />
        </UI.Grid>
      </Example>
      <UI.Disclosure>
        <UI.DisclosureTrigger>How to add a new variation</UI.DisclosureTrigger>
        <UI.DisclosurePanel>
          <UI.Surface tone="subtle">
            <UI.Text>
              Document a concrete use case, add a finite semantic option, and test the shared
              implementation. Consumers continue assembling the same named parts.
            </UI.Text>
          </UI.Surface>
        </UI.DisclosurePanel>
      </UI.Disclosure>
    </UI.Stack>
  );
}
