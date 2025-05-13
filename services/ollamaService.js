const fetch = require('node-fetch');

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
    prompt = `You are a financial news analyst. Analyze the following news and provide only a concise explanation of its potential impact on the stock price. Do not include any headings or labels, just the explanation itself.\n\nNews Content:\nTitle: ${title}\nContent: ${content}\n\nFocus on financial implications, market sentiment, and key factors. Respond with only the explanation.`;
  }
  
  return generateResponse(prompt, sentimentOnly);
}

module.exports = {
  interpretNews,
  generateResponse
}; 