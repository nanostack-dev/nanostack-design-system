import {
  createContext,
  useContext,
  type AnchorHTMLAttributes,
  type ComponentType,
  type ReactNode,
  type Ref,
} from 'react';

import { MotionPreferenceContext, useMotionInput, type MotionPreference } from '@/lib/motion';

import { TooltipProvider } from '@/components/tooltip';

export type LinkComponentProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  ref?: Ref<HTMLAnchorElement>;
};

export type LinkComponent = ComponentType<LinkComponentProps>;

export type DesignSystemProviderProps = {
  children: ReactNode;
  linkComponent?: LinkComponent;
  motion?: MotionPreference;
};

function AnchorLink({ ref, ...props }: LinkComponentProps) {
  return <a ref={ref} {...props} />;
}

const LinkComponentContext = createContext<LinkComponent>(AnchorLink);

export function DesignSystemProvider({
  children,
  linkComponent = AnchorLink,
  motion,
}: DesignSystemProviderProps) {
  useMotionInput();
  const inheritedMotion = useContext(MotionPreferenceContext);
  return (
    <MotionPreferenceContext.Provider value={motion ?? inheritedMotion}>
      <LinkComponentContext.Provider value={linkComponent}>
        <TooltipProvider>{children}</TooltipProvider>
      </LinkComponentContext.Provider>
    </MotionPreferenceContext.Provider>
  );
}

export function useLinkComponent(): LinkComponent {
  return useContext(LinkComponentContext);
}

export type { MotionPreference };
