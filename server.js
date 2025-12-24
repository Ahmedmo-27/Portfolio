import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import compression from 'compression';
import { createMailRouter } from './server/mailApi.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Cache duration constants
const ONE_YEAR = 31536000; // 1 year in seconds
const THIRTY_DAYS = 2592000; // 30 days in seconds (Chrome recommendation minimum)
const ONE_WEEK = 604800;   // 1 week in seconds
const ONE_DAY = 86400;     // 1 day in seconds

// Enable gzip/brotli compression for all responses
app.use(compression({
  level: 6, // Balanced compression level
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => {
    // Don't compress if client doesn't accept encoding
    if (req.headers['x-no-compression']) return false;
    // Use default filter (compresses text-based content)
    return compression.filter(req, res);
  },
}));

app.use(express.json({ limit: '100kb' }));

// Return JSON on invalid JSON bodies (instead of default HTML error page)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ ok: false, error: 'invalid_json' });
  }
  return next(err);
});
app.use('/api', createMailRouter());

// Serve static files from the dist directory with aggressive caching
const distDir = join(__dirname, 'dist');
if (existsSync(distDir)) {
  // Serve hashed assets (JS, CSS) with long-term cache (1 year)
  // These files have content hashes in filenames, so they're immutable
  app.use(
    '/assets',
    express.static(join(distDir, 'assets'), {
      maxAge: ONE_YEAR * 1000, // Express uses milliseconds
      immutable: true,
      etag: true,
      lastModified: true,
      setHeaders: (res, path) => {
        res.setHeader('Cache-Control', `public, max-age=${ONE_YEAR}, immutable`);
      },
    })
  );

  // Serve other static files with shorter cache
  app.use(
    express.static(distDir, {
      maxAge: ONE_DAY * 1000,
      etag: true,
      lastModified: true,
      setHeaders: (res, path) => {
        // Hashed files (contain hash in filename) - long cache
        if (/\.[a-f0-9]{8,}\.(js|css|woff2?|ttf|eot)$/i.test(path)) {
          res.setHeader('Cache-Control', `public, max-age=${ONE_YEAR}, immutable`);
          return;
        }
        
        // Images - cache for 30 days (Chrome recommendation: minimum 30 days for cacheable resources)
        // Note: If images are versioned/hashed, add 'immutable' directive
        if (/\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$/i.test(path)) {
          res.setHeader('Cache-Control', `public, max-age=${THIRTY_DAYS}`);
          return;
        }
        
        // Fonts - cache for 1 year (immutable assets)
        if (/\.(woff2?|ttf|eot|otf)$/i.test(path)) {
          res.setHeader('Cache-Control', `public, max-age=${ONE_YEAR}, immutable`);
          return;
        }
        
        // PDFs and documents - cache for 30 days
        if (path.endsWith('.pdf')) {
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'inline');
          res.setHeader('Cache-Control', `public, max-age=${THIRTY_DAYS}`);
          return;
        }
        
        // Video files - cache for 30 days
        if (/\.(mp4|webm|ogg|mov|avi)$/i.test(path)) {
          res.setHeader('Cache-Control', `public, max-age=${THIRTY_DAYS}`);
          return;
        }
        
        // HTML files - short cache with revalidation
        if (path.endsWith('.html')) {
          res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
          return;
        }
        
        // Service worker - no cache
        if (path.endsWith('sw.js') || path.endsWith('service-worker.js')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          return;
        }
        
        // Default - 1 day cache
        res.setHeader('Cache-Control', `public, max-age=${ONE_DAY}`);
      },
    })
  );

  // Handle React Router - serve index.html for all routes
  app.get('*', (req, res) => {
    // Set cache headers for index.html (SPA entry point)
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.sendFile(join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});