const { check } = require('./helpers');

function checkSocial($) {
  const checks = [];

  const ogTitle = $('meta[property="og:title"]').attr('content');
  const ogDescription = $('meta[property="og:description"]').attr('content');
  const ogImage = $('meta[property="og:image"]').attr('content');
  const twitterCard = $('meta[name="twitter:card"]').attr('content');

  if (!ogTitle) {
    checks.push(
      check(
        'warn',
        'social-og-title',
        'Off-Page SEO',
        'Open Graph title (og:title) is missing.',
        'Add og:title for better previews when shared on social platforms.'
      )
    );
  } else {
    checks.push(check('pass', 'social-og-title', 'Off-Page SEO', 'Open Graph title is set.', null));
  }

  if (!ogDescription) {
    checks.push(
      check(
        'warn',
        'social-og-description',
        'Off-Page SEO',
        'Open Graph description (og:description) is missing.',
        'Add og:description to control social share snippets.'
      )
    );
  } else {
    checks.push(
      check('pass', 'social-og-description', 'Off-Page SEO', 'Open Graph description is set.', null)
    );
  }

  if (!ogImage) {
    checks.push(
      check(
        'warn',
        'social-og-image',
        'Off-Page SEO',
        'Open Graph image (og:image) is missing.',
        'Add og:image (1200×630 recommended) for rich social previews.'
      )
    );
  } else {
    checks.push(check('pass', 'social-og-image', 'Off-Page SEO', 'Open Graph image is set.', null));
  }

  if (!twitterCard) {
    checks.push(
      check(
        'warn',
        'social-twitter-card',
        'Off-Page SEO',
        'Twitter card meta tag is missing.',
        'Add twitter:card (e.g. summary_large_image) for Twitter/X previews.'
      )
    );
  } else {
    checks.push(
      check('pass', 'social-twitter-card', 'Off-Page SEO', `Twitter card is set: ${twitterCard}`, null)
    );
  }

  return checks;
}

module.exports = { checkSocial };
