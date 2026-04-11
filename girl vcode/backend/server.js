require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Category = require('./models/Category');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/privacy_engine';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:4173'], // dev + preview
  methods: ['GET', 'POST'],
}));
app.use(express.json());

// ─── Database Connection ───────────────────────────────────────────────────────
mongoose
  .connect(MONGO_URI)
  .then(() => console.log(`✅ MongoDB connected: ${MONGO_URI}`))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * GET /health
 * Simple health-check (useful for frontend offline detection).
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * POST /track
 * Body: { category: "fitness" }
 * 
 * ⚠️  PRIVACY RULE: Only an anonymous category string is accepted.
 * No user ID, no session ID, no IP logging, no PII stored.
 * We use $inc to atomically increment the aggregate counter.
 */
app.post('/track', async (req, res) => {
  try {
    const { category } = req.body;

    if (!category || typeof category !== 'string') {
      return res.status(400).json({ error: 'category (string) is required' });
    }

    const sanitized = category.trim().toLowerCase().slice(0, 64); // sanitize
    if (!sanitized) {
      return res.status(400).json({ error: 'invalid category value' });
    }

    // Upsert: create if absent, increment count
    const doc = await Category.findOneAndUpdate(
      { category: sanitized },
      { $inc: { count: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ category: doc.category, count: doc.count });
  } catch (err) {
    console.error('POST /track error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /analytics
 * Returns aggregated category counts for the Analytics Dashboard.
 * Response shape: { fitness: 120, tech: 95, ... }
 */
app.get('/analytics', async (req, res) => {
  try {
    const categories = await Category.find({}, 'category count -_id').lean();

    const result = categories.reduce((acc, doc) => {
      acc[doc.category] = doc.count;
      return acc;
    }, {});

    return res.status(200).json(result);
  } catch (err) {
    console.error('GET /analytics error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /analytics/trending
 * Returns sorted top-N categories.
 */
app.get('/analytics/trending', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const trending = await Category.find({})
      .sort({ count: -1 })
      .limit(limit)
      .select('category count -_id')
      .lean();

    return res.status(200).json(trending);
  } catch (err) {
    console.error('GET /analytics/trending error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ─── 404 Fallback ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Privacy Engine API running on http://localhost:${PORT}`);
  console.log(`   POST /track         → anonymous category tracking`);
  console.log(`   GET  /analytics     → aggregated counts`);
  console.log(`   GET  /analytics/trending → sorted top categories`);
  console.log(`   GET  /health        → service health`);
});
