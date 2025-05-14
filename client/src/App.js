import React, { useRef, useState } from 'react';
import { Box } from '@mui/material';
import SearchBar from './components/SearchBar';
import NewsGrid from './components/NewsGrid';
import SentimentFilterBar from './components/SentimentFilterBar';
import useSentimentFilter from './hooks/useSentimentFilter';
import useAISummaries from './hooks/useAISummaries';
import useAISentiments from './hooks/useAISentiments';
import { normalize } from './utils/helpers';
import useAppState from './hooks/useAppState';
import useAppHandlers from './hooks/useAppHandlers';
import CompanyDescriptionPanel from './components/CompanyDescriptionPanel';

function App() {
  const {
    input,
    setInput,
    chips,
    setChips,
    activeTab,
    setActiveTab,
    news,
    loading,
    aiScores,
    setAiScores,
    sentiments,
    setSentiments,
    anchorEls,
    setAnchorEls,
    openTooltip,
    setOpenTooltip,
    showPriceImpact,
    cardWidths,
    setCardWidths,
    typedText,
    setTypedText,
    sentimentFilter,
    setSentimentFilter,
    importantTitles
  } = useAppState();

  const cardRefs = useRef({});
  const priceImpactRefs = useRef({});

  useAISummaries(news, activeTab, setAiScores, aiScores);
  useAISentiments(news, activeTab, setSentiments, sentiments);

  const { sentimentCounts, filteredNews } = useSentimentFilter(news, sentiments, sentimentFilter);

  const handlers = useAppHandlers({
    setOpenTooltip,
    setAnchorEls,
    setTypedText,
    setCardWidths,
    cardRefs,
    priceImpactRefs
  });

  // News section collapse state
  const [newsCollapsed, setNewsCollapsed] = useState(false);

  return (
    <>
      <SearchBar
        input={input}
        setInput={setInput}
        chips={chips}
        setChips={setChips}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        style={{ position: 'fixed', width: '100%', zIndex: 2 }}
      />

      <div style={{ display: 'flex', width: '100%', position: 'relative' }}>
        {activeTab && (
          <>
            <div style={{ minWidth: 400, maxWidth: 440, marginRight: 0, position: 'fixed', left: 0 }}>
              <CompanyDescriptionPanel ticker={activeTab} />
            </div>
            <div style={{
              width: 1,
              background: '#333',
              margin: '0 32px',
              borderRadius: 2,
              height: '100vh',
              minHeight: 400,
              alignSelf: 'stretch',
              position: 'fixed',
              left: 440,
              zIndex: 1
            }} />
          </>
        )}
        <div style={{ flex: 1, marginLeft: activeTab ? 500 : 0 }}>
          {activeTab && (
            <Box sx={{ width: '100%', mt: 2, px: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18, gap: 32, height: 48 }}>
                <div style={{ display: 'flex', alignItems: 'center', height: 48 }}>
                  <h2 style={{ margin: 0, fontWeight: 800, fontSize: 24, color: '#fff', letterSpacing: 0.5, lineHeight: 1.1, textAlign: 'left', display: 'flex', alignItems: 'center', height: 48 }}>
                    News
                    <button
                      aria-label={newsCollapsed ? 'Expand news' : 'Collapse news'}
                      onClick={() => setNewsCollapsed(v => !v)}
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
                      <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>{newsCollapsed ? '▶' : '▼'}</span>
                    </button>
                  </h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', height: 48, marginLeft: 0 }}>
                  <SentimentFilterBar
                    sentimentCounts={sentimentCounts}
                    sentimentFilter={sentimentFilter}
                    setSentimentFilter={setSentimentFilter}
                  />
                </div>
              </div>
              {!newsCollapsed && (
                <>
                  <NewsGrid
                    news={filteredNews}
                    loading={loading}
                    aiScores={aiScores}
                    sentiments={sentiments}
                    showPriceImpact={showPriceImpact}
                    cardRefs={cardRefs}
                    priceImpactRefs={priceImpactRefs}
                    cardWidths={cardWidths}
                    openTooltip={openTooltip}
                    anchorEls={anchorEls}
                    onClose={handlers.handleClose}
                    onMouseEnter={handlers.handleMouseEnter}
                    onMouseLeave={handlers.handleMouseLeave}
                    onClick={handlers.handleClick}
                    typedText={typedText}
                    importantTitles={importantTitles}
                    normalize={normalize}
                  />
                </>
              )}
            </Box>
          )}
        </div>
      </div>
    </>
  );
}

export default App; 