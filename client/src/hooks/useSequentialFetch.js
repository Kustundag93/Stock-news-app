import { useEffect } from 'react';
import { interpretNews } from '../services/api';

function useSequentialFetch(news, activeTab, setAiScores) {
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
        setAiScores(prev => {
          if (prev[key] && !prev[key].loading) return prev;
          return { ...prev, [key]: { loading: true } };
        });
        try {
          const res = await interpretNews({ title: item.title, content: '' });
          setAiScores(prev => ({
            ...prev,
            [key]: {
              loading: false,
              interpretation: res.data.interpretation
            }
          }));
        } catch {
          setAiScores(prev => ({
            ...prev,
            [key]: {
              loading: false,
              interpretation: 'No AI response.'
            }
          }));
        }
      }
    };
    fetchSequentially();
    return () => { cancelled = true; };
  }, [news, activeTab, setAiScores]);
}

export default useSequentialFetch; 