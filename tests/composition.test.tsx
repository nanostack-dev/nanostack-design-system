import { createRef, type ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../src/components/button.js';
import { Input } from '../src/components/input.js';
import {
  Form,
  Label,
  List,
  ListItem,
  OrderedList,
  ScrollRegion,
  VisuallyHidden,
} from '../src/components/layout.js';
import { Code, Heading, KeyboardKey, Text } from '../src/components/typography.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../src/blocks/table.js';
import {
  DefinitionItem,
  DefinitionList,
  Inspector,
  InspectorBody,
  InspectorFooter,
  InspectorHeader,
} from '../src/blocks/inspector.js';
import {
  ResourceList,
  ResourceRow,
  ResourceRowActions,
  ResourceRowButton,
  ResourceRowLabel,
  ResourceRowLink,
  ResourceRowMeta,
} from '../src/blocks/resource-list.js';

describe('resource compositions', () => {
  it('keeps navigation and row actions independent and keyboard accessible', async () => {
    const user = userEvent.setup();
    const open = vi.fn();
    const remove = vi.fn();
    const ref = createRef<HTMLAnchorElement>();
    render(
      <ResourceList aria-label="Resources">
        <ResourceRow selected>
          <ResourceRowLabel>
            <ResourceRowLink
              href="/resources/first"
              ref={ref}
              active
              onClick={(event) => {
                event.preventDefault();
                open();
              }}
            >
              First resource
            </ResourceRowLink>
          </ResourceRowLabel>
          <ResourceRowMeta>Updated today</ResourceRowMeta>
          <ResourceRowActions>
            <Button onClick={remove} aria-label="Remove first resource">
              Remove
            </Button>
          </ResourceRowActions>
        </ResourceRow>
      </ResourceList>,
    );
    expect(screen.getByRole('list', { name: 'Resources' })).toBeVisible();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    const link = screen.getByRole('link', { name: 'First resource' });
    expect(link).toHaveAttribute('href', '/resources/first');
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(ref.current).toBe(link);
    await user.tab();
    expect(link).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(open).toHaveBeenCalledOnce();
    await user.tab();
    await user.keyboard('{Enter}');
    expect(remove).toHaveBeenCalledOnce();
    expect(open).toHaveBeenCalledOnce();
  });

  it('supports selection as a native button and prevents dragging read-only rows', async () => {
    const user = userEvent.setup();
    const select = vi.fn();
    render(
      <ResourceList>
        <ResourceRow readOnly draggable>
          <ResourceRowLabel>
            <ResourceRowButton selected onClick={select}>
              Selected item
            </ResourceRowButton>
          </ResourceRowLabel>
        </ResourceRow>
        <ResourceRow draggable>
          <ResourceRowLabel>Movable item</ResourceRowLabel>
        </ResourceRow>
      </ResourceList>,
    );
    const button = screen.getByRole('button', { name: 'Selected item', pressed: true });
    await user.tab();
    await user.keyboard(' ');
    expect(select).toHaveBeenCalledOnce();
    expect(button.closest('li')).toHaveAttribute('draggable', 'false');
    expect(screen.getByText('Movable item').closest('li')).toHaveAttribute('draggable', 'true');
  });

  it('blocks untyped styling and internal state overrides while preserving accessibility', () => {
    const unsafe = {
      className: 'host-css',
      style: { color: 'red' },
      'data-ns-selected': true,
      'aria-label': 'Safe row',
    } as unknown as ComponentProps<typeof ResourceRow>;
    render(
      <ResourceList>
        <ResourceRow {...unsafe}>
          <ResourceRowLabel>Item</ResourceRowLabel>
        </ResourceRow>
      </ResourceList>,
    );
    const row = screen.getByRole('listitem', { name: 'Safe row' });
    expect(row).not.toHaveClass('host-css');
    expect(row).not.toHaveAttribute('style');
    expect(row).toHaveAttribute('data-ns-selected', 'false');
  });
});

describe('semantic compositions', () => {
  it('keeps editable table controls associated with named columns', async () => {
    const user = userEvent.setup();
    render(
      <Table label="Variables">
        <TableHeader>
          <TableRow>
            <TableHead>Key</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>API_URL</TableCell>
            <TableCell>
              <Input aria-label="Value for API_URL" defaultValue="original" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const table = screen.getByRole('table', { name: 'Variables' });
    expect(within(table).getByRole('columnheader', { name: 'Value' })).toHaveAttribute(
      'scope',
      'col',
    );
    const field = within(table).getByRole('textbox', { name: 'Value for API_URL' });
    await user.clear(field);
    await user.type(field, 'updated');
    expect(field).toHaveValue('updated');
  });
  it('associates labels and preserves native form submission', async () => {
    const user = userEvent.setup();
    const submit = vi.fn();
    render(
      <Form
        aria-label="Create resource"
        onSubmit={(event) => {
          event.preventDefault();
          submit(new FormData(event.currentTarget).get('name'));
        }}
      >
        <Label htmlFor="resource-name">Resource name</Label>
        <Input id="resource-name" name="name" required />
        <Button type="submit">Save</Button>
      </Form>,
    );
    await user.type(screen.getByRole('textbox', { name: 'Resource name' }), 'Checkout');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(submit).toHaveBeenCalledWith('Checkout');
  });

  it('provides an inspector region with meaningful term/value pairs and semantic lists', () => {
    render(
      <Inspector aria-labelledby="inspector-title">
        <InspectorHeader>
          <Heading id="inspector-title">Resource details</Heading>
        </InspectorHeader>
        <InspectorBody>
          <DefinitionList>
            <DefinitionItem label="Identifier">
              <Code>abc123</Code>
            </DefinitionItem>
          </DefinitionList>
          <List aria-label="Labels">
            <ListItem>Production</ListItem>
          </List>
          <OrderedList aria-label="Steps">
            <ListItem>Validate</ListItem>
          </OrderedList>
        </InspectorBody>
        <InspectorFooter>
          <Text display="inline">
            Press <KeyboardKey>Esc</KeyboardKey> to close
          </Text>
        </InspectorFooter>
      </Inspector>,
    );
    const region = screen.getByRole('region', { name: 'Resource details' });
    expect(within(region).getByRole('term')).toHaveTextContent('Identifier');
    expect(within(region).getByRole('definition')).toHaveTextContent('abc123');
    expect(within(region).getByRole('list', { name: 'Labels' }).tagName).toBe('UL');
    expect(within(region).getByRole('list', { name: 'Steps' }).tagName).toBe('OL');
  });

  it('forwards scroll events and the viewport ref to the keyboard-focusable region', () => {
    const viewportRef = createRef<HTMLDivElement>();
    const onScroll = vi.fn();
    render(
      <ScrollRegion label="History" viewportRef={viewportRef} onScroll={onScroll}>
        <Text>First event</Text>
      </ScrollRegion>,
    );
    const region = screen.getByRole('region', { name: 'History' });
    expect(viewportRef.current).toBe(region);
    expect(region).toHaveAttribute('tabindex', '0');
    fireEvent.scroll(region);
    expect(onScroll).toHaveBeenCalledOnce();
  });

  it('supports hidden accessible labels without requiring application CSS', () => {
    render(
      <Button>
        <VisuallyHidden>Refresh activity</VisuallyHidden>
        <Text display="inline" aria-hidden>
          ↻
        </Text>
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Refresh activity' })).toBeVisible();
  });
});
