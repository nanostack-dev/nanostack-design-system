import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ComponentPropsWithRef,
  type KeyboardEvent,
} from 'react';

import { buttonStyles } from '@/components/button/button';
import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
export type CarouselOptions = UseCarouselParameters[0];
export type CarouselPlugin = UseCarouselParameters[1];
export type CarouselOrientation = 'horizontal' | 'vertical';

type CarouselBehaviourProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: CarouselOrientation;
  setApi?: (api: CarouselApi) => void;
};

export type CarouselProps = ClosedProps<ComponentPropsWithRef<'div'>> & CarouselBehaviourProps;
export type CarouselContentProps = ClosedProps<ComponentPropsWithRef<'div'>>;
export type CarouselItemProps = ClosedProps<ComponentPropsWithRef<'div'>>;
export type CarouselControlProps = ClosedProps<
  Omit<ButtonPrimitive.Props, 'render' | 'nativeButton' | 'children'>
> & {
  label?: string;
};
export type CarouselPreviousProps = CarouselControlProps;
export type CarouselNextProps = CarouselControlProps;

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselBehaviourProps;

const CarouselContext = createContext<CarouselContextProps | null>(null);

export function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }
  return context;
}

export function Carousel({
  orientation = 'horizontal',
  opts,
  setApi,
  plugins,
  children,
  ...props
}: CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    { ...opts, axis: orientation === 'horizontal' ? 'x' : 'y' },
    plugins,
  );
  const subscribe = useCallback(
    (notify: () => void) => {
      if (!api) return () => {};
      api.on('reInit', notify);
      api.on('select', notify);
      return () => {
        api.off('reInit', notify);
        api.off('select', notify);
      };
    },
    [api],
  );
  const canScrollPrev = useSyncExternalStore(
    subscribe,
    () => api?.canScrollPrev() ?? false,
    () => false,
  );
  const canScrollNext = useSyncExternalStore(
    subscribe,
    () => api?.canScrollNext() ?? false,
    () => false,
  );

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        orientation: orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className="relative"
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export function CarouselContent(props: CarouselContentProps) {
  const { carouselRef, orientation } = useCarousel();
  return (
    <div ref={carouselRef} className="overflow-hidden" data-slot="carousel-content">
      <div
        className={cn('flex', orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col')}
        {...props}
      />
    </div>
  );
}

export function CarouselItem(props: CarouselItemProps) {
  const { orientation } = useCarousel();
  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        orientation === 'horizontal' ? 'pl-4' : 'pt-4',
      )}
      {...props}
    />
  );
}

const controlClass = 'absolute touch-manipulation';

export function CarouselPrevious({ label = 'Previous slide', ...props }: CarouselPreviousProps) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return (
    <ButtonPrimitive
      data-slot="carousel-previous"
      aria-label={label}
      className={cn(
        buttonStyles({ variant: 'outline', size: 'sm', iconOnly: true }),
        controlClass,
        orientation === 'horizontal'
          ? 'inset-y-0 -left-12 my-auto'
          : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <CaretLeftIcon aria-hidden />
    </ButtonPrimitive>
  );
}

export function CarouselNext({ label = 'Next slide', ...props }: CarouselNextProps) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return (
    <ButtonPrimitive
      data-slot="carousel-next"
      aria-label={label}
      className={cn(
        buttonStyles({ variant: 'outline', size: 'sm', iconOnly: true }),
        controlClass,
        orientation === 'horizontal'
          ? 'inset-y-0 -right-12 my-auto'
          : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <CaretRightIcon aria-hidden />
    </ButtonPrimitive>
  );
}
