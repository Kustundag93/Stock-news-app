import { useEffect } from 'react';
import { interpretNews } from '../services/api';

export default function useAISummaries(news, activeTab, setAiScores, aiScores) {
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
        if (!aiScores[key]?.interpretation) {
          try {
            const res = await interpretNews({ title: item.title, content: '' });
            const interpretation = res.data && res.data.interpretation ? res.data.interpretation : 'No AI response.';
            if (!cancelled) {
              setAiScores(prev => ({
                ...prev,
                [key]: {
                  loading: false,
                  interpretation
                }
              }));
            }
          } catch (err) {
            if (!cancelled) {
              setAiScores(prev => ({
                ...prev,
                [key]: {
                  loading: false,
                  interpretation: 'No AI response.'
                }
              }));
            }
          }
        }
      }
    };
    fetchSequentially();
    return () => { cancelled = true; };
  }, [news, activeTab, setAiScores, aiScores]);
} 