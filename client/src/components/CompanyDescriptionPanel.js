import React, { useEffect, useState } from 'react';
import useCompanyDescription from '../hooks/useCompanyDescription';
import useTypewriterEffect from '../hooks/useTypewriterEffect';

export default function CompanyDescriptionPanel({ ticker }) {
  const { description, companyName, loading, error, getDescription } = useCompanyDescription();
  const [typedText, setTypedText] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  // Fetch company description automatically when ticker changes
  useEffect(() => {
    if (ticker && ticker.trim()) {
      getDescription(ticker);
    }
  }, [ticker, getDescription]);

  // Improved skeleton loader: left-aligned, bars from longest to shortest
  const renderSkeleton = () => (
    <div style={{ marginTop: 8 }}>
      {[100, 90, 80, 70, 60, 50, 40].map((width, idx) => (
        <div
          key={idx}
          style={{
            background: '#222',
            height: 14 + (idx % 2) * 2,
            width: `${width}%`,
            borderRadius: 4,
            marginBottom: 10,
            animation: 'pulse 1.2s infinite',
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );

  // Gelişmiş hata mesajı
  const renderError = () => {
    if (!error) return null;
    let msg = error;
    if (description === '' && ticker) {
      msg = `No information found for "${ticker}". Please check the ticker or try another company.`;
    } else if (error.toLowerCase().includes('network')) {
      msg = 'Network error. Please check your connection and try again.';
    }
    return <div style={{ color: 'red', marginBottom: 8 }}>{msg}</div>;
  };

  // Madde madde veya numaralı listeye dönüştür (typewriter ile)
  const renderTypewriterDescription = () => {
    if (!description) return null;
    const lines = description.split(/\n+/);
    return (
      <div style={{ whiteSpace: 'pre-line', fontSize: 16, lineHeight: 1.4, color: '#fff' }}>{lines.join('\n')}</div>
    );
  };

  const heading = companyName || ticker;

  if (collapsed) {
    return (
      <div style={{ padding: 24, borderRadius: 12, minHeight: 60, display: 'flex', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontWeight: 800, fontSize: 24, color: '#fff', letterSpacing: 0.5, lineHeight: 1.1, textAlign: 'left', display: 'inline-flex', alignItems: 'center' }}>
          {heading}
          <button
            aria-label="Expand panel"
            onClick={() => setCollapsed(false)}
            style={{
              width: 28,
              height: 28,
              background: 'transparent',
              border: 'none',
              borderRadius: 4,
              marginLeft: 6,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              transition: 'background 0.2s',
              padding: 0,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>{'▶'}</span>
          </button>
        </h2>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, borderRadius: 12, minHeight: 300, position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontWeight: 800, fontSize: 24, color: '#fff', letterSpacing: 0.5, lineHeight: 1.1, textAlign: 'left', display: 'inline-flex', alignItems: 'center' }}>
          {heading}
          <button
            aria-label="Collapse panel"
            onClick={() => setCollapsed(true)}
            style={{
              width: 28,
              height: 28,
              background: 'transparent',
              border: 'none',
              borderRadius: 4,
              marginLeft: 6,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              transition: 'background 0.2s',
              padding: 0,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>{'▼'}</span>
          </button>
        </h2>
      </div>
      {loading ? renderSkeleton() : null}
      {renderError()}
      {!loading && renderTypewriterDescription()}
    </div>
  );
} 