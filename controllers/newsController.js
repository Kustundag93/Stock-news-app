const Parser = require('rss-parser');
const parser = new Parser();
const axios = require('axios');
const cheerio = require('cheerio');
const ollamaService = require('../services/ollamaService');

// Google News'tan haber çekme fonksiyonu
async function fetchGoogleNews(ticker) {
  const url = `https://news.google.com/rss/search?q=${ticker}+stock&hl=en-US&gl=US&ceid=US:en`;
  const feed = await parser.parseURL(url);
  return feed.items.slice(0, 10).map(item => ({
    source: 'Google News',
    sourceIcon: 'https://news.google.com/favicon.ico',
    title: item.title,
    link: item.link,
    pubDate: item.pubDate,
    isoDate: item.isoDate || item.pubDate,
  }));
}

// Returns news for a given ticker from Yahoo Finance RSS + Google News RSS
exports.getYahooNews = async (req, res) => {
  const { ticker } = req.query;
  if (!ticker) {
    return res.status(400).json({ error: 'Ticker is required' });
  }
  try {
    const feedUrl = `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${ticker}&region=US&lang=en-US`;
    console.log(`[${ticker}] Fetching news...`);
    const feed = await parser.parseURL(feedUrl);
    const yahooNews = feed.items.slice(0, 10).map(item => ({
      source: 'Yahoo Finance',
      sourceIcon: 'https://s.yimg.com/cv/apiv2/default/icons/favicon_y19_32x32_custom.svg',
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      isoDate: item.isoDate || item.pubDate,
    }));
    const googleNews = await fetchGoogleNews(ticker);
    const allNews = [...yahooNews, ...googleNews]
      .sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate))
      .slice(0, 40);
    console.log(`[${ticker}] Fetched ${allNews.length} news items (${yahooNews.length} from Yahoo, ${googleNews.length} from Google)`);
    res.json(allNews);
  } catch (error) {
    console.error(`[${ticker}] News fetch error:`, error.message);
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
    console.log('[AI] interpretation:', interpretation);
    if (sentimentOnly) {
      console.log(`[AI] Sentiment for "${title.substring(0, 50)}...": ${interpretation}`);
    }
    res.json({ interpretation });
  } catch (error) {
    console.error('[AI] Interpretation error:', error.message);
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

// En önemli 3 haberi AI ile belirleyen endpoint
exports.getTopImportantNews = async (req, res) => {
  const { news } = req.body;
  if (!news || !Array.isArray(news) || news.length === 0) {
    console.error('[AI] Error: Empty news array');
    return res.status(400).json({ error: 'News array is required' });
  }
  try {
    let prompt = `You are a Wall Street trader and financial news analyst. Here is a list of news articles, each with an ID, title, and summary.\nRank ALL the news by their potential impact on the stock price, from most to least important, from a professional investor's perspective.\nDo NOT just pick the most recent news. Focus on news that could cause significant price movement, such as earnings surprises, regulatory changes, mergers, lawsuits, or major analyst upgrades/downgrades.\nReturn ONLY the IDs of the three most important news items (in order of importance), separated by commas. Do not include any explanations, titles, or extra text. Only output the IDs, nothing else.\nIf you are unsure, still select the three most impactful news items. Always return exactly three IDs, even if you have to make a best guess.\n\nNews List:\n`;
    news.forEach((item, idx) => {
      prompt += `${idx + 1}. Title: ${item.title}\n   Summary: ${item.summary}\n`;
    });
    const aiResponse = await ollamaService.askImportantNews(prompt);
    console.log('[AI] Raw response lines:', aiResponse);
    let idLine = aiResponse[0] || '';
    const idMatches = idLine.match(/\d+/g) || [];
    let ids = idMatches.map(str => parseInt(str, 10));
    // Fallback: Eğer 3'ten az ID varsa, kalanları sırayla ekle
    if (ids.length < 3) {
      for (let i = 1; ids.length < 3 && i <= news.length; i++) {
        if (!ids.includes(i)) ids.push(i);
      }
    }
    console.log('[AI] Selected important IDs:', ids);
    const important = ids.map(id => news[id - 1]?.title).filter(Boolean);
    console.log('[AI] Selected important news:', important);

    // Seçilen her haber için AI'ya neden seçtiğini sor
    for (let i = 0; i < ids.length; i++) {
      const idx = ids[i] - 1;
      if (news[idx]) {
        const whyPrompt = `You are a Wall Street trader. Here is a news article with a title and summary. In 1-2 sentences, explain why this news could be important for the stock price from an investor's perspective.\nTitle: ${news[idx].title}\nSummary: ${news[idx].summary}`;
        try {
          // Tek tek sequential fetch, çünkü explanation kısa olacak
          // (Dilerseniz Promise.all ile paralel de yapılabilir)
          const explanationArr = await ollamaService.askImportantNews(whyPrompt);
          const explanation = Array.isArray(explanationArr) ? explanationArr.join(' ') : explanationArr;
          console.log(`[AI] Why important [${news[idx].title}]:`, explanation);
        } catch (err) {
          console.log(`[AI] Why important [${news[idx].title}]: (error)`, err.message);
        }
      }
    }
    res.json({ important });
  } catch (error) {
    console.error('[AI] Important news selection error:', error.message);
    res.status(500).json({ error: 'Failed to get important news', details: error.message });
  }
}; 