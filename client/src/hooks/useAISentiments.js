import { useEffect } from 'react';
import { interpretNews } from '../services/api';
import { extractSentiment } from '../utils/helpers';

export default function useAISentiments(news, activeTab, setSentiments, sentiments) {
  useEffect(() => {
    if (!activeTab || !news.length) return;
    let cancelled = false;
    const fetchSequentially = async () => {
      for (let idx = 0; idx < news.length; idx++) {
        if (cancelled) break;
        const item = news[idx];
        const colIdx = idx % 4;
        const rowIdx = Math.floor(idx / 4);
        const key = `${item.title}_${colIdx}_${rowIdx}`;
        if (!sentiments[key]?.sentiment) {
          try {
            const res = await interpretNews({ title: item.title, content: '' });
            let summary = '';
            let sentiment = 'Neutral';
            try {
              const data = typeof res.data.interpretation === 'string'
                ? JSON.parse(res.data.interpretation)
                : res.data.interpretation;
              summary = data.summary || '';
              sentiment = extractSentiment(summary);
            } catch {
              // fallback
            }
            if (!cancelled) {
              setSentiments(prev => ({
                ...prev,
                [key]: {
                  loading: false,
                  sentiment
                }
              }));
            }
          } catch (err) {
            if (!cancelled) {
              setSentiments(prev => ({
                ...prev,
                [key]: {
                  loading: false,
                  sentiment: 'Neutral'
                }
              }));
            }
          }
        }
      }
    };
    fetchSequentially();
    return () => { cancelled = true; };
  }, [news, activeTab, setSentiments, sentiments]);
} 