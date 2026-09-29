const cheerio = require('cheerio');
const { fetchPage } = require('./fetchPage');
const { runLighthouse } = require('./lighthouseRunner');
const { buildSuggestions } = require('./suggestions');
const { enrichWithCodeFix } = require('./codeExamples');
const { computePillarScores, groupByPillar, PILLARS } = require('./seoPillars');
const { checkMeta } = require('./checks/meta');
const { checkOnPage } = require('./checks/onPage');
const { checkHeadings } = require('./checks/headings');
const { checkImages } = require('./checks/images');
const { checkLinks } = require('./checks/links');
const { checkSocial } = require('./checks/social');
const { checkStructuredData } = require('./checks/structuredData');
const { checkMobile } = require('./checks/mobile');
const { checkReadability } = require('./checks/readability');
const { checkContent } = require('./checks/content');
const { checkTechnical } = require('./checks/technical');
const { checkOffPage } = require('./checks/offPage');
const { checkLocalSeo } = require('./checks/localSeo');
const { checkRobotsSitemap } = require('./checks/robotsSitemap');

async function analyzeUrl(urlString) {
  const page = await fetchPage(urlString);

  if (!page.isHtml) {
    throw new Error('URL did not return HTML content. Provide a web page URL.');
  }

  const $ = cheerio.load(page.html);
  const pageUrl = page.finalUrl;
  const pageMeta = {
    headers: page.headers,
    originalUrl: page.originalUrl,
    finalUrl: page.finalUrl,
  };

  const checks = [
    ...checkMeta($, pageUrl),
    ...checkOnPage($, pageUrl),
    ...checkHeadings($),
    ...checkImages($),
    ...checkLinks($, pageUrl),
    ...checkSocial($),
    ...checkStructuredData($),
    ...checkMobile($),
    ...checkContent($),
    ...checkReadability($),
    ...checkTechnical($, pageUrl, pageMeta),
    ...checkOffPage($, pageUrl),
    ...checkLocalSeo($),
    ...(await checkRobotsSitemap(pageUrl)),
  ];

  let scores = { seo: null, performance: null, accessibility: null, bestPractices: null };
  let auditFailures = {};

  try {
    const lighthouseResult = await runLighthouse(pageUrl);
    scores = lighthouseResult.scores;
    auditFailures = lighthouseResult.auditFailures;
  } catch (err) {
    checks.push({
      id: 'lighthouse-error',
      pillar: 'Technical SEO',
      category: 'Technical SEO',
      status: 'warn',
      message: `Lighthouse audit could not complete: ${err.message}`,
      suggestion: 'Ensure Chrome/Chromium is available. Rule-based checks above are still valid.',
    });
  }

  const context = { pageUrl };
  const suggestions = buildSuggestions(checks, auditFailures, context);

  const enrichedChecks = checks.map((c) => enrichWithCodeFix(c, context));

  const pillarScores = computePillarScores(checks);
  const pillars = groupByPillar(enrichedChecks);

  const summary = {
    pass: checks.filter((c) => c.status === 'pass').length,
    warn: checks.filter((c) => c.status === 'warn').length,
    fail: checks.filter((c) => c.status === 'fail').length,
  };

  return {
    url: pageUrl,
    scores,
    pillarScores,
    pillars: PILLARS,
    checks: enrichedChecks,
    suggestions,
    summary,
    meta: {
      fetchTimeMs: page.fetchTimeMs,
      pageSizeKb: page.pageSizeKb,
      statusCode: page.statusCode,
    },
  };
}

module.exports = { analyzeUrl };
