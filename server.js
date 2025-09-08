const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
app.disable('x-powered-by');
app.use(compression());

// serve all static assets from the repo root
app.use(express.static(__dirname, {
  setHeaders(res, filePath) {
    if (/\.html?$/.test(filePath)) {
      res.setHeader('Cache-Control', 'no-store');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// healthcheck (optional)
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

// send index.html for all other routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
