import React from 'react';
import { Box, Container, TextField, InputAdornment, IconButton, Stack, Chip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const VALID_TICKERS = ['AAPL', 'TSLA', 'NVDA', 'GOOGL', 'MSFT', 'META'];

function SearchBar({ input, setInput, chips, setChips, activeTab, setActiveTab }) {
  const handleInputChange = (e) => {
    setInput(e.target.value.toUpperCase());
  };

  const handleSend = () => {
    const value = input.trim().toUpperCase();
    if (VALID_TICKERS.includes(value) && !chips.includes(value)) {
      setChips(prev => [...prev, value]);
      setActiveTab(value);
    } else if (VALID_TICKERS.includes(value) && chips.includes(value)) {
      setActiveTab(value);
    }
    setInput('');
  };

  const handleDelete = (ticker) => {
    setChips(prev => prev.filter(t => t !== ticker));
    if (activeTab === ticker) {
      setTimeout(() => {
        setActiveTab(prev => {
          const idx = chips.indexOf(ticker);
          if (chips.length === 1) return null;
          if (idx === 0) return chips[1];
          return chips[idx - 1];
        });
      }, 0);
    }
  };

  return (
    <Box sx={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      bgcolor: 'background.default',
      pt: 2,
      pb: 1,
    }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="How can I help you?"
            value={input.toUpperCase()}
            onChange={handleInputChange}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    color="primary"
                    onClick={handleSend}
                    disabled={!input.trim()}
                    size="small"
                  >
                    <SendIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                bgcolor: 'transparent',
                borderRadius: 2,
                fontSize: '14.4px',
                height: 40,
                '& fieldset': {
                  borderColor: 'divider',
                },
              },
            }}
            sx={{
              '.MuiOutlinedInput-input': {
                py: '8px',
              },
            }}
          />
        </Box>
        {chips.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
            <Stack direction="row" spacing={1}>
              {chips.map(ticker => (
                <Chip
                  key={ticker}
                  label={ticker}
                  color={activeTab === ticker ? 'primary' : 'default'}
                  variant={activeTab === ticker ? 'filled' : 'outlined'}
                  onClick={() => setActiveTab(ticker)}
                  onDelete={() => handleDelete(ticker)}
                  sx={{ fontWeight: 600, fontSize: '1rem', mb: 1, cursor: 'pointer' }}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default SearchBar; 