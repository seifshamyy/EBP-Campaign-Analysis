// Minimal Express server to host the static app on Railway or any Node host
// Save this file at the project root, alongside package.json
// Serve /public (or current dir) and default to index.html

const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// gzip
app.use(compression());

// static
const publicDir = path.join(__dirname);
app.use(express.static(publicDir, {
  etag: true,
  lastModified: true,
  maxAge: '1h',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// health
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

// fallback to index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on :${PORT}`);
});

