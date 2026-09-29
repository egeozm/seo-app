const { check } = require('./helpers');

function checkOffPage($, pageUrl) {
  const checks = [];
  const parsed = new URL(pageUrl);
  const origin = parsed.origin;

  let external = 0;
  let dofollowExternal = 0;
  let nofollowExternal = 0;
  let sponsored = 0;
  let ugc = 0;
  let blankWithoutNoopener = 0;
  const externalDomains = new Set();

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href')?.trim() || '';
    const rel = ($(el).attr('rel') || '').toLowerCase();
    const target = ($(el).attr('target') || '').toLowerCase();

    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }

    try {
      const linkUrl = new URL(href, pageUrl);
      if (linkUrl.origin === origin) return;

      external += 1;
      externalDomains.add(linkUrl.hostname);

      if (rel.includes('nofollow')) nofollowExternal += 1;
      else dofollowExternal += 1;
      if (rel.includes('sponsored')) sponsored += 1;
      if (rel.includes('ugc')) ugc += 1;

      if (target === '_blank' && !rel.includes('noopener') && !rel.includes('noreferrer')) {
        blankWithoutNoopener += 1;
      }
    } catch {
      /* skip invalid */
    }
  });

  if (external === 0) {
    checks.push(
      check(
        'warn',
        'offpage-no-external-links',
        'Off-Page SEO',
        'No outbound links to authoritative external sources.',
        'Link to trusted references — it signals E-E-A-T and helps users verify claims.'
      )
    );
  } else {
    checks.push(
      check(
        'pass',
        'offpage-external-links',
        'Off-Page SEO',
        `${external} external link(s) to ${externalDomains.size} domain(s) (${dofollowExternal} dofollow, ${nofollowExternal} nofollow).`,
        null
      )
    );
  }

  if (blankWithoutNoopener > 0) {
    checks.push(
      check(
        'warn',
        'offpage-noopener-missing',
        'Off-Page SEO',
        `${blankWithoutNoopener} external link(s) open in new tab without rel="noopener".`,
        'Add rel="noopener noreferrer" to target="_blank" links for security and SEO best practice.'
      )
    );
  }

  if (sponsored === 0 && dofollowExternal > 5) {
    checks.push(
      check(
        'warn',
        'offpage-sponsored-tags',
        'Off-Page SEO',
        'Many dofollow external links — paid/affiliate links should use rel="sponsored".',
        'Mark paid and affiliate links with rel="sponsored nofollow" per Google guidelines.'
      )
    );
  } else if (sponsored > 0) {
    checks.push(
      check(
        'pass',
        'offpage-sponsored',
        'Off-Page SEO',
        `${sponsored} link(s) correctly marked as sponsored.`,
        null
      )
    );
  }

  const authorMeta =
    $('meta[name="author"]').attr('content') ||
    $('[rel="author"]').attr('href') ||
    $('a[rel="author"]').attr('href');
  const hasAuthorSchema = $('script[type="application/ld+json"]')
    .toArray()
    .some((el) => {
      try {
        return JSON.stringify(JSON.parse($(el).html() || '{}')).includes('"author"');
      } catch {
        return false;
      }
    });

  if (!authorMeta && !hasAuthorSchema && $('article').length > 0) {
    checks.push(
      check(
        'warn',
        'offpage-author-missing',
        'Off-Page SEO',
        'Article content without visible author attribution (E-E-A-T signal).',
        'Add author name, bio, and Person/ProfilePage schema for content pages.'
      )
    );
  } else if (authorMeta || hasAuthorSchema) {
    checks.push(
      check(
        'pass',
        'offpage-author',
        'Off-Page SEO',
        'Author attribution detected via meta, link, or schema.',
        null
      )
    );
  }

  const socialProfiles = $('a[href*="twitter.com"], a[href*="linkedin.com"], a[href*="facebook.com"], a[href*="instagram.com"], a[href*="youtube.com"]').length;
  if (socialProfiles === 0) {
    checks.push(
      check(
        'warn',
        'offpage-social-profiles',
        'Off-Page SEO',
        'No links to social media profiles — weak brand/off-page signal.',
        'Link to official social profiles in the footer; add sameAs in Organization schema.'
      )
    );
  } else {
    checks.push(
      check(
        'pass',
        'offpage-social-profiles',
        'Off-Page SEO',
        `${socialProfiles} social profile link(s) found on page.`,
        null
      )
    );
  }

  checks.push(
    check(
      'pass',
      'offpage-backlinks-note',
      'Off-Page SEO',
      'Backlink profile and domain authority require external tools (Ahrefs, Search Console) — not analyzable from HTML alone.',
      null
    )
  );

  return checks;
}

module.exports = { checkOffPage };
