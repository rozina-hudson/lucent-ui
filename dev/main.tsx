import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ComponentPreview } from './ComponentPreview.js';
import type { DevTab } from './ComponentPreview.js';

function App() {
  const [tab, setTab] = useState<DevTab>('components');
  return <ComponentPreview tab={tab} setTab={setTab} />;
}

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
