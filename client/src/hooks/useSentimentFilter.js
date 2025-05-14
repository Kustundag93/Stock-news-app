import { useMemo } from 'react';

export default function useSentimentFilter(news, sentiments, sentimentFilter) {
  const sentimentCounts = useMemo(() => {
    const counts = { positive: 0, negative: 0, neutral: 0 };
    news.forEach((item, idx) => {
      const colIdx = idx % 4;
      const rowIdx = Math.floor(idx / 4);
      const key = `${item.title}_${colIdx}_${rowIdx}`;
      const s = sentiments[key]?.sentiment?.toLowerCase() || '';
      if (s.startsWith('positive')) counts.positive++;
      else if (s.startsWith('negative')) counts.negative++;
      else if (s.startsWith('neutral')) counts.neutral++;
    });
    return counts;
  }, [news, sentiments]);

  const filteredNews = useMemo(() => {
    if (!sentimentFilter) return news;
    return news.filter((item, idx) => {
      const colIdx = idx % 4;
      const rowIdx = Math.floor(idx / 4);
      const key = `${item.title}_${colIdx}_${rowIdx}`;
      const s = sentiments[key]?.sentiment?.toLowerCase() || '';
      if (sentimentFilter === 'positive') return s.startsWith('positive');
      if (sentimentFilter === 'negative') return s.startsWith('negative');
      if (sentimentFilter === 'neutral') return s.startsWith('neutral');
      return true;
    });
  }, [news, sentiments, sentimentFilter]);

  return { sentimentCounts, filteredNews };
} 