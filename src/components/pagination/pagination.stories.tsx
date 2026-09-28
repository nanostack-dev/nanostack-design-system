import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type MouseEvent } from 'react';
import { expect } from 'storybook/test';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  type PaginationProps,
} from '@/components/pagination';
import { DesignSystemProvider, type LinkComponentProps } from '@/provider';

const pageCount = 3;

function ControlledPagination(props: PaginationProps) {
  const [page, setPage] = useState(1);
  const goTo = (target: number) => (event: MouseEvent) => {
    event.preventDefault();
    setPage(Math.min(Math.max(target, 1), pageCount));
  };
  return (
    <Pagination {...props}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={`#page-${page - 1}`} onClick={goTo(page - 1)} />
        </PaginationItem>
        {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
          <PaginationItem key={number}>
            <PaginationLink
              href={`#page-${number}`}
              isActive={number === page}
              onClick={goTo(number)}
            >
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href={`#page-${page + 1}`} onClick={goTo(page + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

const usage = `
Links to the previous, next and numbered pages of a list. Use it under a long list or a table that the server splits into pages. For a list that loads more rows as the user scrolls, use a "Load more" \`Button\` instead.

\`Pagination\` has no look props. Each link takes an \`href\` and renders the \`linkComponent\` of \`DesignSystemProvider\`, so the product router handles the click and the page is in the URL.

## Parts

| Part | Use it for |
| --- | --- |
| \`PaginationLink\` | A numbered page. Set \`isActive\` on the current page: it gets \`aria-current="page"\` and an outline. |
| \`PaginationPrevious\`, \`PaginationNext\` | The page before and after. \`text\` changes the visible label. The label hides below the \`sm\` breakpoint. |
| \`PaginationEllipsis\` | Pages left out between two numbers. |

## Do not

- Do not pass \`render={<a />}\` or a router \`Link\`. Pass \`href\`, and set the router link once on \`DesignSystemProvider\`.
- Do not show more than about seven numbers. Use \`PaginationEllipsis\`.
- Do not use buttons without an \`href\` for pages. A page must have a URL.
`;

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'padded',
    docs: { description: { component: usage } },
  },
  render: (args) => <ControlledPagination {...args} />,
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('navigation', { name: 'pagination' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: '1' })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('link', { name: '2' })).not.toHaveAttribute('aria-current');

    await userEvent.click(canvas.getByRole('link', { name: '2' }));
    await expect(canvas.getByRole('link', { name: '2' })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('link', { name: '1' })).not.toHaveAttribute('aria-current');

    await userEvent.click(canvas.getByRole('link', { name: 'Go to next page' }));
    await expect(canvas.getByRole('link', { name: '3' })).toHaveAttribute('aria-current', 'page');

    await userEvent.click(canvas.getByRole('link', { name: 'Go to previous page' }));
    await expect(canvas.getByRole('link', { name: '2' })).toHaveAttribute('aria-current', 'page');
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Go to previous page' })).toHaveFocus();
    await userEvent.tab();
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: '2' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('link', { name: '2' })).toHaveAttribute('aria-current', 'page');
  },
};

function StoryLink({ href, ref, ...props }: LinkComponentProps) {
  return <a ref={ref} href={href} data-router-link="" {...props} />;
}

export const RouterLinks: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Every link renders the `linkComponent` of `DesignSystemProvider`, so the product router handles the click.',
      },
    },
  },
  render: (args) => (
    <DesignSystemProvider linkComponent={StoryLink}>
      <ControlledPagination {...args} />
    </DesignSystemProvider>
  ),
  play: async ({ canvas }) => {
    for (const name of ['Go to previous page', '1', '2', '3', 'Go to next page']) {
      await expect(canvas.getByRole('link', { name })).toHaveAttribute('data-router-link');
    }
  },
};
