const puppeteer = require('puppeteer');

async function runLighthouse(url) {
  const lighthouse = (await import('lighthouse')).default;
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const { lhr } = await lighthouse(url, {
      port: new URL(browser.wsEndpoint()).port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    });

    const scores = {
      performance: Math.round((lhr.categories.performance?.score ?? 0) * 100),
      accessibility: Math.round((lhr.categories.accessibility?.score ?? 0) * 100),
      bestPractices: Math.round((lhr.categories['best-practices']?.score ?? 0) * 100),
      seo: Math.round((lhr.categories.seo?.score ?? 0) * 100),
    };

    const auditFailures = extractTopFailures(lhr);

    return { scores, auditFailures };
  } finally {
    if (browser) await browser.close();
  }
}

function extractTopFailures(lhr) {
  const categories = ['seo', 'performance', 'accessibility', 'best-practices'];
  const result = {};

  for (const cat of categories) {
    const catData = lhr.categories[cat];
    if (!catData) continue;

    const failed = [];
    for (const ref of catData.auditRefs) {
      const audit = lhr.audits[ref.id];
      if (!audit) continue;
      if (audit.score !== null && audit.score < 1) {
        failed.push({
          id: audit.id,
          title: audit.title,
          description: audit.description,
          score: audit.score,
        });
      }
    }

    failed.sort((a, b) => a.score - b.score);
    result[cat === 'best-practices' ? 'bestPractices' : cat] = failed.slice(0, 3);
  }

  return result;
}

module.exports = { runLighthouse };
