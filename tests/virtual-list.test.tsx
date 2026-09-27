import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { VirtualList } from '../src/blocks/virtual-list.js';
import { Text } from '../src/components/typography.js';

// The virtualizer sizes its range from layout; the browser suite covers real measurement.
beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    },
  );
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(400);
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(400);
});
afterAll(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const settle = () => new Promise((resolve) => setTimeout(resolve, 60));

function FailingFeed({ onRequest }: { onRequest: () => void }) {
  const [state, setState] = useState<'idle' | 'loading' | 'failed'>('idle');
  return (
    <VirtualList
      label="Records"
      items={[{ id: 'first' }, { id: 'second' }]}
      getItemKey={(item) => item.id}
      hasMore
      loadingMore={state === 'loading'}
      loadMoreFailed={state === 'failed'}
      loadMoreFailedMessage="Records could not be loaded."
      onEndReached={() => {
        onRequest();
        setState('loading');
        setTimeout(() => setState('failed'), 0);
      }}
      renderItem={(item) => <Text>Record {item.id}</Text>}
    />
  );
}

describe('VirtualList pagination', () => {
  it('stops requesting after a failed page and retries only when asked', async () => {
    const user = userEvent.setup();
    const request = vi.fn();
    render(<FailingFeed onRequest={request} />);
    expect(await screen.findByText('Records could not be loaded.')).toBeVisible();
    await settle();
    expect(request).toHaveBeenCalledOnce();
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(request).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('region', { name: 'Records' })).toHaveFocus();
    expect(await screen.findByText('Records could not be loaded.')).toBeVisible();
    await settle();
    expect(request).toHaveBeenCalledTimes(2);
  });

  it('requests the next page again once more items arrive', async () => {
    const request = vi.fn();
    function GrowingFeed() {
      const [count, setCount] = useState(2);
      return (
        <VirtualList
          label="Records"
          items={Array.from({ length: count }, (_, index) => ({ id: String(index) }))}
          getItemKey={(item) => item.id}
          hasMore={count < 6}
          onEndReached={() => {
            request();
            setTimeout(() => setCount((value) => value + 2), 0);
          }}
          renderItem={(item) => <Text>Record {item.id}</Text>}
        />
      );
    }
    render(<GrowingFeed />);
    expect(await screen.findByText('Record 5')).toBeVisible();
    await settle();
    expect(request).toHaveBeenCalledTimes(2);
  });

  it('shows the empty state only when nothing failed or remains to load', () => {
    render(
      <VirtualList
        label="Records"
        items={[]}
        getItemKey={(item: { id: string }) => item.id}
        loadMoreFailed
        emptyState={<Text>No records</Text>}
        renderItem={(item) => <Text>{item.id}</Text>}
      />,
    );
    expect(screen.queryByText('No records')).toBeNull();
    expect(screen.getByText('More items could not be loaded.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeVisible();
  });

  it('does not resend the same request while the application reports loading', async () => {
    const request = vi.fn();
    function SlowFeed() {
      const [loading, setLoading] = useState(false);
      return (
        <VirtualList
          label="Records"
          items={[{ id: 'only' }]}
          getItemKey={(item) => item.id}
          hasMore
          loadingMore={loading}
          onEndReached={() => {
            request();
            setLoading(true);
            setTimeout(() => setLoading(false), 0);
          }}
          renderItem={(item) => <Text>Record {item.id}</Text>}
        />
      );
    }
    render(<SlowFeed />);
    await waitFor(() => expect(request).toHaveBeenCalled());
    await settle();
    expect(request).toHaveBeenCalledOnce();
  });
});
