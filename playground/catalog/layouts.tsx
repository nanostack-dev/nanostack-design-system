import { useState } from 'react';
import * as UI from '../../src/index.js';
import { previewHref, previewTitle, type PreviewName } from '../previews.js';
import { Example } from './example.js';

/** A full-viewport screen needs its own document, so it renders in a frame of this site. */
function ScreenFrame({ name }: { name: PreviewName }) {
  const theme = UI.useThemeSettings();
  const href = previewHref(name, theme);
  return (
    <UI.Stack gap="sm">
      <UI.Surface padding="none">
        <UI.PreviewFrame width="wide" height="panel">
          <iframe src={href} title={previewTitle(name)} width="100%" height="100%" frameBorder="0" />
        </UI.PreviewFrame>
      </UI.Surface>
      <UI.Link href={href} size="sm">
        Open the {previewTitle(name).toLowerCase()} on its own page
      </UI.Link>
    </UI.Stack>
  );
}

function ResponsivePanelExample() {
  const [open, setOpen] = useState(false);
  return (
    <UI.Grid layout="sidebar" gap="lg">
      <UI.Surface>
        <UI.Stack gap="md">
          <UI.Text>
            On a wide screen the panel stays docked beside this content. On a narrow screen it
            opens as a sheet that traps focus.
          </UI.Text>
          <UI.ResponsiveVisibility when="mobile">
            <UI.Cluster>
              <UI.Button variant="secondary" onClick={() => setOpen(true)}>
                Show details
              </UI.Button>
            </UI.Cluster>
          </UI.ResponsiveVisibility>
        </UI.Stack>
      </UI.Surface>
      <UI.ResponsivePanel
        open={open}
        onOpenChange={setOpen}
        desktopVisibility="always"
        label="Record details"
      >
        <UI.Inspector>
          <UI.InspectorHeader>
            <UI.Heading level={3} size="lg">
              Record details
            </UI.Heading>
          </UI.InspectorHeader>
          <UI.InspectorBody>
            <UI.DefinitionList layout="stacked">
              <UI.DefinitionItem label="Owner">Operations team</UI.DefinitionItem>
              <UI.DefinitionItem label="Updated">Today at 09:12</UI.DefinitionItem>
            </UI.DefinitionList>
          </UI.InspectorBody>
          <UI.ResponsiveVisibility when="mobile">
            <UI.InspectorFooter>
              <UI.Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
                Close details
              </UI.Button>
            </UI.InspectorFooter>
          </UI.ResponsiveVisibility>
        </UI.Inspector>
      </UI.ResponsivePanel>
    </UI.Grid>
  );
}

export function Layouts() {
  return (
    <UI.Stack gap="xl">
      <Example
        title="Application shell"
        description="This site is an AppShell with the page layout. The workspace layout below fills the viewport: AppShellBody holds the header, a scrolling main region and an AppShellDock."
      >
        <ScreenFrame name="workspace" />
      </Example>
      <Example
        title="Focused screens"
        description="CenteredScreen and SplitScreen hold sign-in, onboarding and confirmation steps inside an ApplicationViewport. The split aside hides on narrow screens."
      >
        <UI.Stack gap="lg">
          <ScreenFrame name="centered" />
          <ScreenFrame name="split" />
        </UI.Stack>
      </Example>
      <Example
        title="Page regions"
        description="A section organizes content under one title and optional actions. A card supplies a surface with a header, content and footer."
        actions={
          <UI.Button size="sm" variant="secondary">
            Section action
          </UI.Button>
        }
      >
        <UI.Grid columns={2} gap="lg">
          <UI.Card>
            <UI.CardHeader>
              <UI.CardTitle>Default card</UI.CardTitle>
              <UI.CardDescription>A surface for one unit of work.</UI.CardDescription>
            </UI.CardHeader>
            <UI.CardContent>
              <UI.Text size="sm">Content keeps its own spacing.</UI.Text>
            </UI.CardContent>
            <UI.CardFooter>
              <UI.Cluster justify="end">
                <UI.Button size="sm" variant="ghost">
                  Cancel
                </UI.Button>
                <UI.Button size="sm">Save</UI.Button>
              </UI.Cluster>
            </UI.CardFooter>
          </UI.Card>
          <UI.Card tone="subtle">
            <UI.CardHeader>
              <UI.CardTitle>Subtle card</UI.CardTitle>
              <UI.CardDescription>For supporting information.</UI.CardDescription>
            </UI.CardHeader>
            <UI.CardContent>
              <UI.Text size="sm" tone="muted">
                The tone is a finite choice, not a color override.
              </UI.Text>
            </UI.CardContent>
          </UI.Card>
        </UI.Grid>
      </Example>
      <Example
        title="Responsive panel"
        description="A controlled supporting pane. The application owns the open state and the label."
      >
        <ResponsivePanelExample />
      </Example>
    </UI.Stack>
  );
}
