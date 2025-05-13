import { useEffect } from 'react';
import { interpretNews } from '../services/api';

function useSequentialSentimentFetch(news, activeTab, setSentiments) {
  useEffect(() => {
    if (!activeTab || !news.length) return;
    let cancelled = false;
    const fetchSequentially = async () => {
      for (let idx = 0; idx < Math.min(news.length, 20); idx++) {
        if (cancelled) break;
        const item = news[idx];
        const colIdx = idx % 4;
        const rowIdx = Math.floor(idx / 4);
        const key = `${item.title}_${colIdx}_${rowIdx}`;
        setSentiments(prev => {
          if (prev[key] && !prev[key].loading) return prev;
          return { ...prev, [key]: { loading: true } };
        });
        try {
          const res = await interpretNews({ title: item.title, content: '', sentimentOnly: true });
          setSentiments(prev => ({
            ...prev,
            [key]: {
              loading: false,
              sentiment: res.data.interpretation?.trim()
            }
          }));
        } catch {
          setSentiments(prev => ({
            ...prev,
            [key]: {
              loading: false,
              sentiment: 'Neutral'
            }
          }));
        }
      }
    };
    fetchSequentially();
    return () => { cancelled = true; };
  }, [news, activeTab, setSentiments]);
}

export default useSequentialSentimentFetch; 