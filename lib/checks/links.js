const { check } = require('./helpers');

function checkLinks($, pageUrl) {
  const checks = [];
  const parsed = new URL(pageUrl);
  const origin = parsed.origin;

  let internal = 0;
  let external = 0;
  let emptyHref = 0;
  let nofollow = 0;

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href')?.trim() || '';
    const rel = ($(el).attr('rel') || '').toLowerCase();

    if (!href || href === '#') {
      emptyHref += 1;
      return;
    }

    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
      return;
    }

    if (rel.includes('nofollow')) nofollow += 1;

    try {
      const linkUrl = new URL(href, pageUrl);
      if (linkUrl.origin === origin) internal += 1;
      else external += 1;
    } catch {
      emptyHref += 1;
    }
  });

  const total = internal + external;

  if (total === 0) {
    checks.push(
      check('warn', 'links-none', 'On-Page SEO', 'No navigable links found.', 'Add internal links to help users and crawlers discover content.')
    );
  } else {
    checks.push(
      check(
        'pass',
        'links-count',
        'On-Page SEO',
        `Found ${internal} internal and ${external} external links.`,
        null
      )
    );
  }

  if (emptyHref > 0) {
    checks.push(
      check(
        'warn',
        'links-empty-href',
        'On-Page SEO',
        `${emptyHref} links have empty or invalid href values.`,
        'Fix or remove links with empty, "#", or invalid href attributes.'
      )
    );
  }

  if (external > 0 && nofollow === 0) {
    checks.push(
      check(
        'pass',
        'links-nofollow',
        'On-Page SEO',
        'External links found without blanket nofollow usage.',
        null
      )
    );
  }

  return checks;
}

module.exports = { checkLinks };
