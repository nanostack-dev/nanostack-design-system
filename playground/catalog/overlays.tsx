import { Fragment, useState } from 'react';
import { LinkSimple } from '@phosphor-icons/react';
import * as UI from '../../src/index.js';
import { Example } from './example.js';

function ActionsAndOverlays() {
  const [priority, setPriority] = useState('normal');
  const [showArchived, setShowArchived] = useState(false);
  const [notice, setNotice] = useState('Try the controls. All changes stay in this preview.');
  return (
    <UI.Stack>
      <UI.Cluster>
        <UI.Button onClick={() => setNotice('Primary action selected.')}>Primary</UI.Button>
        <UI.Button variant="secondary" onClick={() => setNotice('Secondary action selected.')}>
          Secondary
        </UI.Button>
        <UI.Button variant="ghost" onClick={() => setNotice('Quiet action selected.')}>
          Ghost
        </UI.Button>
        <UI.Button
          variant="danger"
          onClick={() => setNotice('Destructive actions should explain their consequence.')}
        >
          Danger
        </UI.Button>
        <UI.Button disabled>Unavailable</UI.Button>
      </UI.Cluster>
      <UI.Cluster>
        <UI.Dialog>
          <UI.DialogTrigger variant="secondary">Open example dialog</UI.DialogTrigger>
          <UI.DialogPopup>
            <UI.DialogHeader>
              <UI.DialogTitle>A composed dialog</UI.DialogTitle>
              <UI.DialogDescription>
                The library owns focus, dismissal, theme and spacing. The application supplies
                content.
              </UI.DialogDescription>
            </UI.DialogHeader>
            <UI.Field name="catalog-dialog-name">
              <UI.FieldLabel>Example name</UI.FieldLabel>
              <UI.Input defaultValue="Release verification" />
            </UI.Field>
            <UI.DialogFooter>
              <UI.DialogClose>Close dialog</UI.DialogClose>
            </UI.DialogFooter>
          </UI.DialogPopup>
        </UI.Dialog>
        <UI.Menu>
          <UI.MenuTrigger variant="secondary">Example menu</UI.MenuTrigger>
          <UI.MenuContent>
            <UI.MenuGroup>
              <UI.MenuLabel>Priority</UI.MenuLabel>
              <UI.MenuRadioGroup value={priority} onValueChange={setPriority}>
                <UI.MenuRadioItem value="normal">Normal priority</UI.MenuRadioItem>
                <UI.MenuRadioItem value="high">High priority</UI.MenuRadioItem>
              </UI.MenuRadioGroup>
            </UI.MenuGroup>
            <UI.MenuSeparator />
            <UI.MenuCheckboxItem checked={showArchived} onCheckedChange={setShowArchived}>
              Show archived records
            </UI.MenuCheckboxItem>
            <UI.MenuSub>
              <UI.MenuSubTrigger>Move to</UI.MenuSubTrigger>
              <UI.MenuSubContent>
                <UI.MenuItem onClick={() => setNotice('Moved to Staging.')}>Staging</UI.MenuItem>
                <UI.MenuItem onClick={() => setNotice('Moved to Production.')}>
                  Production
                </UI.MenuItem>
              </UI.MenuSubContent>
            </UI.MenuSub>
            <UI.MenuItem onClick={() => setNotice('The preview record was duplicated.')}>
              Duplicate record
            </UI.MenuItem>
            <UI.MenuLink href="?page=guidelines&tab=reference">Read the menu reference</UI.MenuLink>
            <UI.MenuSeparator />
            <UI.MenuItem tone="danger" onClick={() => setNotice('Delete needs a confirmation.')}>
              Delete record
            </UI.MenuItem>
          </UI.MenuContent>
        </UI.Menu>
        <UI.Popover>
          <UI.PopoverTrigger variant="secondary">Inspect contract</UI.PopoverTrigger>
          <UI.PopoverContent>
            <UI.PopoverTitle>Closed appearance API</UI.PopoverTitle>
            <UI.PopoverDescription>
              Choose a named variant. CSS, replacement elements and styling bags are rejected.
            </UI.PopoverDescription>
          </UI.PopoverContent>
        </UI.Popover>
        <UI.Tooltip>
          <UI.TooltipTrigger
            size="icon"
            aria-label="Copy a link to this record"
            onClick={() => setNotice('A tooltip names an icon button; it never replaces it.')}
          >
            <UI.Icon glyph={LinkSimple} />
          </UI.TooltipTrigger>
          <UI.TooltipContent>Copy a link to this record</UI.TooltipContent>
        </UI.Tooltip>
      </UI.Cluster>
      <UI.Text size="sm" tone="muted" role="status">
        {notice}
      </UI.Text>
    </UI.Stack>
  );
}

function ConfirmationExample() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  return (
    <UI.Cluster>
      <UI.Button variant="danger" onClick={() => setOpen(true)}>
        Archive record
      </UI.Button>
      <UI.Button
        variant="secondary"
        onClick={() =>
          UI.toast.success('Preview saved', { description: 'Toasts inherit the current theme.' })
        }
      >
        Show a notification
      </UI.Button>
      <UI.ConfirmationDialog
        open={open}
        onOpenChange={(next) => {
          if (!pending) setOpen(next);
        }}
        severity="destructive"
        title="Archive this record?"
        description="The record leaves the active list. You can restore it later."
        actionLabel="Archive"
        pending={pending}
        onAction={() => {
          setPending(true);
          window.setTimeout(() => {
            setPending(false);
            setOpen(false);
            UI.toast('Record archived', { description: 'Only this preview changed.' });
          }, 900);
        }}
      />
    </UI.Cluster>
  );
}

const commands = [
  { group: 'Go to', items: ['Overview', 'Components', 'Guidelines'] },
  { group: 'Actions', items: ['Create a record', 'Invite a teammate', 'Export the table'] },
];

function CommandExample() {
  const [chosen, setChosen] = useState('Nothing chosen yet.');
  const [loading, setLoading] = useState(false);
  return (
    <UI.Stack>
      <UI.Surface padding="none">
        <UI.Command label="Example commands">
          <UI.CommandInput placeholder="Search commands…" />
          <UI.CommandList label="Example command results">
            {loading ? (
              <UI.CommandStatus>Loading commands…</UI.CommandStatus>
            ) : (
              commands.map((section, index) => (
                <Fragment key={section.group}>
                  {index > 0 ? <UI.CommandSeparator /> : null}
                  <UI.CommandGroup heading={section.group}>
                    {section.items.map((item) => (
                      <UI.CommandItem key={item} value={item} onSelect={() => setChosen(item)}>
                        {item}
                      </UI.CommandItem>
                    ))}
                  </UI.CommandGroup>
                </Fragment>
              ))
            )}
            <UI.CommandEmpty>No commands match.</UI.CommandEmpty>
          </UI.CommandList>
          <UI.CommandFooter>
            <UI.Cluster gap="xs">
              <UI.KeyboardKey>↑</UI.KeyboardKey>
              <UI.KeyboardKey>↓</UI.KeyboardKey>
              <UI.Text display="inline" size="xs" tone="muted">
                to move
              </UI.Text>
              <UI.KeyboardKey>↵</UI.KeyboardKey>
              <UI.Text display="inline" size="xs" tone="muted">
                to choose
              </UI.Text>
            </UI.Cluster>
          </UI.CommandFooter>
        </UI.Command>
      </UI.Surface>
      <UI.Cluster justify="between">
        <UI.Text size="sm" role="status">
          Chosen: {chosen}
        </UI.Text>
        <UI.Button variant="ghost" size="sm" onClick={() => setLoading(!loading)}>
          {loading ? 'Show commands' : 'Show loading state'}
        </UI.Button>
      </UI.Cluster>
    </UI.Stack>
  );
}

export function Overlays() {
  return (
    <UI.Stack gap="xl">
      <Example
        title="Actions and overlays"
        description="Native actions and explicit trigger/content parts preserve keyboard behavior and focus return. Menus, popovers and tooltips inherit the theme through their portals."
      >
        <ActionsAndOverlays />
      </Example>
      <Example
        title="Confirmation and notifications"
        description="The confirmation stays open and busy while the application works. The application closes it and sends a toast when the work succeeds."
      >
        <ConfirmationExample />
      </Example>
      <Example
        title="Command palette"
        description="A searchable command list with groups, an empty result and a loading status. Filtering and command behavior belong to the application."
      >
        <CommandExample />
      </Example>
      <Example
        title="Breadcrumbs"
        description="Ancestors are links. The current page is text marked as current. Collapse deep paths with an ellipsis."
      >
        <UI.Stack gap="md">
          <UI.Breadcrumb aria-label="Example breadcrumb">
            <UI.BreadcrumbList>
              <UI.BreadcrumbItem>
                <UI.BreadcrumbLink href="./">Workspace</UI.BreadcrumbLink>
              </UI.BreadcrumbItem>
              <UI.BreadcrumbSeparator />
              <UI.BreadcrumbItem>
                <UI.BreadcrumbEllipsis />
              </UI.BreadcrumbItem>
              <UI.BreadcrumbSeparator />
              <UI.BreadcrumbItem>
                <UI.BreadcrumbLink href="?page=components">Records</UI.BreadcrumbLink>
              </UI.BreadcrumbItem>
              <UI.BreadcrumbSeparator />
              <UI.BreadcrumbItem>
                <UI.BreadcrumbPage>Release verification</UI.BreadcrumbPage>
              </UI.BreadcrumbItem>
            </UI.BreadcrumbList>
          </UI.Breadcrumb>
          <UI.Breadcrumb aria-label="Example breadcrumb with slashes">
            <UI.BreadcrumbList>
              <UI.BreadcrumbItem>
                <UI.BreadcrumbLink href="./">Settings</UI.BreadcrumbLink>
              </UI.BreadcrumbItem>
              <UI.BreadcrumbSeparator variant="slash" />
              <UI.BreadcrumbItem>
                <UI.BreadcrumbPage>Members</UI.BreadcrumbPage>
              </UI.BreadcrumbItem>
            </UI.BreadcrumbList>
          </UI.Breadcrumb>
        </UI.Stack>
      </Example>
    </UI.Stack>
  );
}
