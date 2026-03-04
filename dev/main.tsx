import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TokenPreview } from './TokenPreview.js';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root');

createRoot(root).render(
  <StrictMode>
    <TokenPreview />
  </StrictMode>,
);
