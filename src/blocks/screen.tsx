import { safeProps, type ElementProps } from '../internal/props.js';

export type CenteredScreenProps = ElementProps<'main'>;
export function CenteredScreen(props: CenteredScreenProps) {
  return <main {...safeProps(props)} className="ns-centered-screen" />;
}
export type ScreenContentProps = ElementProps<'section'>;
export function ScreenContent(props: ScreenContentProps) {
  return <section {...safeProps(props)} className="ns-screen-content" />;
}
export type SplitScreenProps = ElementProps<'main'>;
export function SplitScreen(props: SplitScreenProps) {
  return <main {...safeProps(props)} className="ns-split-screen" />;
}
export type SplitScreenAsideProps = ElementProps<'aside'>;
export function SplitScreenAside(props: SplitScreenAsideProps) {
  return <aside {...safeProps(props)} className="ns-split-screen-aside" />;
}
export type SplitScreenMainProps = ElementProps<'section'>;
export function SplitScreenMain(props: SplitScreenMainProps) {
  return <section {...safeProps(props)} className="ns-split-screen-main" />;
}
