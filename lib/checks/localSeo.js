const { check } = require('./helpers');

function checkLocalSeo($) {
  const checks = [];

  const jsonLdScripts = $('script[type="application/ld+json"]');
  let hasLocalBusiness = false;
  let localTypes = [];

  jsonLdScripts.each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || '{}');
      const str = JSON.stringify(data);
      if (str.includes('LocalBusiness') || str.includes('Store') || str.includes('Restaurant')) {
        hasLocalBusiness = true;
        localTypes.push('LocalBusiness');
      }
      if (str.includes('PostalAddress') || str.includes('GeoCoordinates')) {
        localTypes.push('Address/Geo');
      }
    } catch {
      /* skip */
    }
  });

  const bodyText = $('body').text();
  const phonePattern = /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/;
  const hasPhone = phonePattern.test(bodyText);
  const hasAddress =
    /(\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|way|court|ct))/i.test(
      bodyText
    );

  if (hasLocalBusiness) {
    checks.push(
      check(
        'pass',
        'local-schema',
        'Local SEO',
        `Local business schema detected (${[...new Set(localTypes)].join(', ')}).`,
        null
      )
    );
  } else if (hasPhone || hasAddress) {
    checks.push(
      check(
        'warn',
        'local-schema-missing',
        'Local SEO',
        'NAP (Name, Address, Phone) content found but no LocalBusiness JSON-LD schema.',
        'Add LocalBusiness schema with matching NAP for local pack eligibility.'
      )
    );
  } else {
    checks.push(
      check(
        'pass',
        'local-not-applicable',
        'Local SEO',
        'No local business signals detected — Local SEO checks may not apply to this page.',
        null
      )
    );
  }

  const geoRegion = $('meta[name="geo.region"]').attr('content');
  const geoPlace = $('meta[name="geo.placename"]').attr('content');
  if ((hasPhone || hasAddress) && !geoRegion && !geoPlace) {
    checks.push(
      check(
        'warn',
        'local-geo-meta',
        'Local SEO',
        'Local content without geo.region or geo.placename meta tags.',
        'Add geo meta tags or rely on LocalBusiness schema with address fields.'
      )
    );
  } else if (geoRegion || geoPlace) {
    checks.push(
      check(
        'pass',
        'local-geo-meta',
        'Local SEO',
        `Geo meta: ${geoRegion || ''} ${geoPlace || ''}`.trim(),
        null
      )
    );
  }

  if (hasPhone && hasAddress && !hasLocalBusiness) {
    checks.push(
      check(
        'warn',
        'local-nap-consistency',
        'Local SEO',
        'Ensure NAP in footer matches Google Business Profile exactly (name, address, phone).',
        'Use identical NAP everywhere — mismatches hurt local rankings.'
      )
    );
  }

  return checks;
}

module.exports = { checkLocalSeo };
