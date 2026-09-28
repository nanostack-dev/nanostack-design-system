import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, waitFor } from 'storybook/test';

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselProps,
} from './carousel';

const slides = [1, 2, 3, 4, 5];
const slideClassName = [
  'flex aspect-square items-center justify-center',
  'rounded-xl border bg-card p-6 text-4xl font-semibold',
].join(' ');

function Slides(props: CarouselProps) {
  const [current, setCurrent] = useState(1);

  return (
    <div className="flex flex-col items-center gap-2">
      <Carousel
        className="w-full max-w-xs"
        aria-label="Featured slides"
        setApi={(api: CarouselApi) => {
          api?.on('select', () => setCurrent(api.selectedScrollSnap() + 1));
        }}
        {...props}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide} aria-label={`Slide ${slide} of ${slides.length}`}>
              <div className={slideClassName}>{slide}</div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Slide {current} of {slides.length}
      </p>
    </div>
  );
}

const meta = {
  title: 'Components/Carousel',
  component: Carousel,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="flex justify-center px-14">
        <Story />
      </div>
    ),
  ],
  render: (args) => <Slides {...args} />,
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const previous = canvas.getByRole('button', { name: 'Previous slide' });
    const next = canvas.getByRole('button', { name: 'Next slide' });
    await expect(canvas.getByRole('region', { name: 'Featured slides' })).toHaveAttribute(
      'aria-roledescription',
      'carousel',
    );
    await waitFor(() => expect(next).toBeEnabled());
    await expect(previous).toBeDisabled();

    await userEvent.click(next);
    await expect(await canvas.findByText('Slide 2 of 5')).toBeVisible();
    await waitFor(() => expect(previous).toBeEnabled());

    await userEvent.click(previous);
    await expect(await canvas.findByText('Slide 1 of 5')).toBeVisible();
    await waitFor(() => expect(previous).toBeDisabled());
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const next = canvas.getByRole('button', { name: 'Next slide' });
    await waitFor(() => expect(next).toBeEnabled());
    next.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(await canvas.findByText('Slide 2 of 5')).toBeVisible();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(await canvas.findByText('Slide 1 of 5')).toBeVisible();
  },
};

export const LastSlide: Story = {
  args: { opts: { startIndex: 4 } },
  play: async ({ canvas }) => {
    const next = canvas.getByRole('button', { name: 'Next slide' });
    const previous = canvas.getByRole('button', { name: 'Previous slide' });
    await waitFor(() => expect(previous).toBeEnabled());
    await expect(next).toBeDisabled();
  },
};

export const Loop: Story = {
  args: { opts: { loop: true } },
  play: async ({ canvas, userEvent }) => {
    const previous = canvas.getByRole('button', { name: 'Previous slide' });
    await waitFor(() => expect(previous).toBeEnabled());
    await userEvent.click(previous);
    await expect(await canvas.findByText('Slide 5 of 5')).toBeVisible();
  },
};
