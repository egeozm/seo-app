const { check } = require('./helpers');

function checkOnPage($, pageUrl) {
  const checks = [];
  const parsed = new URL(pageUrl);
  const path = parsed.pathname;

  if (path.length > 100) {
    checks.push(
      check(
        'warn',
        'onpage-url-long',
        'On-Page SEO',
        `URL path is long (${path.length} chars) — keep URLs short and descriptive.`,
        'Use concise, keyword-rich slugs: /blog/on-page-seo-guide instead of long query-style paths.'
      )
    );
  } else if (/[A-Z]/.test(path)) {
    checks.push(
      check(
        'warn',
        'onpage-url-uppercase',
        'On-Page SEO',
        'URL contains uppercase characters.',
        'Use lowercase URLs consistently to avoid duplicate-content issues.'
      )
    );
  } else if (path.split('/').filter(Boolean).some((seg) => seg.length > 50)) {
    checks.push(
      check(
        'warn',
        'onpage-url-slug-long',
        'On-Page SEO',
        'One or more URL segments are very long.',
        'Shorten slug segments to 3–5 words with primary keywords.'
      )
    );
  } else {
    checks.push(
      check('pass', 'onpage-url-structure', 'On-Page SEO', 'URL structure looks clean and readable.', null)
    );
  }

  if (parsed.search && parsed.search.length > 1) {
    checks.push(
      check(
        'warn',
        'onpage-url-params',
        'On-Page SEO',
        'URL contains query parameters that may create duplicate URLs.',
        'Use canonical tags or clean URLs for indexable content with parameters.',
        { currentCode: `<link rel="canonical" href="${pageUrl.split('?')[0]}">` }
      )
    );
  }

  const title = $('title').first().text().trim().toLowerCase();
  const h1 = $('h1').first().text().trim().toLowerCase();

  if (title && h1) {
    const titleWords = new Set(title.split(/\s+/).filter((w) => w.length > 3));
    const h1Words = h1.split(/\s+/).filter((w) => w.length > 3);
    const overlap = h1Words.filter((w) => titleWords.has(w));

    if (overlap.length === 0) {
      checks.push(
        check(
          'warn',
          'onpage-title-h1-mismatch',
          'On-Page SEO',
          'Title and H1 share no significant keywords — they should describe the same topic.',
          'Align your <title> and <h1> around the same primary keyword phrase.',
          {
            currentCode: `<title>${$('title').first().text().trim()}</title>\n<h1>${$('h1').first().text().trim()}</h1>`,
          }
        )
      );
    } else {
      checks.push(
        check(
          'pass',
          'onpage-title-h1-align',
          'On-Page SEO',
          `Title and H1 are aligned (shared keywords: ${overlap.slice(0, 3).join(', ')}).`,
          null
        )
      );
    }
  }

  const hasBreadcrumbNav =
    $('[aria-label*="breadcrumb" i], .breadcrumb, .breadcrumbs, nav.breadcrumb').length > 0;
  const hasBreadcrumbSchema = $('script[type="application/ld+json"]')
    .toArray()
    .some((el) => {
      try {
        const data = JSON.parse($(el).html() || '{}');
        const str = JSON.stringify(data);
        return str.includes('BreadcrumbList');
      } catch {
        return false;
      }
    });

  if (!hasBreadcrumbNav && !hasBreadcrumbSchema && path.split('/').filter(Boolean).length > 1) {
    checks.push(
      check(
        'warn',
        'onpage-breadcrumbs-missing',
        'On-Page SEO',
        'No breadcrumb navigation or BreadcrumbList schema on a nested page.',
        'Add visible breadcrumbs and JSON-LD BreadcrumbList for deeper pages.'
      )
    );
  } else if (hasBreadcrumbNav || hasBreadcrumbSchema) {
    checks.push(
      check('pass', 'onpage-breadcrumbs', 'On-Page SEO', 'Breadcrumb navigation or schema detected.', null)
    );
  }

  if ($('meta[name="keywords"]').length > 0) {
    checks.push(
      check(
        'warn',
        'onpage-meta-keywords',
        'On-Page SEO',
        'Legacy meta keywords tag found — Google ignores it since 2009.',
        'Remove meta keywords; focus on title, description, and content quality instead.',
        {
          currentCode: $('meta[name="keywords"]').first().toString(),
        }
      )
    );
  }

  const h1Text = $('h1').first().text().trim();
  if (h1Text && h1Text.length > 70) {
    checks.push(
      check(
        'warn',
        'onpage-h1-long',
        'On-Page SEO',
        `H1 is very long (${h1Text.length} chars) — keep it concise and scannable.`,
        'Shorten the H1 to a clear primary headline under ~70 characters.',
        { currentCode: `<h1>${h1Text.slice(0, 80)}${h1Text.length > 80 ? '…' : ''}</h1>` }
      )
    );
  }

  return checks;
}

module.exports = { checkOnPage };
