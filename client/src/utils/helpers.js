// Example helper function
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function normalize(str) {
  return str
    .toLowerCase()
    .replace(/^[\d\s\.-:]+/, '') // baştaki numara, tire, iki nokta, boşluk
    .replace(/[^a-z0-9ğüşöçıİ ]/gi, '') // özel karakterler
    .replace(/\s+/g, ' ') // fazla boşluk
    .trim();
}

// Remove sentiment prefix, brackets, and 'summary' key from AI summary
export function cleanSummary(text) {
  if (!text) return '';
  let cleaned = text.replace(/^(POSITIVE|NEGATIVE|NEUTRAL):\s*/i, '');
  cleaned = cleaned.replace(/^[{\[]?\s*['\"]?summary['\"]?\s*:\s*/i, '');
  cleaned = cleaned.replace(/[}\]]+$/, '');
  cleaned = cleaned.replace(/(POSITIVE|NEGATIVE|NEUTRAL)\s*:?/gi, '');
  cleaned = cleaned.replace(/^['\"]+|['\"]+$/g, '').trim();
  cleaned = cleaned.replace(/\s*var\s*$/i, '').trim();
  cleaned = cleaned.replace(/['"]$/g, '').trim(); // Sadece en sondaki tırnak karakterini kaldır
  return cleaned;
}

// Extract sentiment from summary
export function extractSentiment(summary) {
  if (!summary) return 'Neutral';
  if (/^POSITIVE:/i.test(summary)) return 'Positive';
  if (/^NEGATIVE:/i.test(summary)) return 'Negative';
  if (/^NEUTRAL:/i.test(summary)) return 'Neutral';
  return 'Neutral';
} 