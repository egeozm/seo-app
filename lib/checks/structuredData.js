const { check } = require('./helpers');

function checkStructuredData($) {
  const checks = [];
  const scripts = $('script[type="application/ld+json"]');
  const types = new Set();
  const errors = [];

  if (scripts.length === 0) {
    checks.push(
      check(
        'warn',
        'structured-data-missing',
        'Technical SEO',
        'No JSON-LD structured data found.',
        'Add JSON-LD schema (WebPage, Organization, or Article) to help search engines understand your content.'
      )
    );
    return checks;
  }

  scripts.each((i, el) => {
    const raw = $(el).html()?.trim();
    if (!raw) return;

    try {
      const data = JSON.parse(raw);
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        collectTypes(item, types);
      }
    } catch (err) {
      errors.push(`Block ${i + 1}: ${err.message}`);
    }
  });

  if (errors.length > 0) {
    checks.push(
      check(
        'fail',
        'structured-data-invalid',
        'Technical SEO',
        `JSON-LD parse errors: ${errors.join('; ')}`,
        'Fix invalid JSON-LD syntax so search engines can read your structured data.'
      )
    );
  } else {
    checks.push(
      check(
        'pass',
        'structured-data-valid',
        'Technical SEO',
        `Found ${scripts.length} valid JSON-LD block(s). Types: ${[...types].join(', ') || 'unknown'}`,
        null
      )
    );
  }

  const commonTypes = ['Organization', 'WebPage', 'WebSite', 'Article', 'BreadcrumbList', 'Product'];
  const hasCommon = [...types].some((t) => commonTypes.includes(t));
  if (!hasCommon && errors.length === 0) {
    checks.push(
      check(
        'warn',
        'structured-data-types',
        'Technical SEO',
        'No common schema types detected (WebPage, Organization, Article, etc.).',
        'Consider adding WebPage or Organization schema for better search visibility.'
      )
    );
  }

  return checks;
}

function collectTypes(item, types) {
  if (!item || typeof item !== 'object') return;

  if (item['@type']) {
    const t = item['@type'];
    if (Array.isArray(t)) t.forEach((x) => types.add(x));
    else types.add(t);
  }

  if (item['@graph']) {
    item['@graph'].forEach((g) => collectTypes(g, types));
  }
}

module.exports = { checkStructuredData };
