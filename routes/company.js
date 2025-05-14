const express = require('express');
const router = express.Router();
const { describeCompany } = require('../services/ollamaService');

// POST /api/company/describe
router.post('/describe', async (req, res) => {
  const { companyName } = req.body;
  if (!companyName) {
    return res.status(400).json({ error: 'companyName is required' });
  }
  try {
    const { description, companyName: resolvedName } = await describeCompany(companyName);
    res.json({ description, companyName: resolvedName });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 