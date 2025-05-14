import { useState, useEffect } from 'react';
import { getNews, getTopImportantNews } from '../services/api';

export default function useAppState() {
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
  const [typedText, setTypedText] = useState({});
  const [sentimentFilter, setSentimentFilter] = useState(null);
  const [importantTitles, setImportantTitles] = useState([]);
  const [lastSummaries, setLastSummaries] = useState(null);
  const [lastImportantTitles, setLastImportantTitles] = useState(null);

  // Fetch news when activeTab changes
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

  // Fetch important news when summaries are ready
  useEffect(() => {
    if (!news.length) {
      setImportantTitles([]);
      setLastSummaries(null);
      setLastImportantTitles(null);
      return;
    }

    const summaries = news.map((item, idx) => {
      const colIdx = idx % 4;
      const rowIdx = Math.floor(idx / 4);
      const key = `${item.title}_${colIdx}_${rowIdx}`;
      const summary = aiScores[key]?.interpretation;
      return summary ? { title: item.title, summary } : null;
    });

    if (summaries.some(s => !s)) return;

    if (lastSummaries && JSON.stringify(summaries) === JSON.stringify(lastSummaries)) {
      if (lastImportantTitles) setImportantTitles(lastImportantTitles);
      return;
    }

    setLastSummaries(summaries);

    const fetchImportantNews = async () => {
      try {
        const res = await getTopImportantNews(summaries);
        const titles = res.data.important
          .filter(str => str.trim())
          .map(str => {
            const cleaned = str.replace(/^\d+[\s\.-:]+/, '');
            const match = cleaned.match(/Title:\s*(.+)/i);
            if (match) return match[1].trim();
            return cleaned.trim();
          })
          .filter(title => title);
        setImportantTitles(titles);
        setLastImportantTitles(titles);
      } catch (error) {
        setImportantTitles([]);
        setLastImportantTitles([]);
      }
    };

    fetchImportantNews();
  }, [news, aiScores, lastSummaries, lastImportantTitles]);

  return {
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
    setShowPriceImpact,
    cardWidths,
    setCardWidths,
    typedText,
    setTypedText,
    sentimentFilter,
    setSentimentFilter,
    importantTitles
  };
} 