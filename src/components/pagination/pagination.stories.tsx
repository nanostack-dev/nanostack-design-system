import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
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
} from './pagination';

const pageCount = 3;

function ControlledPagination(props: PaginationProps) {
  const [page, setPage] = useState(1);
  const goTo = (target: number) => (event: React.MouseEvent) => {
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

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Links to the previous, next and numbered pages of a list. Use it under a long list or a table.\n\n**Nanostack addition:** `PaginationLink`, `PaginationPrevious` and `PaginationNext` have the `link` role by default, so assistive technology announces them as links.',
      },
    },
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
