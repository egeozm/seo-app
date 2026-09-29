const form = document.getElementById('analyze-form');
const urlInput = document.getElementById('url-input');
const analyzeBtn = document.getElementById('analyze-btn');
const loading = document.getElementById('loading');
const errorEl = document.getElementById('error');
const emptyState = document.getElementById('empty-state');
const results = document.getElementById('results');
const reportUrl = document.getElementById('report-url');
const metaBar = document.getElementById('meta-bar');
const scoresEl = document.getElementById('scores');
const pillarScoresEl = document.getElementById('pillar-scores');
const summaryEl = document.getElementById('summary');
const overviewEl = document.getElementById('overview-content');
const suggestionsEl = document.getElementById('suggestions');
const checksEl = document.getElementById('checks');
const fixFiltersEl = document.getElementById('fix-filters');
const auditFiltersEl = document.getElementById('audit-filters');
const tabsEl = document.getElementById('tabs');

const PILLAR_ORDER = [
  'On-Page SEO',
  'Technical SEO',
  'Content SEO',
  'Off-Page SEO',
  'Local SEO',
];

let reportData = null;
let activeFixFilter = 'all';
let activeAuditFilter = 'issues';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = urlInput.value.trim();
  if (!url) return;

  setLoading(true);
  hideError();
  results.classList.add('hidden');

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Analysis failed.');

    reportData = data;
    renderResults(data);
    results.classList.remove('hidden');
    emptyState.classList.add('hidden');
  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
});

tabsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.tab');
  if (!btn) return;
  switchTab(btn.dataset.tab);
});

fixFiltersEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn || !reportData) return;
  activeFixFilter = btn.dataset.filter;
  fixFiltersEl.querySelectorAll('.filter-btn').forEach((b) => b.classList.toggle('active', b === btn));
  renderSuggestions(reportData.suggestions);
});

auditFiltersEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn || !reportData) return;
  activeAuditFilter = btn.dataset.filter;
  auditFiltersEl.querySelectorAll('.filter-btn').forEach((b) => b.classList.toggle('active', b === btn));
  renderChecks(reportData.checks);
});

overviewEl.addEventListener('click', (e) => {
  const item = e.target.closest('[data-goto-fix]');
  if (!item) return;
  switchTab('fixes');
  const card = document.getElementById(`fix-${item.dataset.gotoFix}`);
  if (card) {
    card.open = true;
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

function switchTab(name) {
  tabsEl.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === name));
  document.querySelectorAll('.tab-panel').forEach((p) => {
    p.classList.toggle('active', p.id === `panel-${name}`);
  });
}

function setLoading(isLoading) {
  loading.classList.toggle('hidden', !isLoading);
  analyzeBtn.disabled = isLoading;
  urlInput.disabled = isLoading;
}

function showError(message) {
  errorEl.textContent = message;
  errorEl.classList.remove('hidden');
}

function hideError() {
  errorEl.classList.add('hidden');
}

function renderResults(data) {
  renderReportHeader(data);
  renderScores(data.scores);
  renderPillarScores(data.pillarScores);
  renderSummary(data.summary);
  renderOverview(data);
  renderFixFilters(data.suggestions);
  renderSuggestions(data.suggestions);
  renderAuditFilters();
  renderChecks(data.checks);
  switchTab('overview');
  activeFixFilter = 'all';
  activeAuditFilter = 'issues';
}

function renderReportHeader(data) {
  reportUrl.innerHTML = `<strong>${escapeHtml(data.url)}</strong>`;
  metaBar.innerHTML = `
    <span>HTTP ${data.meta.statusCode}</span>
    <span>${data.meta.pageSizeKb} KB</span>
    <span>${data.meta.fetchTimeMs} ms fetch</span>
  `;
}

function scoreClass(value) {
  if (value === null || value === undefined) return 'score-na';
  if (value >= 90) return 'score-good';
  if (value >= 50) return 'score-ok';
  return 'score-bad';
}

function renderScores(scores) {
  const labels = {
    seo: 'SEO',
    performance: 'Perf',
    accessibility: 'A11y',
    bestPractices: 'Best',
  };

  scoresEl.innerHTML = Object.entries(labels)
    .map(([key, label]) => {
      const value = scores[key];
      const display = value !== null && value !== undefined ? value : '—';
      return `
        <div class="score-card">
          <span class="label">${label}</span>
          <span class="value ${scoreClass(value)}">${display}</span>
        </div>
      `;
    })
    .join('');
}

function renderPillarScores(pillarScores) {
  if (!pillarScores) {
    pillarScoresEl.innerHTML = '';
    return;
  }

  pillarScoresEl.innerHTML = PILLAR_ORDER.map((pillar) => {
    const value = pillarScores[pillar];
    const display = value !== null && value !== undefined ? value : '—';
    const cls = scoreClass(value);
    return `
      <div class="pillar-row">
        <span class="pillar-row-name">${escapeHtml(pillar)}</span>
        <span class="pillar-row-score ${cls}">${display}</span>
        <div class="pillar-row-bar">
          <div class="pillar-row-fill ${cls}" style="width:${value ?? 0}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

function renderSummary(summary) {
  summaryEl.innerHTML = `
    <span class="chip pass"><span class="chip-dot"></span>${summary.pass} passed</span>
    <span class="chip warn"><span class="chip-dot"></span>${summary.warn} warnings</span>
    <span class="chip fail"><span class="chip-dot"></span>${summary.fail} failed</span>
  `;
}

function renderOverview(data) {
  const topFixes = data.suggestions.slice(0, 6);
  const pillarRows = PILLAR_ORDER.map((pillar) => {
    const score = data.pillarScores?.[pillar] ?? '—';
    const checks = data.checks.filter((c) => (c.pillar || c.category) === pillar);
    const issues = checks.filter((c) => c.status !== 'pass').length;
    return `<tr>
      <td>${escapeHtml(pillar)}</td>
      <td class="${scoreClass(typeof score === 'number' ? score : null)}">${score}</td>
      <td>${issues} issue${issues === 1 ? '' : 's'}</td>
    </tr>`;
  }).join('');

  const priorityHtml = topFixes.length
    ? `<ul class="priority-list">${topFixes
        .map(
          (s) => `
        <li class="priority-item" data-goto-fix="${escapeHtml(s.id)}" role="button" tabindex="0">
          <span class="badge badge-${s.impact}">${s.impact}</span>
          <div class="priority-item-text">
            <p class="priority-item-title">${escapeHtml(s.title)}</p>
            <span class="priority-item-pillar">${escapeHtml(s.pillar || s.category || '')}</span>
          </div>
        </li>`
        )
        .join('')}</ul>`
    : '<p class="empty-state">No issues found — excellent SEO health.</p>';

  overviewEl.innerHTML = `
    <div class="overview-grid">
      <div class="overview-card">
        <h3>Top priorities — click to jump to fix</h3>
        ${priorityHtml}
      </div>
      <div class="overview-card">
        <h3>Pillar breakdown</h3>
        <table class="pillar-table">
          <thead><tr><th>Pillar</th><th>Score</th><th>Issues</th></tr></thead>
          <tbody>${pillarRows}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderFixFilters(suggestions) {
  const pillars = ['all', ...new Set(suggestions.map((s) => s.pillar || s.category).filter(Boolean))];
  fixFiltersEl.innerHTML = pillars
    .map((p) => {
      const label = p === 'all' ? 'All' : p;
      const count = p === 'all' ? suggestions.length : suggestions.filter((s) => (s.pillar || s.category) === p).length;
      return `<button type="button" class="filter-btn${p === 'all' ? ' active' : ''}" data-filter="${escapeHtml(p)}">${escapeHtml(label)} (${count})</button>`;
    })
    .join('');
}

function renderAuditFilters() {
  auditFiltersEl.innerHTML = `
    <button type="button" class="filter-btn active" data-filter="issues">Issues only</button>
    <button type="button" class="filter-btn" data-filter="all">All checks</button>
  `;
}

function renderCodeBlock(label, code, extraClass = '') {
  if (!code) return '';
  return `
    <div class="code-block-wrap ${extraClass}">
      <div class="code-block-header">
        <span>${escapeHtml(label)}</span>
        <button type="button" class="copy-btn">Copy</button>
      </div>
      <pre class="code-block"><code>${escapeHtml(code)}</code></pre>
    </div>
  `;
}

function renderIssueBody(item, idPrefix = 'fix') {
  const meta =
    item.current !== undefined && item.recommended
      ? `<div class="suggestion-meta">Current: ${item.current} · Recommended: ${item.recommended}</div>`
      : '';

  return `
    <p class="issue-action">${escapeHtml(item.suggestion || item.message)}</p>
    ${item.explanation ? `<p class="suggestion-explanation"><strong>Why:</strong> ${escapeHtml(item.explanation)}</p>` : ''}
    ${renderCodeBlock('Current on page', item.currentCode, 'code-current')}
    ${renderCodeBlock('Recommended fix', item.codeExample, 'code-fix')}
    ${meta}
  `;
}

function renderSuggestions(suggestions) {
  let filtered = suggestions;
  if (activeFixFilter !== 'all') {
    filtered = suggestions.filter((s) => (s.pillar || s.category) === activeFixFilter);
  }

  if (!filtered.length) {
    suggestionsEl.innerHTML = '<p class="empty-state">No fixes in this category.</p>';
    return;
  }

  suggestionsEl.innerHTML = filtered
    .map(
      (s) => `
        <details class="issue-card" id="fix-${escapeHtml(s.id)}">
          <summary>
            <span class="badge badge-${s.impact}">${s.impact}</span>
            <span class="issue-title">${escapeHtml(s.title)}</span>
            ${s.codeExample ? '<span class="has-code-tag">code fix</span>' : ''}
          </summary>
          <div class="issue-body">${renderIssueBody({ ...s, message: s.suggestion })}</div>
        </details>
      `
    )
    .join('');

  bindCopyButtons(suggestionsEl);
}

function renderChecks(checks) {
  let filtered = checks;
  if (activeAuditFilter === 'issues') {
    filtered = checks.filter((c) => c.status !== 'pass');
  }

  const grouped = {};
  for (const check of filtered) {
    const pillar = check.pillar || check.category || 'Other';
    if (!grouped[pillar]) grouped[pillar] = [];
    grouped[pillar].push(check);
  }

  const ordered = [
    ...PILLAR_ORDER.filter((p) => grouped[p]?.length),
    ...Object.keys(grouped).filter((p) => !PILLAR_ORDER.includes(p)),
  ];

  if (!ordered.length) {
    checksEl.innerHTML = '<p class="empty-state">No issues — all checks passed.</p>';
    return;
  }

  checksEl.innerHTML = ordered
    .map((pillar) => {
      const items = grouped[pillar];
      const rows = items
        .map((c) => {
          if (c.status === 'pass') {
            return `
              <div class="check-row check-row-pass">
                <span class="check-icon pass"></span>
                <span class="check-msg">
                  <span class="check-msg-main">${escapeHtml(c.message)}</span>
                </span>
                <span class="check-pillar-tag">pass</span>
              </div>`;
          }

          const impact = c.status === 'fail' ? 'high' : 'medium';
          return `
            <details class="audit-issue" id="audit-${escapeHtml(c.id)}">
              <summary class="check-row">
                <span class="check-icon ${c.status}"></span>
                <span class="check-msg">
                  <span class="check-msg-main">${escapeHtml(c.message)}</span>
                  ${c.suggestion ? `<span class="check-msg-sub">${escapeHtml(c.suggestion)}</span>` : ''}
                </span>
                <span class="badge badge-${impact}">${c.status}</span>
              </summary>
              <div class="issue-body audit-issue-body">${renderIssueBody(c)}</div>
            </details>`;
        })
        .join('');

      const failCount = items.filter((i) => i.status === 'fail').length;
      const warnCount = items.filter((i) => i.status === 'warn').length;

      return `
        <details class="audit-group" ${failCount || warnCount ? 'open' : ''}>
          <summary>${escapeHtml(pillar)} · ${items.length} check${items.length === 1 ? '' : 's'}</summary>
          <div class="audit-group-body">${rows}</div>
        </details>
      `;
    })
    .join('');

  bindCopyButtons(checksEl);
}

function bindCopyButtons(root) {
  root.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const code = btn.closest('.code-block-wrap')?.querySelector('code')?.textContent;
      if (!code) return;
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
      });
    });
  });
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}
