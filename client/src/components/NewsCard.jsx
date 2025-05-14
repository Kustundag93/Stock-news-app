import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Box,
  Avatar,
  Typography,
  Popover,
} from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import TrendIcon from './TrendIcon';
import SummaryButton from './SummaryButton';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import useTypewriterEffect from '../hooks/useTypewriterEffect';
import { cleanSummary } from '../utils/helpers';

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

const medalColors = [
  '#FFD700', // Gold
  '#C0C0C0', // Silver
  '#cd7f32', // Bronze
];

function NewsCard({
  item,
  colIdx,
  rowIdx,
  aiScore,
  sentiment,
  showPriceImpact,
  cardRef,
  priceImpactRef,
  cardWidth,
  openTooltip,
  anchorEl,
  onClose,
  onMouseEnter,
  onMouseLeave,
  onClick,
  isImportant,
  importantRank,
}) {
  const key = `${item.title}_${colIdx}_${rowIdx}`;
  const isHovered = openTooltip === key;

  // Local typewriter effect for popover
  const [localTypedText, setLocalTypedText] = useState('');
  useEffect(() => {
    if (isHovered && aiScore?.interpretation) {
      setLocalTypedText('');
    }
  }, [isHovered, aiScore?.interpretation]);
  useTypewriterEffect(
    isHovered ? aiScore?.interpretation : '',
    !isHovered,
    setLocalTypedText
  );

  return (
    <Card
      ref={cardRef}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderRadius: 2,
        minHeight: 130,
        height: 130,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        position: 'relative',
        cursor: showPriceImpact ? 'pointer' : 'default',
        '&:hover': {
          boxShadow: showPriceImpact ? 3 : 1
        }
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {isImportant && importantRank && importantRank <= 3 && (
        <Box sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 3,
          width: 28,
          height: 28,
          bgcolor: medalColors[importantRank - 1],
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 2,
          border: '2px solid #fff',
        }}>
          <EmojiEventsIcon sx={{ color: '#fff', fontSize: 18 }} />
        </Box>
      )}
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, p: 1, pb: '8px !important', height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.4 }}>
          <Avatar src={item.sourceIcon} alt={item.source} sx={{ width: 20, height: 20, mr: 1 }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', height: 20 }}>
            {item.source}
          </Typography>
        </Box>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          gutterBottom
          component="a"
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            fontSize: '0.95rem',
            lineHeight: 1.2,
            minHeight: '2.4em',
            maxHeight: '2.4em',
            mb: 1.2
          }}
        >
          {item.title}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            {timeAgo(item.isoDate)}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {showPriceImpact && isHovered && (
              <SummaryButton
                ref={priceImpactRef}
                loading={aiScore?.loading}
                interpretation={aiScore?.interpretation}
                onClick={onClick}
                isOpen={openTooltip === key}
                sx={{ mb: 1 }}
                sentiment={sentiment?.sentiment}
              />
            )}
            <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center' }}>
              <TrendIcon sentiment={sentiment?.sentiment} loading={sentiment?.loading} />
            </Box>
          </Box>
        </Box>
      </CardContent>
      <Popover
        open={openTooltip === key && Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: cardWidth ? `${Math.round(cardWidth * 1.2)}px` : '360px',
            maxWidth: cardWidth ? `${Math.round(cardWidth * 1.2)}px` : '360px',
            borderRadius: 2,
            bgcolor: 'background.paper',
            p: 2,
            boxShadow: 6,
            mt: 1,
          },
        }}
        disableRestoreFocus
      >
        <ClickAwayListener onClickAway={onClose}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mr: 1 }}>
                AI Interpretation
              </Typography>
              <TrendIcon sentiment={sentiment?.sentiment} loading={sentiment?.loading} />
            </Box>
            <Typography
              variant="body2"
              sx={{
                whiteSpace: 'pre-line',
                fontSize: '0.95rem',
                maxHeight: '200px',
                overflowY: 'auto',
                fontFamily: 'monospace',
                letterSpacing: '0.01em',
                '&::-webkit-scrollbar': {
                  width: '6px',
                  backgroundColor: 'rgba(0,0,0,0.04)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(120,120,120,0.25)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: 'rgba(120,120,120,0.45)',
                },
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(120,120,120,0.25) rgba(0,0,0,0.04)',
              }}
            >
              {cleanSummary(localTypedText || aiScore?.interpretation || 'NO AI RESPONSE')}
            </Typography>
          </Box>
        </ClickAwayListener>
      </Popover>
    </Card>
  );
}

export default NewsCard; 