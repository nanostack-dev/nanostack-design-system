import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ChoiceCard } from '../src/components/choice-card.js';

it('activates a choice card from the keyboard and respects disabled state', async () => {
  const user = userEvent.setup();
  const choose = vi.fn();
  const { rerender } = render(
    <ChoiceCard
      title="Grouped"
      description="Keep related items together."
      onClick={choose}
      selected={false}
    />,
  );
  await user.tab();
  await user.keyboard('{Enter}');
  expect(choose).toHaveBeenCalledOnce();
  rerender(
    <ChoiceCard
      title="Grouped"
      description="Keep related items together."
      onClick={choose}
      selected
      disabled
    />,
  );
  expect(screen.getByRole('button')).toBeDisabled();
  expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
});
