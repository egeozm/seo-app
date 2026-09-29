const { check } = require('./helpers');

async function fetchText(url, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'LocalSEOAnalyzer/1.0' },
    });
    const text = await response.text();
    return { ok: response.ok, status: response.status, text, url };
  } catch (err) {
    return { ok: false, status: 0, text: '', url, error: err.message };
  } finally {
    clearTimeout(timeout);
  }
}

function parseSitemapUrls(robotsText) {
  const lines = robotsText.split('\n');
  const sitemaps = [];

  for (const line of lines) {
    const match = line.match(/^\s*Sitemap:\s*(.+)\s*$/i);
    if (match) sitemaps.push(match[1].trim());
  }

  return sitemaps;
}

async function checkRobotsSitemap(pageUrl) {
  const checks = [];
  const origin = new URL(pageUrl).origin;
  const robotsUrl = `${origin}/robots.txt`;

  const robots = await fetchText(robotsUrl);

  if (!robots.ok) {
    checks.push(
      check(
        'warn',
        'robots-missing',
        'Technical SEO',
        `robots.txt not reachable (${robots.status || 'error'}).`,
        'Add a robots.txt file at your site root to guide search engine crawlers.'
      )
    );
  } else {
    checks.push(
      check('pass', 'robots-found', 'Technical SEO', 'robots.txt is reachable.', null)
    );

    const sitemaps = parseSitemapUrls(robots.text);
    if (sitemaps.length === 0) {
      checks.push(
        check(
          'warn',
          'sitemap-not-in-robots',
          'Technical SEO',
          'No Sitemap directive found in robots.txt.',
          'Add "Sitemap: https://example.com/sitemap.xml" to robots.txt.'
        )
      );
    } else {
      checks.push(
        check(
          'pass',
          'sitemap-in-robots',
          'Technical SEO',
          `Sitemap referenced in robots.txt: ${sitemaps[0]}`,
          null
        )
      );

      const sitemapResult = await fetchText(sitemaps[0]);
      if (!sitemapResult.ok) {
        checks.push(
          check(
            'warn',
            'sitemap-unreachable',
            'Technical SEO',
            `Referenced sitemap is not reachable (${sitemapResult.status || 'error'}).`,
            'Ensure your sitemap URL returns a valid XML sitemap.'
          )
        );
      } else if (
        sitemapResult.text.includes('<urlset') ||
        sitemapResult.text.includes('<sitemapindex')
      ) {
        checks.push(
          check('pass', 'sitemap-valid', 'Technical SEO', 'Sitemap XML is reachable and valid.', null)
        );
      } else {
        checks.push(
          check(
            'warn',
            'sitemap-invalid',
            'Technical SEO',
            'Sitemap URL does not appear to contain valid sitemap XML.',
            'Verify your sitemap follows the sitemap.org XML format.'
          )
        );
      }
    }
  }

  if (!robots.ok) {
    const defaultSitemap = `${origin}/sitemap.xml`;
    const sitemapResult = await fetchText(defaultSitemap);
    if (sitemapResult.ok && sitemapResult.text.includes('<urlset')) {
      checks.push(
        check(
          'pass',
          'sitemap-default',
          'Technical SEO',
          'Default /sitemap.xml is reachable.',
          null
        )
      );
    }
  }

  return checks;
}

module.exports = { checkRobotsSitemap };
