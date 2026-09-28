import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { SpinnerIcon, type Icon } from '@phosphor-icons/react';
import { cva } from 'class-variance-authority';
import { createElement, type AnchorHTMLAttributes, type ReactNode, type Ref } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip';
import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';
import { useLinkComponent, type LinkComponentProps } from '@/provider/design-system-provider';

export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost';
export type ButtonTone = 'neutral' | 'brand' | 'critical';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
export type ButtonWidth = 'auto' | 'fill';
export type ButtonIconPosition = 'start' | 'end';

const buttonClasses = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-4xl border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: { solid: '', soft: '', outline: 'bg-background dark:bg-transparent', ghost: '' },
      tone: { neutral: '', brand: '', critical: '' },
      size: {
        xs: "h-6 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-8 gap-1 px-3 text-sm has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        md: 'h-9 gap-1.5 px-3 text-sm has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5',
        lg: 'h-10 gap-1.5 px-4 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
      },
      width: { auto: '', fill: 'w-full' },
      iconOnly: { true: 'px-0', false: '' },
      bleed: { true: '', false: '' },
      quietIcon: { true: '', false: '' },
      pressed: { true: '', false: '' },
    },
    compoundVariants: [
      {
        variant: 'solid',
        tone: 'neutral',
        class: 'bg-foreground text-background hover:bg-foreground/85',
      },
      {
        variant: 'solid',
        tone: 'brand',
        class: 'bg-primary text-primary-foreground hover:bg-primary/85',
      },
      {
        variant: 'solid',
        tone: 'critical',
        class: 'bg-destructive text-destructive-foreground hover:bg-destructive/85',
      },
      {
        variant: 'soft',
        tone: 'neutral',
        class:
          'bg-secondary text-secondary-foreground hover:bg-secondary/70 aria-expanded:bg-secondary/70',
      },
      {
        variant: 'soft',
        tone: 'brand',
        class:
          'bg-primary/10 text-primary hover:bg-primary/15 aria-expanded:bg-primary/15 dark:bg-primary/15 dark:hover:bg-primary/20',
      },
      {
        variant: 'soft',
        tone: 'critical',
        class:
          'bg-destructive/10 text-destructive-on-tint hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30',
      },
      {
        variant: 'outline',
        tone: 'neutral',
        class:
          'border-border hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-input/30',
      },
      {
        variant: 'outline',
        tone: 'brand',
        class: 'border-primary/40 text-primary hover:bg-accent aria-expanded:bg-accent',
      },
      {
        variant: 'outline',
        tone: 'critical',
        class:
          'border-destructive/40 text-destructive-on-tint hover:bg-destructive/10 focus-visible:ring-destructive/20',
      },
      {
        variant: 'ghost',
        tone: 'neutral',
        class:
          'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50',
      },
      {
        variant: 'ghost',
        tone: 'brand',
        class: 'text-primary hover:bg-accent aria-expanded:bg-accent',
      },
      {
        variant: 'ghost',
        tone: 'critical',
        class: 'text-destructive-on-tint hover:bg-destructive/10 focus-visible:ring-destructive/20',
      },
      { bleed: true, size: 'xs', class: '-mx-2.5' },
      { bleed: true, size: 'sm', class: '-mx-3' },
      { bleed: true, size: 'md', class: '-mx-3' },
      { bleed: true, size: 'lg', class: '-mx-4' },
      { iconOnly: true, size: 'xs', class: 'size-6' },
      { iconOnly: true, size: 'sm', class: 'size-8' },
      { iconOnly: true, size: 'md', class: 'size-9' },
      { iconOnly: true, size: 'lg', class: 'size-10' },
      {
        quietIcon: true,
        variant: 'ghost',
        tone: 'neutral',
        class:
          'text-muted-foreground hover:text-foreground focus-visible:text-foreground aria-expanded:text-foreground',
      },
      {
        pressed: true,
        class:
          'bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground focus-visible:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:hover:bg-accent',
      },
    ],
    defaultVariants: {
      variant: 'outline',
      tone: 'neutral',
      size: 'md',
      width: 'auto',
      iconOnly: false,
      bleed: false,
      quietIcon: false,
      pressed: false,
    },
  },
);

export function buttonStyles(options: Parameters<typeof buttonClasses>[0]) {
  return cn(buttonClasses(options));
}

type ButtonAppearance = {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
};

type NativeButtonProps = ClosedProps<
  Omit<ButtonPrimitive.Props, 'render' | 'nativeButton' | 'children' | 'focusableWhenDisabled'>
>;

export type ButtonProps = NativeButtonProps &
  ButtonAppearance & {
    children?: ReactNode;
    icon?: Icon;
    iconPosition?: ButtonIconPosition;
    loading?: boolean;
    width?: ButtonWidth;
    bleed?: boolean;
  };

export type IconButtonProps = Omit<NativeButtonProps, 'aria-pressed'> &
  ButtonAppearance & {
    icon: Icon;
    label: string;
    loading?: boolean;
    tooltip?: boolean;
    pressed?: boolean;
  };

export type ButtonLinkProps = ClosedProps<
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children' | 'color'>
> &
  ButtonAppearance & {
    href: string;
    children: ReactNode;
    icon?: Icon;
    iconPosition?: ButtonIconPosition;
    width?: ButtonWidth;
    ref?: Ref<HTMLAnchorElement>;
  };

function ButtonIcon({
  icon: IconComponent,
  position,
}: {
  icon: Icon;
  position: ButtonIconPosition;
}) {
  return (
    <IconComponent aria-hidden data-icon={position === 'start' ? 'inline-start' : 'inline-end'} />
  );
}

function LoadingIcon({ position }: { position?: ButtonIconPosition }) {
  return (
    <SpinnerIcon
      aria-hidden
      className="animate-spin"
      data-icon={position === 'end' ? 'inline-end' : 'inline-start'}
    />
  );
}

export function Button({
  variant,
  tone,
  size,
  width,
  bleed = false,
  icon,
  iconPosition = 'start',
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const leading = iconPosition === 'start';
  return (
    <ButtonPrimitive
      data-slot="button"
      className={buttonStyles({ variant, tone, size, width, bleed })}
      disabled={disabled || loading}
      focusableWhenDisabled={loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {leading &&
        (loading ? <LoadingIcon /> : icon ? <ButtonIcon icon={icon} position="start" /> : null)}
      {children}
      {!leading &&
        (loading ? (
          <LoadingIcon position="end" />
        ) : icon ? (
          <ButtonIcon icon={icon} position="end" />
        ) : null)}
    </ButtonPrimitive>
  );
}

export function IconButton({
  variant = 'ghost',
  tone,
  size,
  icon: IconComponent,
  label,
  loading = false,
  tooltip = true,
  pressed,
  disabled,
  ...props
}: IconButtonProps) {
  const button = (
    <ButtonPrimitive
      data-slot="icon-button"
      aria-label={label}
      aria-pressed={pressed}
      className={buttonStyles({
        variant,
        tone,
        size,
        iconOnly: true,
        quietIcon: true,
        pressed: pressed === true,
      })}
      disabled={disabled || loading}
      focusableWhenDisabled={loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <SpinnerIcon aria-hidden className="animate-spin" />
      ) : (
        <IconComponent aria-hidden />
      )}
    </ButtonPrimitive>
  );
  if (!tooltip) return button;
  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function ButtonLink({
  variant,
  tone,
  size,
  width,
  icon,
  iconPosition = 'start',
  children,
  ...props
}: ButtonLinkProps) {
  const linkComponent = useLinkComponent();
  const linkProps: LinkComponentProps & { 'data-slot': string } = {
    'data-slot': 'button-link',
    className: buttonStyles({ variant, tone, size, width }),
    ...props,
  };
  return createElement(
    linkComponent,
    linkProps,
    icon && iconPosition === 'start' ? <ButtonIcon icon={icon} position="start" /> : null,
    children,
    icon && iconPosition === 'end' ? <ButtonIcon icon={icon} position="end" /> : null,
  );
}
