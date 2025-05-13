import React from 'react';
import { Box, Typography, Tooltip, Skeleton } from '@mui/material';

const SummaryButton = React.forwardRef(({ loading, interpretation, onClick, isOpen }, ref) => {
  if (loading) {
    return <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: 2, mr: '32px' }} />;
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
          mr: '32px',
          '&:hover': {
            background: 'rgba(90,90,90,0.25)',
            color: 'primary.main',
            boxShadow: 2,
          }
        }}
        onClick={onClick}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: 0.2,
            userSelect: 'none',
            color: 'primary.main',
          }}
        >
          Summary
        </Typography>
      </Box>
    </Tooltip>
  );
});

export default SummaryButton; 