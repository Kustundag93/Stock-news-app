import React from 'react';
import { Box, Grid, Stack, Skeleton } from '@mui/material';
import NewsCard from './NewsCard';

function NewsGrid({
  news,
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
  importantTitles,
  normalize,
}) {
  // Kartları 4 sütuna böl
  const columns = [[], [], [], []];
  news.forEach((item, idx) => {
    columns[idx % 4].push(item);
  });

  // Her sütunda gelen haber kadar kart göster
  return (
    <Grid container spacing={2}>
      {columns.map((col, colIdx) => (
        <Grid item xs={12} sm={6} md={3} key={colIdx}>
          <Stack spacing={2}>
            {col.map((item, idx) => {
              const rowIdx = idx;
              const key = `${item.title}_${colIdx}_${rowIdx}`;
              
              // Başlık eşleştirmesi için normalize edilmiş başlıkları karşılaştır
              const normalizedItemTitle = normalize(item.title);
              const importantIdx = importantTitles?.findIndex(title => {
                const normalizedTitle = normalize(title);
                const isMatch = normalizedTitle === normalizedItemTitle;
                if (isMatch) {
                  console.log('Başlık eşleşmesi bulundu:', {
                    originalItemTitle: item.title,
                    normalizedItemTitle,
                    originalImportantTitle: title,
                    normalizedImportantTitle: normalizedTitle,
                    index: importantTitles.indexOf(title)
                  });
                }
                return isMatch;
              });
              
              if (importantIdx !== -1) {
                console.log('Önemli haber bulundu:', {
                  title: item.title,
                  rank: importantIdx + 1,
                  totalImportant: importantTitles?.length
                });
              }

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
                  isImportant={importantIdx !== -1}
                  importantRank={importantIdx !== -1 ? importantIdx + 1 : null}
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