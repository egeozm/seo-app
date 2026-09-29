const { check } = require('./helpers');

function checkTechnical($, pageUrl, pageMeta = {}) {
  const checks = [];
  const headers = pageMeta.headers || {};

  const hreflang = $('link[rel="alternate"][hreflang]');
  if (hreflang.length > 0) {
    const langs = hreflang
      .toArray()
      .map((el) => $(el).attr('hreflang'))
      .filter(Boolean);
    checks.push(
      check(
        'pass',
        'technical-hreflang',
        'Technical SEO',
        `Hreflang tags found for: ${langs.join(', ')}`,
        null
      )
    );

    const hasXDefault = langs.some((l) => l.toLowerCase() === 'x-default');
    if (!hasXDefault && langs.length > 1) {
      checks.push(
        check(
          'warn',
          'technical-hreflang-xdefault',
          'Technical SEO',
          'Multiple hreflang tags but no x-default fallback.',
          'Add <link rel="alternate" hreflang="x-default" href="..."> for unmatched locales.'
        )
      );
    }
  }

  const relNext = $('link[rel="next"]').attr('href');
  const relPrev = $('link[rel="prev"]').attr('href');
  if (relNext || relPrev) {
    checks.push(
      check(
        'pass',
        'technical-pagination',
        'Technical SEO',
        'Pagination rel=next/prev tags detected for series content.',
        null
      )
    );
  }

  const xRobots = headers['x-robots-tag'];
  if (xRobots && xRobots.toLowerCase().includes('noindex')) {
    checks.push(
      check(
        'fail',
        'technical-x-robots-noindex',
        'Technical SEO',
        `X-Robots-Tag header blocks indexing: ${xRobots}`,
        'Remove noindex from the X-Robots-Tag response header for indexable pages.',
        { currentCode: `# Response header\nX-Robots-Tag: ${xRobots}` }
      )
    );
  }

  const cacheControl = headers['cache-control'];
  if (!cacheControl) {
    checks.push(
      check(
        'warn',
        'technical-cache-control',
        'Technical SEO',
        'No Cache-Control header detected — caching may be suboptimal.',
        'Set cache headers for static assets to improve crawl efficiency and speed.'
      )
    );
  } else {
    checks.push(
      check(
        'pass',
        'technical-cache-control',
        'Technical SEO',
        `Cache-Control: ${cacheControl.slice(0, 60)}`,
        null
      )
    );
  }

  const hasMain = $('main').length > 0;
  const hasHeader = $('header').length > 0;
  const hasFooter = $('footer').length > 0;
  const semanticScore = [hasMain, hasHeader, hasFooter].filter(Boolean).length;

  if (semanticScore < 2) {
    checks.push(
      check(
        'warn',
        'technical-semantic-html',
        'Technical SEO',
        'Page lacks semantic HTML landmarks (main, header, footer).',
        'Use HTML5 semantic elements so crawlers understand page structure.'
      )
    );
  } else {
    checks.push(
      check(
        'pass',
        'technical-semantic-html',
        'Technical SEO',
        'Semantic HTML landmarks detected (main/header/footer).',
        null
      )
    );
  }

  const preconnect = $('link[rel="preconnect"], link[rel="dns-prefetch"]').length;
  if (preconnect === 0) {
    checks.push(
      check(
        'warn',
        'technical-resource-hints',
        'Technical SEO',
        'No preconnect or dns-prefetch hints for third-party origins.',
        'Add resource hints for fonts, analytics, or CDN domains you load early.'
      )
    );
  } else {
    checks.push(
      check(
        'pass',
        'technical-resource-hints',
        'Technical SEO',
        `${preconnect} resource hint(s) found.`,
        null
      )
    );
  }

  if (pageMeta.originalUrl && pageMeta.finalUrl && pageMeta.originalUrl !== pageMeta.finalUrl) {
    checks.push(
      check(
        'pass',
        'technical-redirect',
        'Technical SEO',
        `Page redirects to: ${pageMeta.finalUrl}`,
        null
      )
    );
  }

  const parsed = new URL(pageUrl);
  if (parsed.pathname.endsWith('/') && parsed.pathname !== '/') {
    checks.push(
      check(
        'warn',
        'technical-trailing-slash',
        'Technical SEO',
        'URL uses a trailing slash — ensure consistent URL format site-wide.',
        'Pick trailing slash or no trailing slash and redirect the other variant with 301 + canonical.'
      )
    );
  }

  return checks;
}

module.exports = { checkTechnical };
