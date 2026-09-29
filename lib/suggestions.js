const IMPACT = { fail: 'high', warn: 'medium', pass: 'low' };
const { enrichWithCodeFix, enrichSuggestion } = require('./codeExamples');

function buildSuggestions(checks, lighthouseAuditFailures = {}, context = {}) {
  const suggestions = [];

  for (const check of checks) {
    if (check.status === 'pass' || !check.suggestion) continue;

    const enriched = enrichWithCodeFix(check, context);

    suggestions.push({
      id: check.id,
      impact: IMPACT[check.status] || 'low',
      pillar: check.pillar || check.category,
      category: check.pillar || check.category,
      title: check.message,
      suggestion: check.suggestion,
      explanation: enriched.explanation,
      codeExample: enriched.codeExample,
      currentCode: enriched.currentCode,
      current: check.current,
      recommended: check.recommended,
    });
  }

  for (const [category, failures] of Object.entries(lighthouseAuditFailures)) {
    for (const audit of failures) {
      const suggestion = enrichSuggestion(
        {
          id: `lighthouse-${audit.id}`,
          impact: audit.score === 0 ? 'high' : 'medium',
          pillar: 'Technical SEO',
          category: formatCategory(category),
          title: stripMarkdown(audit.title),
          suggestion: stripMarkdown(audit.description).slice(0, 300),
          source: 'lighthouse',
        },
        context
      );

      suggestions.push(suggestion);
    }
  }

  suggestions.sort((a, b) => impactOrder(a.impact) - impactOrder(b.impact));

  return dedupeSuggestions(suggestions);
}

function impactOrder(impact) {
  if (impact === 'high') return 0;
  if (impact === 'medium') return 1;
  return 2;
}

function dedupeSuggestions(suggestions) {
  const seen = new Set();
  return suggestions.filter((s) => {
    const key = `${s.category}:${s.suggestion.slice(0, 80)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function formatCategory(key) {
  const map = {
    seo: 'Lighthouse SEO',
    performance: 'Lighthouse Performance',
    accessibility: 'Lighthouse Accessibility',
    bestPractices: 'Lighthouse Best Practices',
  };
  return map[key] || key;
}

function stripMarkdown(text) {
  return (text || '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<\/?[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

module.exports = { buildSuggestions };
