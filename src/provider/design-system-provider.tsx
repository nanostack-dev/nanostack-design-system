import {
  createContext,
  useContext,
  type AnchorHTMLAttributes,
  type ComponentType,
  type ReactNode,
  type Ref,
} from 'react';

import { MaterialContext, useMaterial, type Material } from '@/lib/material';
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
  /** The surface material. Omitted, it inherits the parent provider's, else `solid`. */
  material?: Material;
};

function AnchorLink({ ref, ...props }: LinkComponentProps) {
  return <a ref={ref} {...props} />;
}

const LinkComponentContext = createContext<LinkComponent>(AnchorLink);

export function DesignSystemProvider({
  children,
  linkComponent = AnchorLink,
  motion,
  material,
}: DesignSystemProviderProps) {
  useMotionInput();
  const inheritedMotion = useContext(MotionPreferenceContext);
  const inheritedMaterial = useContext(MaterialContext);
  return (
    <MotionPreferenceContext.Provider value={motion ?? inheritedMotion}>
      <MaterialContext.Provider value={material ?? inheritedMaterial}>
        <LinkComponentContext.Provider value={linkComponent}>
          <TooltipProvider>{children}</TooltipProvider>
        </LinkComponentContext.Provider>
      </MaterialContext.Provider>
    </MotionPreferenceContext.Provider>
  );
}

export function useLinkComponent(): LinkComponent {
  return useContext(LinkComponentContext);
}

export { useMaterial };
export type { Material, MotionPreference };
