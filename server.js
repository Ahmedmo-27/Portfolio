import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { createMailRouter } from './server/mailApi.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '100kb' }));

// Return JSON on invalid JSON bodies (instead of default HTML error page)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ ok: false, error: 'invalid_json' });
  }
  return next(err);
});
app.use('/api', createMailRouter());

// Serve static files from the dist directory
const distDir = join(__dirname, 'dist');
if (existsSync(distDir)) {
  app.use(
    express.static(distDir, {
      setHeaders: (res, path) => {
        // Ensure PDFs are served inline (some platforms default to downloading)
        if (path.endsWith('.pdf')) {
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'inline');
        }
      },
    })
  );

  // Handle React Router - serve index.html for all routes
  app.get('*', (req, res) => {
    res.sendFile(join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});