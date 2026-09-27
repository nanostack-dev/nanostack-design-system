import { createRoot } from 'react-dom/client';
import { Button, DataTable, Surface, Theme } from '../../../src/index.js';
import '../../../src/styles.css';

const endpoints = [
  {
    id: 'stripe',
    name: 'Stripe billing events for the production workspace',
    url: 'https://hooks.example.com/incoming/stripe/9f2ka81m-3c7d-4e0b-a1f5-billing-production',
    requests: 1284,
  },
  { id: 'github', name: 'GitHub', url: 'https://hooks.example.com/incoming/github', requests: 12 },
];

function Endpoints() {
  return (
    <DataTable
      label="Webhook endpoints"
      data={endpoints}
      getRowId={(endpoint) => endpoint.id}
      enableColumnVisibility={false}
      columns={[
        { accessorKey: 'name', header: 'Endpoint' },
        { accessorKey: 'url', header: 'URL', enableSorting: false },
        { accessorKey: 'requests', header: 'Requests' },
        {
          id: 'actions',
          header: '',
          enableSorting: false,
          cell: ({ row }) => (
            <Button variant="secondary" size="sm">
              Open {row.original.id}
            </Button>
          ),
        },
      ]}
    />
  );
}

createRoot(document.getElementById('root')!).render(
  <Theme>
    <Surface padding="lg">
      <Endpoints />
    </Surface>
  </Theme>,
);
