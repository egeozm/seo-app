const { check } = require('./helpers');

function checkImages($) {
  const checks = [];
  const images = $('img');
  let missingAlt = 0;
  let emptyAlt = 0;
  let missingDimensions = 0;

  images.each((_, el) => {
    const alt = $(el).attr('alt');
    const width = $(el).attr('width');
    const height = $(el).attr('height');

    if (alt === undefined) missingAlt += 1;
    else if (alt.trim() === '') emptyAlt += 1;

    if (!width || !height) missingDimensions += 1;
  });

  const total = images.length;

  if (total === 0) {
    checks.push(
      check('pass', 'images-none', 'On-Page SEO', 'No images found on the page.', null)
    );
    return checks;
  }

  if (missingAlt > 0) {
    checks.push(
      check(
        'fail',
        'images-alt-missing',
        'On-Page SEO',
        `${missingAlt} of ${total} images missing alt attribute.`,
        'Add descriptive alt text to all meaningful images for accessibility and image SEO.'
      )
    );
  } else {
    checks.push(
      check('pass', 'images-alt', 'On-Page SEO', 'All images have an alt attribute.', null)
    );
  }

  if (emptyAlt > 0) {
    checks.push(
      check(
        'warn',
        'images-alt-empty',
        'On-Page SEO',
        `${emptyAlt} images have empty alt text.`,
        'Use alt="" only for decorative images; add descriptive alt for content images.'
      )
    );
  }

  if (missingDimensions > 0) {
    checks.push(
      check(
        'warn',
        'images-dimensions',
        'On-Page SEO',
        `${missingDimensions} images lack width/height attributes.`,
        'Set width and height on images to reduce layout shift and improve Core Web Vitals.'
      )
    );
  } else {
    checks.push(
      check('pass', 'images-dimensions', 'On-Page SEO', 'All images have width and height.', null)
    );
  }

  return checks;
}

module.exports = { checkImages };
