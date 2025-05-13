import React, { useState, useEffect, useRef } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { getNews } from './services/api';
import SearchBar from './components/SearchBar';
import NewsGrid from './components/NewsGrid';
import useSequentialFetch from './hooks/useSequentialFetch';
import useSequentialSentimentFetch from './hooks/useSequentialSentimentFetch';
import useTypewriterEffect from './hooks/useTypewriterEffect';

function App() {
  const [input, setInput] = useState('');
  const [chips, setChips] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiScores, setAiScores] = useState({});
  const [sentiments, setSentiments] = useState({});
  const [anchorEls, setAnchorEls] = useState({});
  const [openTooltip, setOpenTooltip] = useState(null);
  const [showPriceImpact, setShowPriceImpact] = useState(true);
  const [cardWidths, setCardWidths] = useState({});
  const cardRefs = useRef({});
  const priceImpactRefs = useRef({});
  const [typedText, setTypedText] = useState({});

  useEffect(() => {
    if (!activeTab) {
      setNews([]);
      return;
    }
    setLoading(true);
    getNews(activeTab)
      .then(res => setNews(res.data))
      .catch(() => setNews([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  useSequentialFetch(news, activeTab, setAiScores);
  useSequentialSentimentFetch(news, activeTab, setSentiments);
  useTypewriterEffect(openTooltip, aiScores, anchorEls, setTypedText);

  const handleClose = () => {
    setOpenTooltip(null);
    setAnchorEls({});
  };

  const handleMouseEnter = (key) => {
    setOpenTooltip(key);
  };

  const handleMouseLeave = () => {
    setOpenTooltip(null);
  };

  const handleClick = (key) => {
    const cardWidth = cardRefs.current[key]?.offsetWidth;
    if (cardWidth) {
      setCardWidths(prev => ({ ...prev, [key]: cardWidth }));
    }
    setAnchorEls(prev => ({ ...prev, [key]: priceImpactRefs.current[key] }));
    setOpenTooltip(key);
  };

  return (
    <>
      <SearchBar
        input={input}
        setInput={setInput}
        chips={chips}
        setChips={setChips}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab && (
        <Box sx={{ width: '100%', mt: 2, px: 8 }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
            <span style={{ fontWeight: 600, fontSize: '1.2rem', color: '#90caf9' }}>News</span>
          </Box>
          <NewsGrid
            news={news}
            loading={loading}
            aiScores={aiScores}
            sentiments={sentiments}
            showPriceImpact={showPriceImpact}
            cardRefs={cardRefs}
            priceImpactRefs={priceImpactRefs}
            cardWidths={cardWidths}
            openTooltip={openTooltip}
            anchorEls={anchorEls}
            onClose={handleClose}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            typedText={typedText}
          />
        </Box>
      )}
    </>
  );
}

export default App; 