const { check } = require('./helpers');

function checkReadability($) {
  const checks = [];

  $('script, style, noscript').remove();
  const text = $('body').text().replace(/\s+/g, ' ').trim();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = Math.max(sentences.length, 1);
  const avgWordsPerSentence = wordCount / sentenceCount;

  const syllableEstimate = words.reduce((sum, word) => sum + estimateSyllables(word), 0);
  const flesch =
    sentenceCount > 0 && wordCount > 0
      ? Math.round(206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableEstimate / wordCount))
      : 0;

  if (wordCount < 300) {
    checks.push(
      check(
        'warn',
        'content-thin',
        'Content SEO',
        `Thin content detected (${wordCount} words).`,
        'Aim for at least 300 words of unique, valuable content for better rankings.',
        { wordCount }
      )
    );
  } else {
    checks.push(
      check(
        'pass',
        'content-word-count',
        'Content SEO',
        `Word count is adequate (${wordCount} words).`,
        null,
        { wordCount }
      )
    );
  }

  if (flesch < 30) {
    checks.push(
      check(
        'warn',
        'content-readability-hard',
        'Content SEO',
        `Content readability is difficult (Flesch score: ${flesch}).`,
        'Use shorter sentences and simpler language to improve readability.',
        { fleschScore: flesch }
      )
    );
  } else if (flesch >= 60) {
    checks.push(
      check(
        'pass',
        'content-readability',
        'Content SEO',
        `Readability is good (Flesch score: ${flesch}).`,
        null,
        { fleschScore: flesch }
      )
    );
  } else {
    checks.push(
      check(
        'pass',
        'content-readability-ok',
        'Content SEO',
        `Readability is acceptable (Flesch score: ${flesch}, avg ${avgWordsPerSentence.toFixed(1)} words/sentence).`,
        null,
        { fleschScore: flesch }
      )
    );
  }

  return checks;
}

function estimateSyllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 3) return 1;
  const vowels = w.match(/[aeiouy]+/g);
  let count = vowels ? vowels.length : 1;
  if (w.endsWith('e')) count -= 1;
  return Math.max(count, 1);
}

module.exports = { checkReadability };
