const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const { UPLOAD_DIR } = require('./middleware/upload');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();
app.set('trust proxy', 1);

// CLIENT_URL may hold several comma-separated origins (Vercel URL, custom domain, localhost).
const allowed = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowed.includes(origin) || /^https:\/\/wlidishop[a-z0-9-]*\.vercel\.app$/.test(origin)) {
        return cb(null, true);
      }
      cb(null, false);
    },
    credentials: true,
  })
);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json({ limit: '2mb' }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use('/files', express.static(UPLOAD_DIR, { maxAge: '30d' }));

app.use('/api/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 }));
app.use('/api/orders', rateLimit({ windowMs: 10 * 60 * 1000, limit: 60, skip: (req) => req.method !== 'POST' }));
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
