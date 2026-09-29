const dns = require('dns').promises;
const { URL } = require('url');

const FETCH_TIMEOUT_MS = 15000;
const MAX_BODY_BYTES = 5 * 1024 * 1024;

function isPrivateIp(ip) {
  if (ip === '::1' || ip === '127.0.0.1' || ip === '0.0.0.0') return true;

  if (ip.includes(':')) {
    const lower = ip.toLowerCase();
    if (lower.startsWith('fc') || lower.startsWith('fd')) return true;
    if (lower.startsWith('fe80')) return true;
    return false;
  }

  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p))) return true;

  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}

async function assertPublicHost(urlString) {
  const parsed = new URL(urlString);
  const hostname = parsed.hostname;

  if (
    hostname === 'localhost' ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal')
  ) {
    throw new Error('URLs pointing to local or internal hosts are not allowed.');
  }

  const addresses = await dns.lookup(hostname, { all: true });
  for (const { address } of addresses) {
    if (isPrivateIp(address)) {
      throw new Error('URLs resolving to private IP addresses are not allowed.');
    }
  }
}

function validateUrl(urlString) {
  let parsed;
  try {
    parsed = new URL(urlString);
  } catch {
    throw new Error('Invalid URL. Use a full http:// or https:// address.');
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Only http:// and https:// URLs are supported.');
  }

  return parsed.href;
}

async function fetchPage(urlString) {
  const url = validateUrl(urlString);
  await assertPublicHost(url);

  const start = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent':
          'LocalSEOAnalyzer/1.0 (+https://localhost; SEO analysis bot)',
        Accept: 'text/html,application/xhtml+xml',
      },
    });

    const contentType = response.headers.get('content-type') || '';
    const buffer = Buffer.from(await response.arrayBuffer());

    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    if (buffer.length > MAX_BODY_BYTES) {
      throw new Error('Response body exceeds the 5MB limit.');
    }

    const html = buffer.toString('utf-8');
    const fetchTimeMs = Date.now() - start;

    return {
      url: response.url || url,
      finalUrl: response.url || url,
      originalUrl: url,
      statusCode: response.status,
      contentType,
      html,
      headers,
      pageSizeKb: Math.round(buffer.length / 1024),
      fetchTimeMs,
      isHtml: contentType.includes('text/html') || html.trim().startsWith('<'),
    };
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out after 15 seconds.');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { fetchPage, validateUrl, assertPublicHost };
