import React from 'react';
import { Box, Typography, IconButton, Badge, Stack } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

function SentimentFilterBar({ sentimentCounts, sentimentFilter, setSentimentFilter }) {
  return (
    <Box sx={{ mb: 0, display: 'flex', alignItems: 'center', gap: 2, height: 40 }}>
      <Stack direction="row" spacing={1}>
        <Badge badgeContent={sentimentCounts.positive} color="success" showZero>
          <IconButton
            size="small"
            sx={{
              p: 0.5,
              bgcolor: sentimentFilter === 'positive' ? 'success.light' : 'background.paper',
              border: sentimentFilter === 'positive' ? '2px solid #43a047' : 'none',
            }}
            onClick={() => setSentimentFilter(sentimentFilter === 'positive' ? null : 'positive')}
          >
            <TrendingUpIcon sx={{ color: 'success.main', fontSize: 18 }} />
          </IconButton>
        </Badge>
        <Badge badgeContent={sentimentCounts.negative} color="error" showZero>
          <IconButton
            size="small"
            sx={{
              p: 0.5,
              bgcolor: sentimentFilter === 'negative' ? 'error.light' : 'background.paper',
              border: sentimentFilter === 'negative' ? '2px solid #e53935' : 'none',
            }}
            onClick={() => setSentimentFilter(sentimentFilter === 'negative' ? null : 'negative')}
          >
            <TrendingDownIcon sx={{ color: 'error.main', fontSize: 18 }} />
          </IconButton>
        </Badge>
        <Badge badgeContent={sentimentCounts.neutral} color="default" showZero>
          <IconButton
            size="small"
            sx={{
              p: 0.5,
              bgcolor: sentimentFilter === 'neutral' ? 'grey.200' : 'background.paper',
              border: sentimentFilter === 'neutral' ? '2px solid #757575' : 'none',
            }}
            onClick={() => setSentimentFilter(sentimentFilter === 'neutral' ? null : 'neutral')}
          >
            <TrendingFlatIcon sx={{ color: 'grey.600', fontSize: 18 }} />
          </IconButton>
        </Badge>
      </Stack>
    </Box>
  );
}

export default SentimentFilterBar; 