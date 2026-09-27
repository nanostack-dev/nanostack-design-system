import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select, type SelectProps } from '../src/components/select.js';
import { Field, FieldDescription, FieldError, FieldLabel } from '../src/components/field.js';

const options = [
  { value: '', label: 'All environments' },
  { value: 'production', label: 'Production' },
  { value: 'archived', label: 'Archived', disabled: true },
] as const;

describe('native select', () => {
  it('preserves controlled selection, change events, native refs and form values', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLSelectElement>();
    const onChange = vi.fn();
    function ControlledSelect() {
      const [value, setValue] = useState('');
      return (
        <form aria-label="Environment filter">
          <Select
            ref={ref}
            name="environment"
            aria-label="Environment"
            value={value}
            options={options}
            onChange={(event) => {
              onChange(event.currentTarget.value);
              setValue(event.currentTarget.value);
            }}
          />
        </form>
      );
    }
    render(<ControlledSelect />);
    const select = screen.getByRole('combobox', { name: 'Environment' });
    expect(ref.current).toBe(select);
    expect(select).toHaveValue('');
    await user.selectOptions(select, 'production');
    expect(select).toHaveValue('production');
    expect(onChange).toHaveBeenLastCalledWith('production');
    expect(new FormData(ref.current!.form!).get('environment')).toBe('production');
    expect(screen.getByRole('option', { name: 'Production' })).toHaveProperty('selected', true);
  });

  it('supports default values while keeping disabled options and controls inert', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <Select
        aria-label="Environment"
        defaultValue="production"
        options={options}
        onChange={onChange}
      />,
    );
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('production');
    expect(screen.getByRole('option', { name: 'Archived' })).toBeDisabled();
    await user.selectOptions(select, 'archived');
    expect(select).toHaveValue('production');
    expect(onChange).not.toHaveBeenCalled();
    rerender(
      <Select
        aria-label="Environment"
        defaultValue="production"
        options={options}
        disabled
        onChange={onChange}
      />,
    );
    await user.selectOptions(select, '');
    expect(select).toBeDisabled();
    expect(select).toHaveValue('production');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('strips custom CSS and element replacement from untyped props', () => {
    const unsafe = {
      className: 'consumer-css',
      style: { color: 'red' },
      css: 'color:red',
      classNames: { root: 'custom' },
      unstyled: true,
      render: <div>Replacement</div>,
      asChild: true,
    } as unknown as SelectProps;
    render(<Select {...unsafe} options={options} aria-label="Environment" size="sm" />);
    const select = screen.getByRole('combobox');
    expect(select.tagName).toBe('SELECT');
    expect(select.className).toBe('ns-input ns-select');
    expect(select).toHaveAttribute('data-size', 'sm');
    expect(select).not.toHaveAttribute('style');
    expect(select).not.toHaveAttribute('css');
    expect(select).not.toHaveAttribute('classNames');
    expect(screen.queryByText('Replacement')).not.toBeInTheDocument();
  });

  it('takes its label, description, error, disabled state and name from the surrounding Field', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Field invalid>
        <FieldLabel>Environment</FieldLabel>
        <Select options={options} />
        <FieldDescription>Filter the shown records.</FieldDescription>
        <FieldError match>Choose an environment.</FieldError>
      </Field>,
    );
    const select = screen.getByRole('combobox', { name: 'Environment' });
    expect(select).toHaveAccessibleDescription('Filter the shown records. Choose an environment.');
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(select).toBeEnabled();

    rerender(
      <Field disabled>
        <FieldLabel>Environment</FieldLabel>
        <Select options={options} />
      </Field>,
    );
    expect(screen.getByRole('combobox', { name: 'Environment' })).toBeDisabled();

    rerender(
      <form aria-label="Environment filter">
        <Field name="environment">
          <FieldLabel>Environment</FieldLabel>
          <Select options={options} defaultValue="production" />
        </Field>
      </form>,
    );
    const enabled = screen.getByRole('combobox', { name: 'Environment' });
    expect(enabled).toBeEnabled();
    expect(enabled).not.toHaveAttribute('aria-invalid');
    await user.click(screen.getByText('Environment'));
    expect(enabled).toHaveFocus();
    const form = screen.getByRole('form', { name: 'Environment filter' }) as HTMLFormElement;
    expect(new FormData(form).get('environment')).toBe('production');
  });
});
