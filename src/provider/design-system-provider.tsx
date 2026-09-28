import {
  createContext,
  useContext,
  type AnchorHTMLAttributes,
  type ComponentType,
  type ReactNode,
  type Ref,
} from 'react';

import { TooltipProvider } from '@/components/tooltip';

export type LinkComponentProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  ref?: Ref<HTMLAnchorElement>;
};

export type LinkComponent = ComponentType<LinkComponentProps>;

export type DesignSystemProviderProps = {
  children: ReactNode;
  linkComponent?: LinkComponent;
};

function AnchorLink({ ref, ...props }: LinkComponentProps) {
  return <a ref={ref} {...props} />;
}

const LinkComponentContext = createContext<LinkComponent>(AnchorLink);

export function DesignSystemProvider({
  children,
  linkComponent = AnchorLink,
}: DesignSystemProviderProps) {
  return (
    <LinkComponentContext.Provider value={linkComponent}>
      <TooltipProvider>{children}</TooltipProvider>
    </LinkComponentContext.Provider>
  );
}

export function useLinkComponent(): LinkComponent {
  return useContext(LinkComponentContext);
}
