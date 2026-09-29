const EXAMPLES = {
  'meta-title-missing': {
    explanation:
      'The title tag is the primary headline shown in search results. Without it, search engines guess the page topic and click-through rates drop.',
    codeExample: `<head>
  <title>Your Primary Keyword — Brand Name</title>
</head>`,
  },
  'meta-title-short': {
    explanation:
      'Short titles under 30 characters miss room for keywords and context. Search engines may also rewrite them with text from the page body.',
    codeExample: `<head>
  <!-- Aim for 30–60 characters -->
  <title>Complete Guide to On-Page SEO for Small Business Websites</title>
</head>`,
  },
  'meta-title-long': {
    explanation:
      'Titles over ~60 characters get truncated in Google results with an ellipsis, hiding important words from searchers.',
    codeExample: `<head>
  <!-- Keep the most important keywords in the first 60 chars -->
  <title>On-Page SEO Guide — Tips, Checklist & Best Practices</title>
</head>`,
  },
  'meta-description-missing': {
    explanation:
      'The meta description often appears as the snippet below your title in search results. A compelling description improves click-through rate even though it is not a direct ranking factor.',
    codeExample: `<head>
  <meta name="description" content="Learn how to optimize title tags, headings, and meta descriptions to improve search visibility and attract more organic traffic.">
</head>`,
  },
  'meta-description-short': {
    explanation:
      'Descriptions under 120 characters provide less context in SERPs. Use the available space to summarize value and include a call to action.',
    codeExample: `<head>
  <meta name="description" content="Discover proven on-page SEO techniques including title optimization, heading structure, image alt text, and structured data to rank higher in Google.">
</head>`,
  },
  'meta-description-long': {
    explanation:
      'Google typically truncates descriptions around 155–160 characters. Put the key message at the beginning.',
    codeExample: `<head>
  <meta name="description" content="Improve your rankings with our step-by-step SEO checklist covering meta tags, content quality, and technical fixes.">
</head>`,
  },
  'meta-canonical-missing': {
    explanation:
      'A canonical URL tells search engines which version of a page is the authoritative one, preventing duplicate-content issues from query strings, www vs non-www, or similar URLs.',
    codeExample: `<head>
  <link rel="canonical" href="{{pageUrl}}">
</head>`,
  },
  'meta-robots-noindex': {
    explanation:
      'The noindex directive tells search engines not to include this page in their index. Remove it on pages you want to rank.',
    codeExample: `<head>
  <!-- Remove noindex, or use index,follow explicitly -->
  <meta name="robots" content="index, follow">
</head>`,
  },
  'meta-lang-missing': {
    explanation:
      'The lang attribute helps search engines and assistive technologies identify the page language, improving accessibility and international SEO.',
    codeExample: `<html lang="en">
  <head>...</head>
  <body>...</body>
</html>`,
  },
  'meta-https': {
    explanation:
      'HTTPS encrypts traffic and is a confirmed lightweight ranking signal. Browsers also mark HTTP sites as "Not secure".',
    codeExample: `# Redirect HTTP to HTTPS (nginx example)
server {
  listen 80;
  server_name example.com;
  return 301 https://$host$request_uri;
}`,
  },
  'meta-charset-missing': {
    explanation:
      'Declaring UTF-8 encoding prevents garbled characters and ensures search engines parse your content correctly.',
    codeExample: `<head>
  <meta charset="utf-8">
  ...
</head>`,
  },
  'meta-favicon-missing': {
    explanation:
      'Favicons appear in browser tabs, bookmarks, and sometimes search results. They reinforce brand recognition.',
    codeExample: `<head>
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
</head>`,
  },
  'headings-h1-missing': {
    explanation:
      'The H1 is the main topic signal for both users and crawlers. Every indexable page should have exactly one clear H1.',
    codeExample: `<body>
  <main>
    <h1>Complete Guide to On-Page SEO</h1>
    <p>Your introductory content here...</p>
  </main>
</body>`,
  },
  'headings-h1-multiple': {
    explanation:
      'Multiple H1 tags dilute the main topic signal. Use one H1 for the page topic and H2–H6 for sections.',
    codeExample: `<body>
  <h1>Main Page Title</h1>
  <section>
    <h2>First Section</h2>
    <h3>Subsection</h3>
  </section>
  <section>
    <h2>Second Section</h2>
  </section>
</body>`,
  },
  'headings-hierarchy': {
    explanation:
      'Skipping heading levels (e.g. H2 → H4) confuses screen readers and weakens document structure for SEO.',
    codeExample: `<!-- Bad: H2 then H4 -->
<h2>Section</h2>
<h4>Subsection</h4>

<!-- Good: sequential levels -->
<h2>Section</h2>
<h3>Subsection</h3>`,
  },
  'images-alt-missing': {
    explanation:
      'Alt text describes images for screen readers and helps search engines understand image content for image search.',
    codeExample: `<img src="/team-photo.jpg"
     alt="Marketing team collaborating in the office"
     width="800"
     height="600">`,
  },
  'images-alt-empty': {
    explanation:
      'Empty alt="" is correct only for purely decorative images. Content images need descriptive alt text.',
    codeExample: `<!-- Decorative (OK) -->
<img src="/divider.svg" alt="" role="presentation">

<!-- Content image (needs description) -->
<img src="/product.jpg" alt="Wireless headphones in matte black">`,
  },
  'images-dimensions': {
    explanation:
      'Explicit width and height (or CSS aspect-ratio) reserve space before images load, reducing Cumulative Layout Shift (CLS).',
    codeExample: `<img src="/hero.jpg"
     alt="Hero banner"
     width="1200"
     height="630"
     loading="lazy">`,
  },
  'links-none': {
    explanation:
      'Internal links distribute PageRank and help crawlers discover related pages. Orphan pages are harder to index.',
    codeExample: `<nav>
  <a href="/">Home</a>
  <a href="/blog">Blog</a>
  <a href="/contact">Contact</a>
</nav>

<article>
  <p>Read our <a href="/blog/seo-guide">SEO guide</a> for more tips.</p>
</article>`,
  },
  'links-empty-href': {
    explanation:
      'Links with empty or "#" href values create dead ends for users and waste crawl budget on meaningless anchors.',
    codeExample: `<!-- Bad -->
<a href="#">Learn more</a>
<a href="">Click here</a>

<!-- Good -->
<a href="/pricing">Learn more about pricing</a>`,
  },
  'social-og-title': {
    explanation:
      'Open Graph tags control how your page appears when shared on Facebook, LinkedIn, Slack, and other platforms.',
    codeExample: `<head>
  <meta property="og:title" content="Complete Guide to On-Page SEO">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{{pageUrl}}">
</head>`,
  },
  'social-og-description': {
    explanation:
      'og:description is the preview text shown in social shares. Keep it concise and compelling.',
    codeExample: `<head>
  <meta property="og:description" content="Actionable SEO tips to improve rankings, traffic, and click-through rates.">
</head>`,
  },
  'social-og-image': {
    explanation:
      'og:image is the preview thumbnail for social shares. Use 1200×630 px for best results across platforms.',
    codeExample: `<head>
  <meta property="og:image" content="https://example.com/images/og-preview.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
</head>`,
  },
  'social-twitter-card': {
    explanation:
      'Twitter/X card tags define how links appear in tweets. summary_large_image shows a big preview image.',
    codeExample: `<head>
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Complete Guide to On-Page SEO">
  <meta name="twitter:description" content="Actionable SEO tips for better rankings.">
  <meta name="twitter:image" content="https://example.com/images/og-preview.jpg">
</head>`,
  },
  'structured-data-missing': {
    explanation:
      'JSON-LD structured data helps search engines understand your content and can enable rich results (FAQ, breadcrumbs, etc.).',
    codeExample: `<head>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Complete Guide to On-Page SEO",
    "description": "Learn how to optimize your pages for search engines.",
    "url": "{{pageUrl}}"
  }
  </script>
</head>`,
  },
  'structured-data-invalid': {
    explanation:
      'Invalid JSON-LD is ignored by Google. Validate syntax and required properties with Google\'s Rich Results Test.',
    codeExample: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png"
}
</script>`,
  },
  'structured-data-types': {
    explanation:
      'Common schema types like WebPage, Organization, and Article are well supported and help search engines categorize your content.',
    codeExample: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Improve On-Page SEO",
  "author": { "@type": "Person", "name": "Jane Doe" },
  "datePublished": "2026-01-15"
}
</script>`,
  },
  'mobile-viewport-missing': {
    explanation:
      'Without a viewport meta tag, mobile browsers render the page at desktop width and scale it down, hurting usability and mobile rankings.',
    codeExample: `<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>`,
  },
  'mobile-viewport-incomplete': {
    explanation:
      'width=device-width ensures the layout adapts to the device screen. Avoid disabling user zoom (user-scalable=no) for accessibility.',
    codeExample: `<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>`,
  },
  'content-thin': {
    explanation:
      'Pages with very little unique content struggle to rank for competitive queries. Aim for comprehensive, helpful content.',
    codeExample: `<article>
  <h1>Topic Title</h1>
  <p>Introduction explaining what the reader will learn...</p>
  <h2>Section 1: Key Concept</h2>
  <p>Detailed explanation with examples...</p>
  <h2>Section 2: Step-by-Step Guide</h2>
  <ol>
    <li>First step with context</li>
    <li>Second step with tips</li>
  </ol>
  <h2>Conclusion</h2>
  <p>Summary and next steps...</p>
</article>`,
  },
  'content-readability-hard': {
    explanation:
      'Hard-to-read content increases bounce rate. Shorter sentences, simpler words, and clear structure keep users engaged.',
    codeExample: `<!-- Before: long, dense paragraph -->
<p>The implementation of search engine optimization strategies...</p>

<!-- After: scannable structure -->
<h2>What is on-page SEO?</h2>
<p>On-page SEO means optimizing content and HTML on your site.</p>
<ul>
  <li>Write clear titles and descriptions</li>
  <li>Use proper heading hierarchy</li>
  <li>Add descriptive alt text to images</li>
</ul>`,
  },
  'robots-missing': {
    explanation:
      'robots.txt tells crawlers which paths they may request. It also commonly points to your sitemap.',
    codeExample: `# robots.txt at https://example.com/robots.txt
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml`,
  },
  'sitemap-not-in-robots': {
    explanation:
      'Declaring your sitemap in robots.txt helps search engines discover all important URLs quickly.',
    codeExample: `# Add to robots.txt
Sitemap: https://example.com/sitemap.xml`,
  },
  'sitemap-unreachable': {
    explanation:
      'A broken sitemap URL means crawlers may miss pages. Ensure the URL returns valid XML with a 200 status.',
    codeExample: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-06-01</lastmod>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <lastmod>2026-06-01</lastmod>
  </url>
</urlset>`,
  },
  'sitemap-invalid': {
    explanation:
      'Sitemaps must follow the sitemaps.org XML schema. Invalid XML is ignored by search engines.',
    codeExample: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://example.com/page</loc></url>
</urlset>`,
  },
  'onpage-url-long': {
    explanation: 'Long URLs are harder to share and may be truncated. Shorter slugs improve CTR in SERPs.',
    codeExample: `<!-- Prefer -->\n/blog/on-page-seo-guide\n\n<!-- Over -->\n/blog/2026/06/29/complete-guide-to-on-page-seo-optimization-tips`,
  },
  'onpage-url-slug-long': {
    explanation: 'URL slug segments over ~50 characters are hard to read and share.',
    codeExample: `<!-- Shorten slug to primary keywords -->\n/blog/on-page-seo-guide\n\n<!-- Instead of -->\n/blog/complete-guide-to-on-page-seo-optimization-for-beginners`,
  },
  'onpage-url-uppercase': {
    explanation: 'URLs are case-sensitive on many servers — mixed case creates duplicate URLs.',
    codeExample:
      '# nginx: force lowercase\nrewrite ^(.*)$ $scheme://$host${lowercase:$1} permanent;',
  },
  'onpage-url-params': {
    explanation: 'Query strings create duplicate URLs for the same content unless canonicalized.',
    codeExample: `<link rel="canonical" href="{{pageUrl}}">`,
  },
  'onpage-title-h1-mismatch': {
    explanation: 'Title and H1 should target the same topic so Google understands page intent.',
    codeExample: `<head>\n  <title>On-Page SEO Guide — Complete Checklist</title>\n</head>\n<body>\n  <h1>On-Page SEO Guide</h1>\n</body>`,
  },
  'onpage-breadcrumbs-missing': {
    explanation: 'Breadcrumbs improve UX and can show in search results as rich snippets.',
    codeExample: `<nav aria-label="Breadcrumb">\n  <a href="/">Home</a> › <a href="/blog">Blog</a> › <span>SEO Guide</span>\n</nav>\n\n<script type="application/ld+json">\n{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[\n  {"@type":"ListItem","position":1,"name":"Home","item":"https://example.com/"},\n  {"@type":"ListItem","position":2,"name":"SEO Guide","item":"{{pageUrl}}"}\n]}\n</script>`,
  },
  'onpage-meta-keywords': {
    explanation: 'Meta keywords are ignored by Google and reveal your keyword strategy to competitors.',
    codeExample: `<!-- Remove this -->\n<meta name="keywords" content="seo, marketing, tips">`,
  },
  'onpage-h1-long': {
    explanation: 'Long H1s reduce scannability. Keep the headline concise; use H2 for detail.',
    codeExample: `<h1>On-Page SEO Checklist</h1>\n<h2>Title tags, meta descriptions, and headings</h2>`,
  },
  'technical-hreflang-xdefault': {
    explanation: 'x-default tells Google which URL to show when no language matches the user.',
    codeExample: `<link rel="alternate" hreflang="x-default" href="https://example.com/">\n<link rel="alternate" hreflang="en" href="https://example.com/en/">\n<link rel="alternate" hreflang="de" href="https://example.com/de/">`,
  },
  'technical-x-robots-noindex': {
    explanation: 'HTTP X-Robots-Tag overrides HTML meta — noindex here blocks indexing entirely.',
    codeExample: `# Remove noindex from server response\n# Apache: Header unset X-Robots-Tag\n# nginx: proxy_hide_header X-Robots-Tag;`,
  },
  'technical-cache-control': {
    explanation: 'Caching static assets reduces server load and improves Core Web Vitals.',
    codeExample: `# nginx\nlocation ~* \\.(css|js|jpg|png|webp|woff2)$ {\n  expires 30d;\n  add_header Cache-Control "public, immutable";\n}`,
  },
  'technical-semantic-html': {
    explanation: 'Semantic landmarks help crawlers identify main content vs navigation and boilerplate.',
    codeExample: `<body>\n  <header>...</header>\n  <main>\n    <article>...</article>\n  </main>\n  <footer>...</footer>\n</body>`,
  },
  'technical-resource-hints': {
    explanation: 'Preconnect establishes early connections to third-party origins (fonts, CDN).',
    codeExample: `<head>\n  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n  <link rel="dns-prefetch" href="https://www.google-analytics.com">\n</head>`,
  },
  'technical-trailing-slash': {
    explanation: '/page and /page/ are different URLs — pick one convention site-wide.',
    codeExample: `# nginx: remove trailing slash\nrewrite ^/(.*)/$ /$1 permanent;`,
  },
  'content-title-keywords-missing': {
    explanation: 'Body content should reinforce the title topic with natural keyword usage.',
    codeExample: `<h1>Your Target Topic</h1>\n<p>Your opening paragraph should naturally mention the primary keyword from your title...</p>`,
  },
  'content-long-paragraphs': {
    explanation: 'Wall-of-text paragraphs increase bounce rate and hurt readability scores.',
    codeExample: `<p>First key point in 2–3 sentences.</p>\n<p>Second point in a separate short paragraph.</p>\n<ul>\n  <li>Supporting detail</li>\n</ul>`,
  },
  'content-no-lists': {
    explanation: 'Lists improve scannability and often appear in featured snippets.',
    codeExample: `<h2>On-Page SEO Checklist</h2>\n<ul>\n  <li>Optimize title tag (30–60 chars)</li>\n  <li>Write meta description (120–160 chars)</li>\n  <li>Use one H1 and logical subheadings</li>\n</ul>`,
  },
  'content-generic-anchors': {
    explanation: 'Descriptive anchor text helps Google understand linked page topics (internal PageRank context).',
    codeExample: `<!-- Bad -->\n<a href="/seo-guide">click here</a>\n\n<!-- Good -->\n<a href="/seo-guide">read our on-page SEO guide</a>`,
  },
  'content-keyword-above-fold': {
    explanation: 'Keywords in the first 100 words signal topical relevance to search engines.',
    codeExample: `<h1>On-Page SEO Guide</h1>\n<p>On-page SEO is the practice of optimizing individual web pages to rank higher...</p>`,
  },
  'offpage-no-external-links': {
    explanation: 'Citing authoritative sources builds trust (E-E-A-T) and supports factual claims.',
    codeExample: `<p>According to <a href="https://developers.google.com/search/docs" rel="noopener noreferrer" target="_blank">Google Search Central</a>, quality content is the top ranking factor.</p>`,
  },
  'offpage-noopener-missing': {
    explanation: 'target="_blank" without noopener is a security risk (tabnabbing) and a best-practice violation.',
    codeExample: `<a href="https://external.com" target="_blank" rel="noopener noreferrer">External resource</a>`,
  },
  'offpage-sponsored-tags': {
    explanation: 'Google requires sponsored/affiliate links to be marked to avoid link scheme penalties.',
    codeExample: `<a href="https://affiliate.com/product" rel="sponsored nofollow noopener">Affiliate product</a>`,
  },
  'offpage-author-missing': {
    explanation: 'Author attribution supports E-E-A-T — especially important for YMYL content.',
    codeExample: `<article>\n  <p class="author">By <a rel="author" href="/authors/jane-doe">Jane Doe</a></p>\n  ...\n</article>\n\n<script type="application/ld+json">\n{"@type":"Article","author":{"@type":"Person","name":"Jane Doe","url":"https://example.com/authors/jane-doe"}}\n</script>`,
  },
  'offpage-social-profiles': {
    explanation: 'sameAs in Organization schema connects your site to verified social profiles.',
    codeExample: `<script type="application/ld+json">\n{\n  "@type": "Organization",\n  "name": "Your Brand",\n  "sameAs": [\n    "https://twitter.com/yourbrand",\n    "https://linkedin.com/company/yourbrand"\n  ]\n}\n</script>`,
  },
  'local-schema-missing': {
    explanation: 'LocalBusiness schema is required for local pack visibility alongside Google Business Profile.',
    codeExample: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "LocalBusiness",\n  "name": "Your Business",\n  "telephone": "+1-555-123-4567",\n  "address": {\n    "@type": "PostalAddress",\n    "streetAddress": "123 Main St",\n    "addressLocality": "City",\n    "postalCode": "12345",\n    "addressCountry": "US"\n  }\n}\n</script>`,
  },
  'local-geo-meta': {
    explanation: 'Geo meta tags supplement local signals (less important than schema + GBP).',
    codeExample: `<meta name="geo.region" content="US-CA">\n<meta name="geo.placename" content="San Francisco">\n<meta name="geo.position" content="37.7749;-122.4194">`,
  },
  'local-nap-consistency': {
    explanation: 'NAP must match exactly across website, Google Business Profile, and directories.',
    codeExample: `<footer>\n  <address>\n    <strong>Your Business Name</strong><br>\n    123 Main St, San Francisco, CA 94102<br>\n    <a href="tel:+15551234567">(555) 123-4567</a>\n  </address>\n</footer>`,
  },
  'lighthouse-error': {
    explanation: 'Lighthouse requires a local Chrome/Chromium install to run performance and advanced audits.',
    codeExample: `# Install dependencies (includes Chromium)\ncd your-project\nnpm install\n\n# Then restart the analyzer\nnpm start`,
  },
};

const LIGHTHOUSE_EXAMPLES = {
  'document-title': {
    explanation: 'Lighthouse checks that every page has a non-empty <title> element.',
    codeExample: `<head>\n  <title>Descriptive Page Title — Site Name</title>\n</head>`,
  },
  'meta-description': {
    explanation: 'Lighthouse flags pages missing a meta description tag.',
    codeExample: `<meta name="description" content="A concise summary of this page for search results.">`,
  },
  'html-has-lang': {
    explanation: 'Pages should declare a language on the <html> element for accessibility and SEO.',
    codeExample: `<html lang="en">`,
  },
  'canonical': {
    explanation: 'Lighthouse recommends a valid canonical link to avoid duplicate content.',
    codeExample: `<link rel="canonical" href="{{pageUrl}}">`,
  },
  'robots-txt': {
    explanation: 'A valid robots.txt helps crawlers understand crawl rules.',
    codeExample: `User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml`,
  },
  'hreflang': {
    explanation: 'For multilingual sites, hreflang tags tell Google which language/region each page targets.',
    codeExample: `<link rel="alternate" hreflang="en" href="https://example.com/en/page">
<link rel="alternate" hreflang="de" href="https://example.com/de/page">`,
  },
  'is-crawlable': {
    explanation: 'Pages blocked by robots meta or robots.txt cannot be indexed.',
    codeExample: `<meta name="robots" content="index, follow">`,
  },
  'image-alt': {
    explanation: 'Lighthouse flags images without alt attributes that convey information.',
    codeExample: `<img src="/photo.jpg" alt="Description of the image content">`,
  },
  'tap-targets': {
    explanation: 'Touch targets should be at least 48×48 px with adequate spacing for mobile usability.',
    codeExample: `.btn {
  min-height: 48px;
  min-width: 48px;
  padding: 12px 16px;
}`,
  },
  'viewport': {
    explanation: 'A mobile-friendly viewport is required for responsive rendering.',
    codeExample: `<meta name="viewport" content="width=device-width, initial-scale=1">`,
  },
  'render-blocking-resources': {
    explanation: 'CSS/JS blocking first paint delays LCP. Defer non-critical resources.',
    codeExample: `<script src="/analytics.js" defer></script>\n<link rel="preload" href="/critical.css" as="style">\n<link rel="stylesheet" href="/critical.css">`,
  },
  'uses-optimized-images': {
    explanation: 'Large unoptimized images slow page load and hurt Core Web Vitals.',
    codeExample: `<img src="/photo.webp" alt="Description" width="800" height="600" loading="lazy">`,
  },
  'uses-text-compression': {
    explanation: 'Enable gzip/brotli compression on your server to reduce transfer size.',
    codeExample: `# nginx\ngzip on;\ngzip_types text/plain text/css application/javascript application/json;`,
  },
  'server-response-time': {
    explanation: 'Slow TTFB hurts performance scores. Optimize backend and use caching.',
    codeExample: `# nginx proxy cache example\nproxy_cache_valid 200 10m;\nadd_header Cache-Control "public, max-age=600";`,
  },
  'color-contrast': {
    explanation: 'Text must meet WCAG contrast ratios for accessibility and SEO.',
    codeExample: `/* Minimum 4.5:1 contrast for body text */\nbody { color: #1a1a1a; background: #ffffff; }`,
  },
  'link-name': {
    explanation: 'Links need discernible text for screen readers and SEO.',
    codeExample: `<a href="/pricing">View pricing plans</a>`,
  },
  'crawlable-anchors': {
    explanation: 'Links must use valid href values so crawlers can follow them.',
    codeExample: `<a href="/about">About us</a>`,
  },
  'plugins': {
    explanation: 'Flash and other plugins are deprecated and harm mobile compatibility.',
    codeExample: `<!-- Remove <object>, <embed>, and Flash — use HTML5 video instead -->\n<video controls src="/intro.mp4"></video>`,
  },
  'font-size': {
    explanation: 'Base font size should be at least 12px on mobile for readability.',
    codeExample: `html { font-size: 16px; }\nbody { font-size: 1rem; line-height: 1.5; }`,
  },
  'uses-rel-preconnect': {
    explanation: 'Preconnect to required origins early in the document head.',
    codeExample: `<link rel="preconnect" href="https://fonts.googleapis.com">`,
  },
  'unused-css-rules': {
    explanation: 'Remove unused CSS or split stylesheets to reduce payload.',
    codeExample: `<!-- Load page-specific CSS only on that page -->\n<link rel="stylesheet" href="/pages/blog.css">`,
  },
  'unused-javascript': {
    explanation: 'Remove or defer JavaScript that is not needed for initial render.',
    codeExample: `<script src="/heavy-lib.js" defer></script>`,
  },
  'total-byte-weight': {
    explanation: 'Reduce overall page weight by compressing assets and lazy-loading media.',
    codeExample: `<img src="/hero.webp" loading="lazy" width="1200" height="630" alt="Hero">`,
  },
  'dom-size': {
    explanation: 'Excessive DOM nodes slow rendering. Simplify HTML structure.',
    codeExample: `<!-- Avoid deep nesting — flatten layout where possible -->\n<main><section><article>...</article></section></main>`,
  },
  'legacy-javascript': {
    explanation: 'Serve modern JS to modern browsers to reduce parse time.',
    codeExample: `<script type="module" src="/app.modern.js"></script>\n<script nomodule src="/app.legacy.js"></script>`,
  },
  'bf-cache': {
    explanation: 'Pages should be eligible for back/forward cache for instant navigation.',
    codeExample: `// Avoid unload handlers that block bfcache\n// window.addEventListener('unload', ...) — remove this`,
  },
  'inspector-issues': {
    explanation: 'Fix browser console errors and deprecations flagged by DevTools.',
    codeExample: `// Open DevTools → Console\n// Fix each error in the referenced source file`,
  },
};

const LIGHTHOUSE_PATTERNS = [
  { match: /image|webp|avif|responsive/, codeExample: `<img src="/photo.webp" alt="Description" width="800" height="600" loading="lazy">`, explanation: 'Optimize images: use modern formats, dimensions, and lazy loading.' },
  { match: /font|text-size|legible/, codeExample: `html { font-size: 16px; }\nbody { line-height: 1.5; }`, explanation: 'Ensure readable base font size and line height on all devices.' },
  { match: /contrast|color/, codeExample: `body { color: #111; background: #fff; }`, explanation: 'Improve color contrast to meet WCAG accessibility guidelines.' },
  { match: /script|javascript|js|blocking|bootup|mainthread/, codeExample: `<script src="/app.js" defer></script>`, explanation: 'Defer or async non-critical JavaScript to improve load performance.' },
  { match: /css|stylesheet|style/, codeExample: `<link rel="stylesheet" href="/styles.css">`, explanation: 'Reduce and optimize CSS — remove unused rules and inline critical CSS only.' },
  { match: /compress|cache|byte|weight|performance|lcp|fcp|speed|tti|tbt/, codeExample: `# Enable compression and caching on your server\ngzip on;\nadd_header Cache-Control "public, max-age=3600";`, explanation: 'Improve server delivery: compression, caching, and smaller payloads.' },
  { match: /link|anchor|href|crawl/, codeExample: `<a href="/page">Descriptive link text</a>`, explanation: 'Use valid, descriptive links that crawlers and users can follow.' },
  { match: /meta|title|description|document/, codeExample: `<head>\n  <title>Page Title — Site</title>\n  <meta name="description" content="Page summary.">\n</head>`, explanation: 'Fix document metadata in the page head.' },
  { match: /aria|accessibility|button|label|input|form/, codeExample: `<label for="email">Email</label>\n<input id="email" type="email" name="email">`, explanation: 'Add accessible labels and ARIA attributes to interactive elements.' },
  { match: /tap|touch|target|viewport|mobile/, codeExample: `<meta name="viewport" content="width=device-width, initial-scale=1">\n.btn { min-height: 48px; min-width: 48px; }`, explanation: 'Improve mobile usability with viewport meta and adequate tap targets.' },
  { match: /https|ssl|security|mixed/, codeExample: `# Redirect all traffic to HTTPS\nreturn 301 https://$host$request_uri;`, explanation: 'Serve all resources over HTTPS to meet security best practices.' },
];

const DEFAULT_LIGHTHOUSE = {
  explanation: 'This Lighthouse audit flagged an issue. Apply the fix below in your HTML, CSS, or server config.',
  codeExample: `<!-- Inspect the failing element in DevTools -->\n<!-- Apply the fix described in the audit above -->`,
};

function getCodeExample(id, context = {}) {
  const entry = EXAMPLES[id] || null;
  if (!entry) return null;

  return {
    explanation: entry.explanation,
    codeExample: interpolate(entry.codeExample, context),
    currentCode: entry.currentCode ? interpolate(entry.currentCode, context) : null,
  };
}

function getLighthouseExample(auditId, context = {}) {
  const entry = LIGHTHOUSE_EXAMPLES[auditId];
  if (entry) {
    return {
      explanation: entry.explanation,
      codeExample: interpolate(entry.codeExample, context),
    };
  }

  for (const pattern of LIGHTHOUSE_PATTERNS) {
    if (pattern.match.test(auditId)) {
      return {
        explanation: pattern.explanation,
        codeExample: interpolate(pattern.codeExample, context),
      };
    }
  }

  return {
    explanation: DEFAULT_LIGHTHOUSE.explanation,
    codeExample: interpolate(DEFAULT_LIGHTHOUSE.codeExample, context),
  };
}

const PREFIX_FALLBACKS = [
  { prefix: 'meta-', codeExample: `<head>\n  <title>Page Title — Brand</title>\n  <meta name="description" content="Describe this page in 120–160 characters.">\n  <link rel="canonical" href="{{pageUrl}}">\n</head>`, explanation: 'Add or correct meta tags in the document head.' },
  { prefix: 'headings-', codeExample: `<body>\n  <main>\n    <h1>Main Page Topic</h1>\n    <h2>First Section</h2>\n  </main>\n</body>`, explanation: 'Fix heading structure for SEO and accessibility.' },
  { prefix: 'images-', codeExample: `<img src="/image.jpg" alt="Describe the image" width="800" height="600" loading="lazy">`, explanation: 'Correct image attributes for SEO and Core Web Vitals.' },
  { prefix: 'links-', codeExample: `<nav>\n  <a href="/">Home</a>\n  <a href="/about">About</a>\n</nav>`, explanation: 'Fix internal linking structure.' },
  { prefix: 'social-', codeExample: `<head>\n  <meta property="og:title" content="Page Title">\n  <meta property="og:description" content="Page summary.">\n  <meta property="og:image" content="https://example.com/og.jpg">\n  <meta name="twitter:card" content="summary_large_image">\n</head>`, explanation: 'Add Open Graph and Twitter card meta tags.' },
  { prefix: 'structured-data-', codeExample: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "Page Title",\n  "url": "{{pageUrl}}"\n}\n</script>`, explanation: 'Add or fix JSON-LD structured data.' },
  { prefix: 'mobile-', codeExample: `<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n</head>`, explanation: 'Ensure mobile-friendly viewport configuration.' },
  { prefix: 'content-', codeExample: `<article>\n  <h1>Topic Title</h1>\n  <p>Opening paragraph with primary keywords...</p>\n  <h2>Section Heading</h2>\n  <ul>\n    <li>Scannable point</li>\n  </ul>\n</article>`, explanation: 'Improve content structure, length, and keyword placement.' },
  { prefix: 'robots-', codeExample: `# robots.txt\nUser-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml`, explanation: 'Configure robots.txt for proper crawling.' },
  { prefix: 'sitemap-', codeExample: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>{{pageUrl}}</loc></url>\n</urlset>`, explanation: 'Fix sitemap XML or reference in robots.txt.' },
  { prefix: 'onpage-', codeExample: `<head>\n  <title>Keyword-Rich Title — Brand</title>\n</head>\n<body>\n  <h1>Matching H1 Headline</h1>\n</body>`, explanation: 'Improve on-page elements: URL, title, H1 alignment, breadcrumbs.' },
  { prefix: 'technical-', codeExample: `<body>\n  <header>...</header>\n  <main>...</main>\n  <footer>...</footer>\n</body>`, explanation: 'Apply technical SEO fix in HTML or server configuration.' },
  { prefix: 'offpage-', codeExample: `<a href="https://authority.com" rel="noopener noreferrer" target="_blank">Trusted source</a>`, explanation: 'Improve off-page signals: external links, authorship, social profiles.' },
  { prefix: 'local-', codeExample: `<script type="application/ld+json">\n{"@type":"LocalBusiness","name":"Business","telephone":"+1-555-0100"}\n</script>`, explanation: 'Add local SEO schema and consistent NAP information.' },
];

function inferPrefixFallback(check, context = {}) {
  const id = check.id || '';
  for (const rule of PREFIX_FALLBACKS) {
    if (id.startsWith(rule.prefix)) {
      return {
        explanation: rule.explanation,
        codeExample: interpolate(rule.codeExample, context),
      };
    }
  }
  return null;
}

function enrichWithCodeFix(check, context = {}) {
  if (check.status === 'pass') return check;

  let code = getCodeExample(check.id, context);

  if (check.id.startsWith('lighthouse-')) {
    const auditId = check.id.replace(/^lighthouse-/, '');
    code = getLighthouseExample(auditId, context);
  }

  if (!code?.codeExample) {
    code = inferPrefixFallback(check, context) || code;
  }

  if (!code?.codeExample && check.suggestion) {
    code = {
      explanation: check.suggestion,
      codeExample: `<!-- ${check.message} -->\n<!-- Action: ${check.suggestion} -->`,
    };
  }

  return {
    ...check,
    explanation: check.explanation || code?.explanation || check.suggestion || null,
    codeExample: code?.codeExample || null,
    currentCode: check.currentCode || code?.currentCode || null,
  };
}

function enrichSuggestion(suggestion, context = {}) {
  if (suggestion.codeExample) return suggestion;

  const pseudoCheck = {
    id: suggestion.id,
    status: suggestion.impact === 'high' ? 'fail' : 'warn',
    message: suggestion.title,
    suggestion: suggestion.suggestion,
    currentCode: suggestion.currentCode,
  };

  const enriched = enrichWithCodeFix(pseudoCheck, context);
  return {
    ...suggestion,
    explanation: suggestion.explanation || enriched.explanation,
    codeExample: enriched.codeExample,
    currentCode: suggestion.currentCode || enriched.currentCode,
  };
}

function interpolate(template, context) {
  if (!template) return null;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => context[key] ?? `{{${key}}}`);
}

module.exports = {
  getCodeExample,
  getLighthouseExample,
  enrichWithCodeFix,
  enrichSuggestion,
};
