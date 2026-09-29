const express = require('express');
const path = require('path');
const { analyzeUrl } = require('./lib/analyzer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/analyze', async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL is required.' });
  }

  try {
    const result = await analyzeUrl(url.trim());
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Analysis failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`SEO Analyzer running at http://localhost:${PORT}`);
});
