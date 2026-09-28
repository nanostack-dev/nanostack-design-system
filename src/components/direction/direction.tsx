import {
  DirectionProvider as DirectionProviderPrimitive,
  useDirection as useDirectionPrimitive,
} from '@base-ui/react/direction-provider';

export type TextDirection = 'ltr' | 'rtl';

export type DirectionProviderProps = DirectionProviderPrimitive.Props & {
  direction?: TextDirection;
};

export function DirectionProvider(props: DirectionProviderProps) {
  return <DirectionProviderPrimitive {...props} />;
}

export function useDirection(): TextDirection {
  return useDirectionPrimitive();
}
