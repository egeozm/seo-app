const { check } = require('./helpers');

function checkMobile($) {
  const checks = [];
  const viewport = $('meta[name="viewport"]').attr('content')?.trim() || '';

  if (!viewport) {
    checks.push(
      check(
        'fail',
        'mobile-viewport-missing',
        'Technical SEO',
        'Viewport meta tag is missing.',
        'Add <meta name="viewport" content="width=device-width, initial-scale=1"> for mobile-friendly rendering.'
      )
    );
  } else if (!viewport.includes('width=device-width')) {
    checks.push(
      check(
        'warn',
        'mobile-viewport-incomplete',
        'Technical SEO',
        `Viewport meta may not be mobile-optimized: ${viewport}`,
        'Use width=device-width in the viewport meta tag.'
      )
    );
  } else {
    checks.push(
      check('pass', 'mobile-viewport', 'Technical SEO', 'Viewport meta tag is properly configured.', null)
    );
  }

  return checks;
}

module.exports = { checkMobile };
