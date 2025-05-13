const Parser = require('rss-parser');
const parser = new Parser();
const axios = require('axios');
const cheerio = require('cheerio');
const ollamaService = require('../services/ollamaService');

// Returns news for a given ticker from Yahoo Finance RSS
exports.getYahooNews = async (req, res) => {
  const { ticker } = req.query;
  if (!ticker) {
    return res.status(400).json({ error: 'Ticker is required' });
  }
  try {
    const feedUrl = `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${ticker}&region=US&lang=en-US`;
    const feed = await parser.parseURL(feedUrl);
    const news = feed.items.slice(0, 20).map(item => ({
      source: 'Yahoo Finance',
      sourceIcon: 'https://s.yimg.com/cv/apiv2/default/icons/favicon_y19_32x32_custom.svg',
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      isoDate: item.isoDate || item.pubDate,
    }));
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news', details: error.message });
  }
};

// AI interpretation with Ollama (Mistral)
exports.interpretNews = async (req, res) => {
  const { title, content, sentimentOnly } = req.body;
  if (!title && !content) {
    return res.status(400).json({ error: 'Title or content is required' });
  }

  try {
    const interpretation = await ollamaService.interpretNews(title, content, sentimentOnly);
    console.log('Ollama yanıtı:', interpretation);
    res.json({ interpretation });
  } catch (error) {
    console.error('AI yorumu alınırken hata:', error);
    res.status(500).json({ 
      error: 'AI yorumu alınamadı', 
      details: error.message 
    });
  }
};

// AI interpretation from link with Ollama (Mistral)
exports.interpretNewsFromLink = async (req, res) => {
  const { link } = req.body;
  if (!link) {
    return res.status(400).json({ error: 'Link is required' });
  }
  try {
    // 1. Linkten HTML çek
    const response = await axios.get(link, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = response.data;
    // 2. Cheerio ile parse et
    const $ = cheerio.load(html);
    // Yahoo Finance için ana metni bulmaya çalış
    let content = '';
    // Yahoo Finance ana metin genellikle .caas-body veya .caas-content-body class'ında
    content = $('.caas-body').text().trim() || $('.caas-content-body').text().trim();
    // Yedek: p etiketlerini birleştir
    if (!content) {
      content = $('p').map((i, el) => $(el).text()).get().join(' ');
    }
    // Başlık
    const title = $('title').first().text().trim();
    if (!content) {
      return res.status(400).json({ error: 'Could not extract content from link.' });
    }

    const interpretation = await ollamaService.interpretNews(title, content, true);
    console.log('AI interpretation from link:', interpretation);
    res.json({ interpretation });
  } catch (error) {
    console.error('AI interpret from link error:', error);
    res.status(500).json({ error: 'Failed to get AI interpretation from link', details: error.message });
  }
}; 