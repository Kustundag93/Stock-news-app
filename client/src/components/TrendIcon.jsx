import React from 'react';
import { Box, Tooltip, Skeleton } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

function TrendIcon({ sentiment, loading }) {
  if (loading) {
    return <Skeleton variant="circular" width={18} height={18} />;
  }

  let normalizedSentiment = sentiment?.toLowerCase().replace(/[^a-z]/g, '') || '';

  if (normalizedSentiment.startsWith('positive')) {
    return (
      <Tooltip title="positive" arrow>
        <span><TrendingUpIcon sx={{ color: 'success.main', fontSize: 18 }} /></span>
      </Tooltip>
    );
  } else if (normalizedSentiment.startsWith('negative')) {
    return (
      <Tooltip title="negative" arrow>
        <span><TrendingDownIcon sx={{ color: 'error.main', fontSize: 18 }} /></span>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip title="neutral" arrow>
        <span><TrendingFlatIcon sx={{ color: 'grey.500', fontSize: 18 }} /></span>
      </Tooltip>
    );
  }
}

export default TrendIcon; 