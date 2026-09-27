import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/outfit';
import '@fontsource-variable/geist-mono';
import '../src/styles.css';
import { PreviewPage, readPreview } from './previews.js';
import { Site } from './site.js';

const preview = readPreview(new URLSearchParams(window.location.search));
const root = document.getElementById('root');
if (root)
  createRoot(root).render(
    <StrictMode>{preview ? <PreviewPage {...preview} /> : <Site />}</StrictMode>,
  );
