import React from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import NewsCard from './NewsCard';

function NewsGrid({
  news,
  loading,
  aiScores,
  sentiments,
  showPriceImpact,
  cardRefs,
  priceImpactRefs,
  cardWidths,
  openTooltip,
  anchorEls,
  onClose,
  onMouseEnter,
  onMouseLeave,
  onClick,
  typedText,
}) {
  // Kartları 4 sütuna böl
  const columns = [[], [], [], []];
  news.forEach((item, idx) => {
    columns[idx % 4].push(item);
  });

  if (loading) {
    return <Typography color="text.secondary">Loading news...</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {columns.map((col, colIdx) => (
        <Grid item xs={12} sm={6} md={3} key={colIdx}>
          <Stack spacing={2}>
            {col.slice(0, 5).map((item, idx) => {
              const rowIdx = idx;
              const key = `${item.title}_${colIdx}_${rowIdx}`;
              return (
                <NewsCard
                  key={key}
                  item={item}
                  colIdx={colIdx}
                  rowIdx={rowIdx}
                  aiScore={aiScores[key]}
                  sentiment={sentiments[key]}
                  showPriceImpact={showPriceImpact}
                  cardRef={el => { cardRefs.current[key] = el; }}
                  priceImpactRef={el => { priceImpactRefs.current[key] = el; }}
                  cardWidth={cardWidths[key]}
                  openTooltip={openTooltip}
                  anchorEl={anchorEls[key]}
                  onClose={onClose}
                  onMouseEnter={() => onMouseEnter(key)}
                  onMouseLeave={onMouseLeave}
                  onClick={() => onClick(key)}
                  typedText={typedText[key]}
                />
              );
            })}
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
}

export default NewsGrid; 