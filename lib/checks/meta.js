const { check } = require('./helpers');

function checkMeta($, pageUrl) {
  const checks = [];
  const parsedUrl = new URL(pageUrl);
  const ON = 'On-Page SEO';
  const TECH = 'Technical SEO';

  const title = $('title').first().text().trim();
  if (!title) {
    checks.push(
      check('fail', 'meta-title-missing', ON, 'Page title is missing.', 'Add a unique <title> tag between 30–60 characters that describes the page.')
    );
  } else if (title.length < 30) {
    checks.push(
      check('warn', 'meta-title-short', ON, `Title is too short (${title.length} chars).`, 'Expand the title to 30–60 characters for better search visibility.', {
        current: title.length,
        recommended: '30–60',
        currentCode: `<title>${title}</title>`,
      })
    );
  } else if (title.length > 60) {
    checks.push(
      check('warn', 'meta-title-long', ON, `Title is too long (${title.length} chars) and may be truncated.`, 'Shorten the title to 30–60 characters.', {
        current: title.length,
        recommended: '30–60',
        currentCode: `<title>${title.slice(0, 70)}…</title>`,
      })
    );
  } else {
    checks.push(check('pass', 'meta-title', ON, `Title length is good (${title.length} chars).`, null));
  }

  const description = $('meta[name="description"]').attr('content')?.trim() || '';
  if (!description) {
    checks.push(
      check('fail', 'meta-description-missing', ON, 'Meta description is missing.', 'Add a meta description between 120–160 characters summarizing the page.', {
        currentCode: '<head>\n  <!-- no meta description -->\n</head>',
      })
    );
  } else if (description.length < 120) {
    checks.push(
      check('warn', 'meta-description-short', ON, `Meta description is short (${description.length} chars).`, 'Expand the meta description to 120–160 characters.', {
        current: description.length,
        recommended: '120–160',
        currentCode: `<meta name="description" content="${description}">`,
      })
    );
  } else if (description.length > 160) {
    checks.push(
      check('warn', 'meta-description-long', ON, `Meta description is long (${description.length} chars) and may be truncated.`, 'Shorten the meta description to 120–160 characters.', {
        current: description.length,
        recommended: '120–160',
        currentCode: `<meta name="description" content="${description.slice(0, 80)}…">`,
      })
    );
  } else {
    checks.push(check('pass', 'meta-description', ON, `Meta description length is good (${description.length} chars).`, null));
  }

  const canonical = $('link[rel="canonical"]').attr('href');
  if (!canonical) {
    checks.push(
      check('warn', 'meta-canonical-missing', ON, 'Canonical URL is not set.', 'Add <link rel="canonical" href="..."> to prevent duplicate content issues.')
    );
  } else {
    checks.push(check('pass', 'meta-canonical', ON, `Canonical URL is set: ${canonical}`, null));
  }

  const robotsMeta = $('meta[name="robots"]').attr('content')?.toLowerCase() || '';
  if (robotsMeta.includes('noindex')) {
    checks.push(
      check('fail', 'meta-robots-noindex', ON, 'Page has noindex directive.', 'Remove noindex if you want this page indexed by search engines.', {
        currentCode: `<meta name="robots" content="${robotsMeta}">`,
      })
    );
  } else {
    checks.push(
      check('pass', 'meta-robots', ON, robotsMeta ? `Robots meta: ${robotsMeta}` : 'No restrictive robots meta tag found.', null)
    );
  }

  const lang = $('html').attr('lang')?.trim();
  if (!lang) {
    checks.push(check('warn', 'meta-lang-missing', ON, 'HTML lang attribute is missing.', 'Add lang="en" (or appropriate language code) to the <html> element.'));
  } else {
    checks.push(check('pass', 'meta-lang', ON, `Language is set: ${lang}`, null));
  }

  if (parsedUrl.protocol === 'https:') {
    checks.push(check('pass', 'meta-https', TECH, 'Page uses HTTPS.', null));
  } else {
    checks.push(check('warn', 'meta-https', TECH, 'Page does not use HTTPS.', 'Serve the page over HTTPS for security and SEO benefits.'));
  }

  const charset = $('meta[charset]').attr('charset') || $('meta[http-equiv="Content-Type"]').attr('content');
  if (!charset) {
    checks.push(check('warn', 'meta-charset-missing', TECH, 'Character encoding is not declared.', 'Add <meta charset="utf-8"> in the document head.'));
  } else {
    checks.push(check('pass', 'meta-charset', TECH, 'Character encoding is declared.', null));
  }

  const favicon =
    $('link[rel="icon"]').attr('href') ||
    $('link[rel="shortcut icon"]').attr('href') ||
    $('link[rel="apple-touch-icon"]').attr('href');
  if (!favicon) {
    checks.push(check('warn', 'meta-favicon-missing', TECH, 'Favicon is not defined.', 'Add a favicon link for brand recognition in browser tabs and search results.'));
  } else {
    checks.push(check('pass', 'meta-favicon', TECH, 'Favicon is defined.', null));
  }

  return checks;
}

module.exports = { checkMeta };
