const slugify = require('slugify');
const jwt = require('jsonwebtoken');

function makeSlug(text) {
  const base = slugify(String(text || ''), { lower: true, strict: true });
  return base || `item-${Date.now().toString(36)}`;
}

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function publicUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    active: user.active,
    createdAt: user.createdAt,
  };
}

// Keeps only the provided keys from an object (used to whitelist request bodies).
function pick(obj, keys) {
  return keys.reduce((acc, k) => {
    if (obj[k] !== undefined) acc[k] = obj[k];
    return acc;
  }, {});
}

module.exports = { makeSlug, signToken, publicUser, pick };
