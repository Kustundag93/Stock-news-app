import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Avatar,
  Typography,
  Popover,
} from '@mui/material';
import TrendIcon from './TrendIcon';
import SummaryButton from './SummaryButton';

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
  typedText,
}) {
  const key = `${item.title}_${colIdx}_${rowIdx}`;
  const isHovered = openTooltip === key;

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
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, p: 1, pb: '8px !important', height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.2 }}>
          <Avatar src={item.sourceIcon} alt={item.source} sx={{ width: 20, height: 20, mr: 1 }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
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
            mb: 0.2
          }}
        >
          {item.title}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            {timeAgo(item.isoDate)}
          </Typography>
          <Box sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            zIndex: 2,
            display: 'flex',
            alignItems: 'center'
          }}>
            <TrendIcon sentiment={sentiment?.sentiment} loading={sentiment?.loading} />
          </Box>
          {showPriceImpact && isHovered && (
            <SummaryButton
              ref={priceImpactRef}
              loading={aiScore?.loading}
              interpretation={aiScore?.interpretation}
              onClick={onClick}
              isOpen={openTooltip === key}
            />
          )}
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
            width: cardWidth ? `${cardWidth}px` : '300px',
            maxWidth: cardWidth ? `${cardWidth}px` : '300px',
            borderRadius: 2,
            bgcolor: 'background.paper',
            p: 2,
            boxShadow: 6,
            mt: 1,
          },
        }}
        disableRestoreFocus
      >
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
            AI Interpretation
          </Typography>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: 'pre-line',
              fontSize: '0.95rem',
              maxHeight: '200px',
              overflowY: 'auto',
              fontFamily: 'monospace',
              letterSpacing: '0.01em',
            }}
          >
            {typedText || ''}
          </Typography>
        </Box>
      </Popover>
    </Card>
  );
}

export default NewsCard; 