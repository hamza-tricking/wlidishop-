const jwt = require('jsonwebtoken');
const User = require('../models/User');

function readToken(req) {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

async function loadUser(token) {
  const { id } = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(id);
  return user && user.active ? user : null;
}

async function protect(req, res, next) {
  const token = readToken(req);
  if (!token) return res.status(401).json({ message: 'Not authorized' });
  try {
    req.user = await loadUser(token);
  } catch {
    req.user = null;
  }
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });
  next();
}

// Attaches req.user when a valid token is present, but never blocks the request.
async function optionalAuth(req, res, next) {
  const token = readToken(req);
  if (token) {
    try {
      req.user = await loadUser(token);
    } catch {
      req.user = null;
    }
  }
  next();
}

function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
  next();
}

module.exports = { protect, optionalAuth, adminOnly };
