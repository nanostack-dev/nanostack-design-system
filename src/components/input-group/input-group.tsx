import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { Input as InputPrimitive } from '@base-ui/react/input';
import type { Icon } from '@phosphor-icons/react';
import { cva } from 'class-variance-authority';
import { createContext, useContext, type ComponentProps, type ReactNode } from 'react';

import {
  Button,
  buttonStyles,
  IconButton,
  type ButtonIconPosition,
  type ButtonTone,
  type ButtonVariant,
} from '@/components/button/button';
import { inputStyles, type InputProps } from '@/components/input/input';
import { textareaStyles, type TextareaProps } from '@/components/textarea/textarea';
import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type InputGroupSize = 'sm' | 'md';
export type InputGroupAddonAlign = 'inline-start' | 'inline-end' | 'block-start' | 'block-end';
export type InputGroupButtonSize = 'xs' | 'sm';

const InputGroupSizeContext = createContext<InputGroupSize>('md');

const inputGroupClasses = cva(
  'group/input-group relative flex w-full min-w-0 items-center rounded-4xl border border-transparent bg-input/50 transition-[color,box-shadow,background-color] outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-data-[align=block-end]:rounded-3xl has-data-[align=block-start]:rounded-3xl has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/30 has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[textarea]:rounded-2xl has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5',
  {
    variants: { size: { sm: 'h-8', md: 'h-9' } },
    defaultVariants: { size: 'md' },
  },
);

export type InputGroupProps = ClosedProps<ComponentProps<'div'>> & {
  size?: InputGroupSize;
};

type InputGroupPrimitiveProps = InputGroupProps & { className?: string };

export function InputGroupPrimitive({
  size = 'md',
  className,
  ...props
}: InputGroupPrimitiveProps) {
  return (
    <InputGroupSizeContext.Provider value={size}>
      <div
        data-slot="input-group"
        data-size={size}
        role="group"
        className={cn(inputGroupClasses({ size }), className)}
        {...props}
      />
    </InputGroupSizeContext.Provider>
  );
}

export function InputGroup(props: InputGroupProps) {
  return <InputGroupPrimitive {...props} />;
}

const inputGroupAddonClasses = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 py-2 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 **:data-[slot=kbd]:rounded-3xl **:data-[slot=kbd]:bg-muted-foreground/10 **:data-[slot=kbd]:px-1.5 [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        'inline-start': 'order-first pl-3 has-[>button]:-ml-1 has-[>kbd]:-ml-1',
        'inline-end': 'order-last pr-3 has-[>button]:-mr-1 has-[>kbd]:-mr-1',
        'block-start':
          'order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-3.5 [.border-b]:pb-3.5 [&>button:first-of-type]:ml-auto',
        'block-end':
          'order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-3.5 [.border-t]:pt-3.5 [&>button:first-of-type]:ml-auto',
      },
    },
    defaultVariants: { align: 'inline-start' },
  },
);

export type InputGroupAddonProps = ClosedProps<ComponentProps<'div'>> & {
  align?: InputGroupAddonAlign;
};

export function InputGroupAddon({ align = 'inline-start', ...props }: InputGroupAddonProps) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonClasses({ align }))}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest('button')) return;
        event.currentTarget.parentElement?.querySelector('input')?.focus();
      }}
      {...props}
    />
  );
}

type InputGroupButtonPrimitiveProps = Omit<ButtonPrimitive.Props, 'className'> & {
  className?: string;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: InputGroupButtonSize;
  iconOnly?: boolean;
};

export function InputGroupButtonPrimitive({
  className,
  variant = 'ghost',
  tone,
  size = 'xs',
  iconOnly = false,
  type = 'button',
  ...props
}: InputGroupButtonPrimitiveProps) {
  return (
    <ButtonPrimitive
      type={type}
      data-slot="input-group-button"
      data-size={size}
      className={cn(buttonStyles({ variant, tone, size, iconOnly }), className)}
      {...props}
    />
  );
}

type InputGroupButtonBaseProps = ClosedProps<
  Omit<ButtonPrimitive.Props, 'render' | 'nativeButton' | 'children' | 'focusableWhenDisabled'>
> & {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: InputGroupButtonSize;
  loading?: boolean;
};

export type InputGroupButtonProps = InputGroupButtonBaseProps &
  (
    | { children: ReactNode; icon?: Icon; iconPosition?: ButtonIconPosition; label?: never }
    | { children?: never; icon: Icon; iconPosition?: never; label: string }
  );

export function InputGroupButton({
  variant = 'ghost',
  size = 'xs',
  type = 'button',
  ...props
}: InputGroupButtonProps) {
  if (props.label !== undefined) {
    const { label, icon, ...rest } = props;
    return (
      <IconButton
        data-slot="input-group-button"
        type={type}
        variant={variant}
        size={size}
        icon={icon}
        label={label}
        {...rest}
      />
    );
  }
  return (
    <Button data-slot="input-group-button" type={type} variant={variant} size={size} {...props} />
  );
}

export type InputGroupTextProps = ClosedProps<ComponentProps<'span'>>;

export function InputGroupText(props: InputGroupTextProps) {
  return (
    <span
      className="flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"
      {...props}
    />
  );
}

export type InputGroupInputProps = Omit<InputProps, 'variant' | 'size'>;

export function InputGroupInput({ font, ...props }: InputGroupInputProps) {
  const size = useContext(InputGroupSizeContext);
  return (
    <InputPrimitive
      data-slot="input-group-control"
      className={cn(
        inputStyles({ size, font }),
        'flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent',
      )}
      {...props}
    />
  );
}

export type InputGroupTextareaProps = TextareaProps;

export function InputGroupTextarea({ font, ...props }: InputGroupTextareaProps) {
  return (
    <textarea
      data-slot="input-group-control"
      className={cn(
        textareaStyles({ font }),
        'flex-1 resize-none rounded-none border-0 bg-transparent py-2.5 shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent',
      )}
      {...props}
    />
  );
}
