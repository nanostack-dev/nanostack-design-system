/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STORYBOOK_THEME?: 'light' | 'dark';
  readonly VITE_STORYBOOK_PALETTE?: string;
}
