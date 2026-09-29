const { check } = require('./helpers');

function checkHeadings($) {
  const checks = [];
  const headings = [];

  $('h1, h2, h3, h4, h5, h6').each((_, el) => {
    const tag = el.tagName.toLowerCase();
    const level = parseInt(tag[1], 10);
    headings.push({ level, text: $(el).text().trim().slice(0, 80) });
  });

  const h1s = headings.filter((h) => h.level === 1);

  if (h1s.length === 0) {
    checks.push(
      check(
        'fail',
        'headings-h1-missing',
        'On-Page SEO',
        'No H1 heading found.',
        'Add exactly one H1 that clearly describes the main topic of the page.'
      )
    );
  } else if (h1s.length > 1) {
    checks.push(
      check(
        'warn',
        'headings-h1-multiple',
        'On-Page SEO',
        `Multiple H1 headings found (${h1s.length}).`,
        'Use a single H1 per page; use H2–H6 for subsections.'
      )
    );
  } else {
    checks.push(
      check(
        'pass',
        'headings-h1',
        'On-Page SEO',
        `Single H1 found: "${h1s[0].text || '(empty)'}"`,
        null
      )
    );
  }

  let skippedLevels = false;
  let prevLevel = 0;
  for (const heading of headings) {
    if (prevLevel > 0 && heading.level > prevLevel + 1) {
      skippedLevels = true;
      break;
    }
    prevLevel = heading.level;
  }

  if (skippedLevels) {
    checks.push(
      check(
        'warn',
        'headings-hierarchy',
        'On-Page SEO',
        'Heading hierarchy skips levels (e.g. H2 followed by H4).',
        'Maintain logical heading order without skipping levels for accessibility and SEO.'
      )
    );
  } else if (headings.length > 0) {
    checks.push(
      check('pass', 'headings-hierarchy', 'On-Page SEO', 'Heading hierarchy is logical.', null)
    );
  }

  return checks;
}

module.exports = { checkHeadings };
