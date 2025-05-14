import React from 'react';
import { Box, Tooltip, Skeleton } from '@mui/material';
import SummarizeIcon from '@mui/icons-material/Summarize';

const getSentimentColor = (sentiment) => {
  if (!sentiment) return 'grey.600';
  const norm = sentiment.toLowerCase();
  if (norm.startsWith('positive')) return 'success.main';
  if (norm.startsWith('negative')) return 'error.main';
  if (norm.startsWith('neutral')) return 'grey.600';
  return 'grey.600';
};

const SummaryButton = React.forwardRef(({ loading, interpretation, onClick, isOpen, sx, sentiment }, ref) => {
  if (loading) {
    return <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: 2 }} />;
  }

  if (!interpretation) return null;

  return (
    <Tooltip title="Show summary">
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          padding: '2px 8px',
          borderRadius: 4,
          background: isOpen ? 'rgba(90,90,90,0.15)' : 'transparent',
          transition: 'background 0.2s, color 0.2s',
          '&:hover': {
            background: 'rgba(90,90,90,0.25)',
            color: 'primary.main',
            boxShadow: 2,
          },
          ...sx
        }}
        onClick={onClick}
      >
        <SummarizeIcon sx={{ fontSize: 16, mr: 0, color: getSentimentColor(sentiment) }} />
      </Box>
    </Tooltip>
  );
});

export default SummaryButton; 