import { DataTable } from '../src/blocks/data-table.js';

type Run = { id: string; name: string };
const runs: Run[] = [{ id: 'run-1', name: 'Nightly' }];
const columns = [{ accessorKey: 'name' as const, header: 'Name' }];

<DataTable label="Runs" columns={columns} data={runs} />;
<DataTable
  label="Runs"
  columns={columns}
  data={runs}
  isRowSelected={(run) => run.id === 'run-1'}
/>;
<DataTable
  label="Runs"
  columns={columns}
  data={runs}
  enableRowSelection
  getRowId={(run) => run.id}
  getRowLabel={(run) => run.name}
  selectedRowIds={['run-1']}
  onSelectedRowIdsChange={(ids: string[]) => ids}
/>;
declare const canSelect: boolean;
<DataTable
  label="Runs"
  columns={columns}
  data={runs}
  enableRowSelection={canSelect}
  getRowId={(run) => run.id}
/>;

// @ts-expect-error Index-keyed selection moves to another record when rows sort or pages change.
<DataTable label="Runs" columns={columns} data={runs} enableRowSelection />;
// @ts-expect-error With checkboxes, the highlight reads the checkbox selection.
<DataTable
  label="Runs"
  columns={columns}
  data={runs}
  enableRowSelection
  getRowId={(run) => run.id}
  isRowSelected={() => true}
/>;
// @ts-expect-error Selected IDs need row selection and stable row IDs.
<DataTable label="Runs" columns={columns} data={runs} selectedRowIds={['run-1']} />;
