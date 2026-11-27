import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { SpinnerIcon, type Icon } from '@phosphor-icons/react';
import { createElement, type AnchorHTMLAttributes, type ReactNode, type Ref } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip';
import { useMotionAttributes } from '@/lib/motion';
import type { ClosedProps } from '@/lib/closed-props';
import { useLinkComponent, type LinkComponentProps } from '@/provider/design-system-provider';

import {
  buttonStyles,
  type ButtonSize,
  type ButtonTone,
  type ButtonVariant,
  type ButtonWidth,
} from '@/recipes/button';

export { buttonStyles };
export type { ButtonSize, ButtonTone, ButtonVariant, ButtonWidth };
export type ButtonIconPosition = 'start' | 'end';

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
  const motion = useMotionAttributes();
  const leading = iconPosition === 'start';
  return (
    <ButtonPrimitive
      data-slot="button"
      className={buttonStyles({ variant, tone, size, width, bleed })}
      disabled={disabled || loading}
      focusableWhenDisabled={loading}
      aria-busy={loading || undefined}
      {...props}
      {...motion}
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
  const motion = useMotionAttributes();
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
      {...motion}
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
  const motion = useMotionAttributes();
  const linkComponent = useLinkComponent();
  const linkProps: LinkComponentProps & { 'data-slot': string } = {
    'data-slot': 'button-link',
    ...motion,
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
