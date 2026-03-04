import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { TokenPreview } from './TokenPreview.js';
import { ComponentPreview } from './ComponentPreview.js';

type Tab = 'tokens' | 'components';

function App() {
  const [tab, setTab] = useState<Tab>('components');
  return (
    <div>
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #e5e7eb', background: '#fff', position: 'sticky', top: 0, zIndex: 10 }}>
        {(['components', 'tokens'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderBottom: tab === t ? '2px solid #e9c96b' : '2px solid transparent',
              background: 'transparent',
              fontFamily: 'inherit',
              fontSize: '14px',
              fontWeight: tab === t ? 600 : 400,
              cursor: 'pointer',
              color: tab === t ? '#111827' : '#6b7280',
              marginBottom: -1,
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {tab === 'tokens' ? <TokenPreview /> : <ComponentPreview />}
    </div>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
