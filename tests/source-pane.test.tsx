import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SourcePane, tokenizeSourceLine } from '../src/components/source-pane.js';
import { ChoiceCard } from '../src/components/choice-card.js';

describe('source context', () => {
  it('preserves source bytes while tokenizing YAML and JSON lines', () => {
    for (const line of [
      '  maximum: 100 # constraint',
      '  "active": true,',
      '  url: "https://example.test/#fragment"',
      '  nullable: ~',
    ]) {
      expect(
        tokenizeSourceLine(line)
          .map((token) => token.text)
          .join(''),
      ).toBe(line);
    }
  });
  it('marks changed lines and names its keyboard-scrollable source', () => {
    render(
      <SourcePane
        label="Revision"
        lines={['before', 'after']}
        lineStart={12}
        changedLines={[false, true]}
      />,
    );
    expect(screen.getByRole('region', { name: 'Revision source' })).toHaveAttribute(
      'tabindex',
      '0',
    );
    expect(screen.getByText('after').tagName).toBe('MARK');
    expect(screen.getByText('12')).toHaveAttribute('aria-hidden', 'true');
  });
  it('keeps empty source distinct from an empty source line', () => {
    const { rerender } = render(<SourcePane label="Base" lines={[]} emptyMessage="Not present" />);
    expect(screen.getByText('Not present')).toBeVisible();
    rerender(<SourcePane label="Base" lines={['']} emptyMessage="Not present" />);
    expect(screen.queryByText('Not present')).toBeNull();
    expect(screen.getByText('1')).toBeVisible();
  });
});

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
