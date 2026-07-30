const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// --- Logging ---
const logFile = path.join(__dirname, '..', 'audit.log');
const logAction = (userId, action, details) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] USER:${userId} | ACTION:${action} | DETAILS:${JSON.stringify(details)}\n`;
  fs.appendFile(logFile, logEntry, (err) => {
    if (err) console.error("Failed to write to audit log", err);
  });
};

// --- Rate Limiting (Memory Based) ---
const rateLimitMap = new Map();
const rateLimiter = (options = {}) => {
  const limit = options.limit || 100; // requests
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 mins
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }
    const record = rateLimitMap.get(ip);
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }
    record.count += 1;
    if (record.count > limit) {
      logAction(req.user ? req.user._id : 'UNKNOWN', 'RATE_LIMIT_EXCEEDED', { ip });
      return res.status(429).json({ success: false, message: 'Too many requests, please try again later.' });
    }
    next();
  };
};

// --- Encryption ---
// In a real app, use an env variable for the key. Here we generate a stable one for the session.
const ENCRYPTION_KEY = crypto.createHash('sha256').update(process.env.JWT_SECRET || 'fallback_secret').digest();
const IV_LENGTH = 16;

const encryptMetadata = (text) => {
  if (!text) return text;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

const decryptMetadata = (text) => {
  if (!text || !text.includes(':')) return text;
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

// --- Masking ---
const maskDocumentNumber = (type, value) => {
  if (!value) return null;
  const str = value.toString().replace(/[^a-zA-Z0-9]/g, '');
  if (type === 'Aadhaar Card' && str.length >= 12) {
    return 'XXXX XXXX ' + str.slice(-4);
  }
  if (type === 'PAN Card' && str.length >= 10) {
    return str.slice(0, 5) + '****' + str.slice(-1);
  }
  // Generic mask for other numbers (show last 4)
  if (str.length > 4) {
    return '*'.repeat(str.length - 4) + str.slice(-4);
  }
  return '****';
};

module.exports = {
  logAction,
  rateLimiter,
  encryptMetadata,
  decryptMetadata,
  maskDocumentNumber
};
