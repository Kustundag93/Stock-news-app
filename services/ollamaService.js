const fetch = require('node-fetch');
const axios = require('axios');

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';

/**
 * Ollama API'ye istek gönderir
 * @param {string} prompt - AI'ya gönderilecek prompt
 * @param {boolean} sentimentOnly - Sadece sentiment analizi için mi
 * @returns {Promise<string>} - AI yanıtı
 */
async function generateResponse(prompt, sentimentOnly = false) {
  try {
    console.log('Ollama API isteği gönderiliyor...');
    const ollamaRes = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        model: 'mistral', 
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          debug: false
        }
      })
    });

    if (!ollamaRes.ok) {
      console.error('Ollama API hatası:', {
        status: ollamaRes.status,
        statusText: ollamaRes.statusText
      });
      throw new Error(`Ollama API hatası: ${ollamaRes.status} ${ollamaRes.statusText}`);
    }

    const responseData = await ollamaRes.json();
    
    if (!responseData.response) {
      throw new Error('Ollama API yanıtında response alanı bulunamadı');
    }

    return responseData.response
      .replace(/\n\s*\n/g, '\n')
      .trim();
  } catch (error) {
    console.error('Ollama API hatası:', error);
    throw error;
  }
}

/**
 * Haber için AI yorumu oluşturur
 * @param {string} title - Haber başlığı
 * @param {string} content - Haber içeriği
 * @param {boolean} sentimentOnly - Sadece sentiment analizi için mi
 * @returns {Promise<string>} - AI yanıtı
 */
async function interpretNews(title, content, sentimentOnly = false) {
  let prompt;
  if (sentimentOnly) {
    prompt = `Analyze the following news and state if the sentiment is positive, negative, or neutral. Respond only with one word: Positive, Negative, or Neutral.\n\nTitle: ${title}\nContent: ${content}`;
  } else {
    prompt = `You are a financial news analyst. Analyze the following news article and provide a concise summary (2-3 sentences) of its potential impact on the stock price. In your summary, also indicate the sentiment by starting with either "POSITIVE:", "NEGATIVE:", or "NEUTRAL:" followed by your analysis.

Title: ${title}
Content: ${content}

Respond in this exact JSON format, nothing else:
{
  "summary": "SENTIMENT: your concise summary here"
}`;
  }
  
  return generateResponse(prompt, sentimentOnly);
}

async function askImportantNews(prompt) {
  const response = await axios.post('http://localhost:11434/api/generate', {
    model: 'mistral',
    prompt,
    stream: false,
    options: { temperature: 0 }
  });
  console.log('Ollama yanıtı:', response.data);
  const completion = response.data.completion || response.data.response || '';
  return completion
    ? completion.split('\n').map(line => line.trim()).filter(line => line)
    : [];
}

/**
 * Şirket için detaylı İngilizce açıklama oluşturur
 * @param {string} companyNameOrTicker - Şirket adı veya ticker
 * @returns {Promise<string>} - AI yanıtı
 */
async function describeCompany(companyNameOrTicker) {
  const tickerMap = {
    AAPL: 'Apple Inc.',
    MSFT: 'Microsoft Corporation',
    TSLA: 'Tesla Inc.',
    AMZN: 'Amazon.com, Inc.',
    GOOGL: 'Alphabet Inc.',
    META: 'Meta Platforms, Inc.',
    NVDA: 'NVIDIA Corporation',
    NFLX: 'Netflix, Inc.',
    BRK: 'Berkshire Hathaway Inc.',
    JPM: 'JPMorgan Chase & Co.',
    V: 'Visa Inc.',
    DIS: 'The Walt Disney Company'
    // Diğer popüler tickerlar eklenebilir
  };
  const name = tickerMap[companyNameOrTicker.toUpperCase()] || companyNameOrTicker;
  const prompt = `You are a financial analyst. The following input is a US stock ticker or a company name. If it is a ticker, first determine which company it belongs to, then write a formal, well-structured, and informative English paragraph for an investor or finance professional who wants to understand this company.\n\nYour response must be a single, coherent paragraph (do not use bullet points or lists) that covers: what the company does and its main business areas, its market value, headquarters, CEO (if available), key products or services, any recent important developments or unique strengths, and its place in the industry and main competitors.\n\nWrite in a clear, professional, and objective tone. Respond only in English. Do not use bullet points or lists.\n\nInput: ${name}`;
  const response = await generateResponse(prompt);
  return { description: response, companyName: name };
}

module.exports = {
  interpretNews,
  generateResponse,
  askImportantNews,
  describeCompany
}; 