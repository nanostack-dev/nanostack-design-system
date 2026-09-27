import { ArrowRight, CheckCircle, PencilSimple, Warning } from '@phosphor-icons/react';
import * as UI from '../../src/index.js';
import { Example } from './example.js';

const auditEntries = Array.from({ length: 24 }, (_, index) => ({
  id: `entry_${String(index + 1).padStart(2, '0')}`,
  label: `Settings change ${index + 1}`,
}));

export function Foundations() {
  return (
    <UI.Stack gap="xl">
      <UI.Grid columns={3}>
        <UI.Metric
          label="Compose"
          value="Named parts"
          hint="Arrange existing blocks around your product's data."
        />
        <UI.Metric
          label="Vary"
          value="Finite options"
          hint="Choose supported tone, size, density and layout."
        />
        <UI.Metric
          label="Evolve"
          value="One source"
          hint="Add a shared variant when the vocabulary needs to grow."
        />
      </UI.Grid>
      <Example
        title="A shared visual vocabulary"
        description="Brand, color scheme and density change the complete composition together."
      >
        <UI.Grid columns={2} gap="lg">
          <UI.Surface padding="lg">
            <UI.Stack gap="lg">
              <UI.Heading level={3}>Clear hierarchy</UI.Heading>
              <UI.Text>Body copy explains the next useful action.</UI.Text>
              <UI.Text tone="muted" size="sm">
                Supporting information stays legible in either color scheme.
              </UI.Text>
              <UI.Cluster>
                <UI.Code>record_01</UI.Code>
                <UI.KeyboardKey>⌘ K</UI.KeyboardKey>
                <UI.Icon glyph={CheckCircle} tone="success" />
                <UI.Text display="inline" size="sm">
                  Ready to compose
                </UI.Text>
              </UI.Cluster>
              <UI.Divider />
              <UI.Cluster>
                <UI.Badge>Neutral</UI.Badge>
                <UI.Badge tone="info">Info</UI.Badge>
                <UI.Badge tone="success">Success</UI.Badge>
                <UI.Badge tone="warning">Warning</UI.Badge>
                <UI.Badge tone="danger">Danger</UI.Badge>
              </UI.Cluster>
            </UI.Stack>
          </UI.Surface>
          <UI.Card tone="subtle">
            <UI.CardHeader>
              <UI.CardTitle>Common parts, product-owned meaning</UI.CardTitle>
              <UI.CardDescription>
                This card is an assembly. It adds no markup or CSS to the library's parts.
              </UI.CardDescription>
            </UI.CardHeader>
            <UI.CardContent>
              <UI.DefinitionList>
                <UI.DefinitionItem label="Library">
                  Anatomy, focus, geometry and tokens
                </UI.DefinitionItem>
                <UI.DefinitionItem label="Application">
                  Data, permissions, navigation and copy
                </UI.DefinitionItem>
              </UI.DefinitionList>
            </UI.CardContent>
            <UI.CardFooter>
              <UI.Link href="https://github.com/nanostack-dev/nanostack-design-system">
                Read the source <UI.Icon glyph={ArrowRight} size="sm" />
              </UI.Link>
            </UI.CardFooter>
          </UI.Card>
        </UI.Grid>
      </Example>
      <Example
        title="Typography and lists"
        description="Heading level and visual size are separate choices. Text tones carry meaning, and lists keep native semantics."
      >
        <UI.Grid columns={2} gap="lg">
          <UI.Stack gap="md">
            <UI.Heading level={3} size="2xl">
              Release checklist
            </UI.Heading>
            <UI.Heading level={3} size="lg">
              Before you publish
            </UI.Heading>
            <UI.Text size="lg">Large text introduces a region.</UI.Text>
            <UI.Text>
              Search results mark the match: <UI.Highlight>release</UI.Highlight> notes, draft{' '}
              <UI.Highlight>release</UI.Highlight>.
            </UI.Text>
            <UI.Text size="xs" tone="muted">
              Extra-small metadata, such as an update time.
            </UI.Text>
            <UI.Cluster>
              <UI.Text display="inline" tone="info" size="sm">
                Info
              </UI.Text>
              <UI.Text display="inline" tone="success" size="sm">
                Success
              </UI.Text>
              <UI.Text display="inline" tone="warning" size="sm">
                Warning
              </UI.Text>
              <UI.Text display="inline" tone="danger" size="sm">
                Danger
              </UI.Text>
            </UI.Cluster>
          </UI.Stack>
          <UI.Stack gap="md">
            <UI.List>
              <UI.ListItem>Pin the exact package version.</UI.ListItem>
              <UI.ListItem>Import the stylesheet once.</UI.ListItem>
            </UI.List>
            <UI.OrderedList>
              <UI.ListItem>Run the checks.</UI.ListItem>
              <UI.ListItem>Pack the archive.</UI.ListItem>
              <UI.ListItem>Tag the reviewed commit.</UI.ListItem>
            </UI.OrderedList>
            <UI.Cluster>
              <UI.Button variant="secondary" size="icon">
                <UI.Icon glyph={PencilSimple} />
                <UI.VisuallyHidden>Edit the release checklist</UI.VisuallyHidden>
              </UI.Button>
              <UI.Text display="inline" size="sm" tone="muted">
                An icon button named by visually hidden text.
              </UI.Text>
            </UI.Cluster>
          </UI.Stack>
        </UI.Grid>
      </Example>
      <Example
        title="Icons and brand marks"
        description="Icon takes a Phosphor glyph with a finite size and tone. Spinner announces loading. Brand marks follow the theme."
      >
        <UI.Stack gap="lg">
          <UI.Cluster gap="md">
            <UI.Icon glyph={CheckCircle} size="xs" tone="success" />
            <UI.Icon glyph={CheckCircle} size="sm" tone="success" />
            <UI.Icon glyph={CheckCircle} size="md" tone="success" />
            <UI.Icon glyph={CheckCircle} size="lg" tone="success" />
            <UI.Icon glyph={Warning} tone="warning" label="Warning" />
            <UI.Icon glyph={Warning} tone="danger" label="Error" />
            <UI.Icon glyph={ArrowRight} tone="accent" label="Next" />
            <UI.Icon glyph={ArrowRight} tone="muted" label="Continue" />
            <UI.Spinner label="Loading the example" />
          </UI.Cluster>
          <UI.Cluster gap="lg">
            {(['nanostack', 'echopoint', 'anchor'] as const).map((brand) => (
              <UI.Cluster key={brand} gap="sm">
                <UI.BrandMark brand={brand} size="lg" />
                <UI.Text display="inline" size="sm" weight="medium">
                  {brand[0]!.toUpperCase() + brand.slice(1)}
                </UI.Text>
              </UI.Cluster>
            ))}
          </UI.Cluster>
        </UI.Stack>
      </Example>
      <Example
        title="Layout primitives"
        description="Stack, Cluster and Grid arrange content. ControlRow keeps a field and its action together. ScrollRegion names a scrolling area. ResponsiveVisibility swaps content at the mobile breakpoint."
      >
        <UI.Grid columns={2} gap="lg">
          <UI.Stack gap="lg">
            <UI.Field name="catalog-invite">
              <UI.FieldLabel>Invite by email</UI.FieldLabel>
              <UI.ControlRow>
                <UI.Input type="email" autoComplete="off" placeholder="name@example.com" />
                <UI.Button variant="secondary">Send invite</UI.Button>
              </UI.ControlRow>
            </UI.Field>
            <UI.Surface tone="subtle">
              <UI.ResponsiveVisibility when="desktop">
                <UI.Text size="sm">This text shows on wide screens.</UI.Text>
              </UI.ResponsiveVisibility>
              <UI.ResponsiveVisibility when="mobile">
                <UI.Text size="sm">This text shows on narrow screens.</UI.Text>
              </UI.ResponsiveVisibility>
            </UI.Surface>
          </UI.Stack>
          <UI.ScrollRegion label="Example audit log" height="panel">
            <UI.List marker="none" gap="xs">
              {auditEntries.map((entry) => (
                <UI.ListItem key={entry.id}>
                  <UI.Cluster justify="between">
                    <UI.Text display="inline" size="sm">
                      {entry.label}
                    </UI.Text>
                    <UI.Code tone="muted">{entry.id}</UI.Code>
                  </UI.Cluster>
                </UI.ListItem>
              ))}
            </UI.List>
          </UI.ScrollRegion>
        </UI.Grid>
      </Example>
      <Example
        title="States belong to every composition"
        description="Loading, empty and warning states use the same parts as the ready state."
      >
        <UI.Grid columns={3}>
          <UI.Surface>
            <UI.Stack role="status" aria-label="Loading preview">
              <UI.Skeleton size="sm" />
              <UI.Skeleton />
              <UI.Skeleton size="lg" />
            </UI.Stack>
          </UI.Surface>
          <UI.Surface>
            <UI.EmptyState
              title="Nothing here yet"
              description="A useful empty state explains what will appear."
            />
          </UI.Surface>
          <UI.Callout tone="warning">
            <UI.Stack gap="xs">
              <UI.Text weight="semibold">A variation is missing</UI.Text>
              <UI.Text size="sm">
                Bring the use case into the shared library and test it in both themes.
              </UI.Text>
            </UI.Stack>
          </UI.Callout>
        </UI.Grid>
      </Example>
    </UI.Stack>
  );
}
