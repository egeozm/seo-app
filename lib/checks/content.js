const cheerio = require('cheerio');
const { check } = require('./helpers');

function checkContent($) {
  const checks = [];

  const bodyClone = cheerio.load($.html());
  bodyClone('script, style, noscript').remove();
  const bodyText = bodyClone('body').text().replace(/\s+/g, ' ').trim();
  const title = $('title').first().text().trim().toLowerCase();
  const titleKeywords = title.split(/\s+/).filter((w) => w.length > 3);

  const bodyLower = bodyText.toLowerCase();
  const foundInBody = titleKeywords.filter((kw) => bodyLower.includes(kw));

  if (titleKeywords.length > 0 && foundInBody.length === 0) {
    checks.push(
      check(
        'warn',
        'content-title-keywords-missing',
        'Content SEO',
        'Primary title keywords do not appear in the page body.',
        'Naturally include your target keywords in the opening paragraphs and headings.',
        { currentCode: `<title>${$('title').first().text().trim()}</title>` }
      )
    );
  } else if (foundInBody.length > 0) {
    checks.push(
      check(
        'pass',
        'content-title-keywords',
        'Content SEO',
        `Title keywords found in body content (${foundInBody.slice(0, 3).join(', ')}).`,
        null
      )
    );
  }

  const paragraphs = $('p')
    .toArray()
    .map((el) => $(el).text().trim())
    .filter((t) => t.length > 0);
  const longParagraphs = paragraphs.filter((p) => p.split(/\s+/).length > 150);

  if (longParagraphs.length > 0) {
    checks.push(
      check(
        'warn',
        'content-long-paragraphs',
        'Content SEO',
        `${longParagraphs.length} paragraph(s) exceed 150 words — hard to scan.`,
        'Break long paragraphs into shorter blocks with subheadings and bullet lists.'
      )
    );
  } else if (paragraphs.length >= 3) {
    checks.push(
      check('pass', 'content-paragraph-length', 'Content SEO', 'Paragraph lengths are scannable.', null)
    );
  }

  const lists = $('ul, ol').length;
  if (paragraphs.length > 5 && lists === 0) {
    checks.push(
      check(
        'warn',
        'content-no-lists',
        'Content SEO',
        'Long-form content without bullet or numbered lists.',
        'Add lists to improve scannability and featured-snippet eligibility.'
      )
    );
  } else if (lists > 0) {
    checks.push(
      check(
        'pass',
        'content-lists',
        'Content SEO',
        `${lists} list(s) found — good for scannable content.`,
        null
      )
    );
  }

  let genericAnchors = 0;
  $('a').each((_, el) => {
    const text = $(el).text().trim().toLowerCase();
    if (['click here', 'read more', 'here', 'learn more', 'link'].includes(text)) {
      genericAnchors += 1;
    }
  });

  if (genericAnchors > 2) {
    checks.push(
      check(
        'warn',
        'content-generic-anchors',
        'Content SEO',
        `${genericAnchors} links use generic anchor text ("click here", "read more").`,
        'Use descriptive anchor text that includes relevant keywords for internal links.'
      )
    );
  } else {
    checks.push(
      check(
        'pass',
        'content-anchor-text',
        'Content SEO',
        'Internal link anchor text is descriptive.',
        null
      )
    );
  }

  const first100Words = bodyText.split(/\s+/).slice(0, 100).join(' ').toLowerCase();
  const hasEarlyKeyword = titleKeywords.some((kw) => first100Words.includes(kw));
  if (titleKeywords.length > 0 && !hasEarlyKeyword) {
    checks.push(
      check(
        'warn',
        'content-keyword-above-fold',
        'Content SEO',
        'Target keywords from the title are not in the first 100 words.',
        'Place primary keywords naturally in the introduction — search engines weight early content.'
      )
    );
  } else if (hasEarlyKeyword) {
    checks.push(
      check(
        'pass',
        'content-keyword-above-fold',
        'Content SEO',
        'Primary keywords appear in the opening content.',
        null
      )
    );
  }

  return checks;
}

module.exports = { checkContent };
