const PILLARS = [
  'On-Page SEO',
  'Technical SEO',
  'Content SEO',
  'Off-Page SEO',
  'Local SEO',
];

function computePillarScores(checks) {
  const scores = {};

  for (const pillar of PILLARS) {
    const pillarChecks = checks.filter(
      (c) => c.pillar === pillar && c.id !== 'lighthouse-error'
    );
    if (!pillarChecks.length) {
      scores[pillar] = null;
      continue;
    }

    let points = 0;
    for (const c of pillarChecks) {
      if (c.status === 'pass') points += 100;
      else if (c.status === 'warn') points += 55;
      else points += 0;
    }

    scores[pillar] = Math.round(points / pillarChecks.length);
  }

  return scores;
}

function groupByPillar(checks) {
  const grouped = {};
  for (const pillar of PILLARS) {
    grouped[pillar] = checks.filter((c) => c.pillar === pillar);
  }
  return grouped;
}

module.exports = { PILLARS, computePillarScores, groupByPillar };
