/**
 * EXPRESS.JS BACKEND SERVER EXAMPLE
 * 
 * This file demonstrates how to build the backend server that would:
 * 1. Connect to MongoDB Atlas
 * 2. Handle API requests from the frontend
 * 3. Integrate with AI services for bias detection
 * 4. Manage user data and interactions
 * 
 * TO USE THIS:
 * 1. Create a new directory: mkdir backend && cd backend
 * 2. Initialize Node project: npm init -y
 * 3. Install dependencies: npm install express mongoose cors dotenv openai
 * 4. Copy this code to backend/server.js
 * 5. Create .env file with MongoDB connection string
 * 6. Run: node server.js
 */

// ============================================================================
// IMPORTS & SETUP
// ============================================================================
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// OpenRouter setup
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY
});

// ============================================================================
// MONGODB CONNECTION
// ============================================================================

mongoose.connect(process.env.MONGODB_URI)

.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ============================================================================
// MONGOOSE SCHEMAS & MODELS
// ============================================================================

// User Schema
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  email: String,
  preferences: {
    education: { type: Number, default: 50 },
    viewpoint: { type: Number, default: 50 },
    sentiment: { type: Number, default: 50 },
    recency: { type: Number, default: 50 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Content Schema
const contentSchema = new mongoose.Schema({
  contentId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  type: { type: String, enum: ['educational', 'entertainment'], required: true },
  viewpoint: { type: String, enum: ['agreeable', 'neutral', 'opposing'], required: true },
  sentiment: { type: String, enum: ['positive', 'controversial'], required: true },
  virality: { type: Number, min: 0, max: 100 },
  biasScore: { type: Number, min: 1, max: 5 },
  trustScore: { type: Number, min: 1, max: 5 },
  source: String,
  tags: [String],
  recommendationReason: String,
  createdAt: { type: Date, default: Date.now }
});

contentSchema.index({ tags: 1, type: 1, viewpoint: 1 });

const Content = mongoose.model('Content', contentSchema);

// Interaction Schema
const interactionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  contentId: { type: String, required: true, index: true },
  action: { 
    type: String, 
    enum: ['view', 'expand', 'share', 'dismiss'], 
    required: true 
  },
  sliderValues: {
    education: Number,
    viewpoint: Number,
    sentiment: Number,
    recency: Number
  },
  timestamp: { type: Date, default: Date.now, index: true }
});

interactionSchema.index({ userId: 1, timestamp: -1 });
interactionSchema.index({ contentId: 1, action: 1 });

const Interaction = mongoose.model('Interaction', interactionSchema);

// BiasAnalysis Schema
const biasAnalysisSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  text: { type: String, required: true },
  results: [{
    type: String,
    explanation: String,
    example: String,
    suggestion: String,
    confidence: Number
  }],
  timestamp: { type: Date, default: Date.now, index: true }
});

const BiasAnalysis = mongoose.model('BiasAnalysis', biasAnalysisSchema);

// ============================================================================
// API ROUTES - CONTENT
// ============================================================================

// Get personalized content feed
app.post('/api/content/feed', async (req, res) => {
  try {
    const { sliderValues, userId, limit = 12 } = req.body;

    // Build query based on slider values
    const query = {};
    
    // Filter by type based on education slider
    if (sliderValues.education < 40) {
      query.type = 'educational';
    } else if (sliderValues.education > 60) {
      query.type = 'entertainment';
    }

    // Get content from MongoDB
    const content = await Content.find(query).limit(limit * 2).lean();

    // Score and rank content based on slider values
    const scoredContent = content.map(item => ({
      ...item,
      relevanceScore: calculateRelevanceScore(item, sliderValues)
    }));

    // Sort by relevance and return top results
    const results = scoredContent
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);

    // Log this request for analytics
    if (userId) {
      await logFeedRequest(userId, sliderValues, results.map(r => r.contentId));
    }

    res.json(results);
  } catch (error) {
    console.error('Error fetching feed:', error);
    res.status(500).json({ error: 'Failed to fetch content feed' });
  }
});

// Get content by ID
app.get('/api/content/:id', async (req, res) => {
  try {
    const content = await Content.findOne({ contentId: req.params.id });
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Search content
app.post('/api/content/search', async (req, res) => {
  try {
    const { query } = req.body;
    const results = await Content.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { excerpt: { $regex: query, $options: 'i' } },
        { tags: { $in: [query] } }
      ]
    }).limit(20);
    res.json(results);
  } catch (error) {
    console.error('Error searching content:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// ============================================================================
// API ROUTES - INTERACTIONS
// ============================================================================

// Log user interaction
app.post('/api/interactions', async (req, res) => {
  try {
    const interaction = new Interaction(req.body);
    await interaction.save();
    res.json({ success: true, id: interaction._id });
  } catch (error) {
    console.error('Error logging interaction:', error);
    res.status(500).json({ error: 'Failed to log interaction' });
  }
});

// Get user interaction history
app.get('/api/interactions/user/:userId', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const interactions = await Interaction.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .limit(limit);
    res.json(interactions);
  } catch (error) {
    console.error('Error fetching interactions:', error);
    res.status(500).json({ error: 'Failed to fetch interactions' });
  }
});

// Get interactions for specific content
app.get('/api/interactions/content/:contentId', async (req, res) => {
  try {
    const interactions = await Interaction.find({ contentId: req.params.contentId });
    res.json(interactions);
  } catch (error) {
    console.error('Error fetching content interactions:', error);
    res.status(500).json({ error: 'Failed to fetch interactions' });
  }
});

// ============================================================================
// API ROUTES - AI SERVICES
// ============================================================================

// Analyze text for cognitive biases using AI
app.post('/api/ai/bias-detection', async (req, res) => {
  try {
    const { text } = req.body;

    // Call OpenRouter to analyze the text
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-lite", // or google/gemini-2.0-flash-lite-001
      messages: [
        {
          role: "system",
          content: `You are a cognitive bias detection expert. Analyze the given text and identify any cognitive biases, logical fallacies, or biased thinking patterns. 
          
Return your analysis as a JSON array with the following structure:
[
  {
    "type": "Bias Name",
    "explanation": "What this bias means",
    "example": "How it appears in the text",
    "suggestion": "How to improve thinking",
    "confidence": 85
  }
]

Common biases to check for: Confirmation Bias, Bandwagon Effect, Availability Heuristic, False Dilemma, Anchoring Bias, Appeal to Authority, Ad Hominem, Dunning-Kruger Effect, Slippery Slope, Hasty Generalization, Emotional Reasoning, Sunk Cost Fallacy.

If no significant biases are detected, return a single "Balanced Thinking" result.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.7,
    });

    const results = JSON.parse(completion.choices[0].message.content);

    // Save to database
    const analysis = new BiasAnalysis({
      userId: req.body.userId || 'anonymous',
      text,
      results,
    });
    await analysis.save();

    res.json(results);
  } catch (error) {
    console.error('Error in bias detection:', error);
    res.status(500).json({ error: 'Bias detection failed' });
  }
});

// Get bias analysis history
app.get('/api/ai/bias-history/:userId', async (req, res) => {
  try {
    const history = await BiasAnalysis.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(history);
  } catch (error) {
    console.error('Error fetching bias history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// ============================================================================
// API ROUTES - ANALYTICS
// ============================================================================

// Get user statistics
app.get('/api/analytics/stats/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Get all user interactions
    const interactions = await Interaction.find({ userId });

    // Get content details for viewed items
    const contentIds = interactions
      .filter(i => i.action === 'view')
      .map(i => i.contentId);

    const viewedContent = await Content.find({ 
      contentId: { $in: contentIds } 
    });

    // Calculate statistics
    const stats = calculateUserStats(interactions, viewedContent);

    res.json(stats);
  } catch (error) {
    console.error('Error calculating stats:', error);
    res.status(500).json({ error: 'Failed to calculate statistics' });
  }
});

// Get echo chamber score
app.get('/api/analytics/echo-chamber/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const interactions = await Interaction.find({ 
      userId,
      action: 'view'
    });

    const contentIds = interactions.map(i => i.contentId);
    const content = await Content.find({ 
      contentId: { $in: contentIds } 
    });

    // Calculate echo chamber score
    const agreeable = content.filter(c => c.viewpoint === 'agreeable').length;
    const total = content.length;
    const score = (agreeable / total) * 100;

    res.json({ score: Math.round(score) });
  } catch (error) {
    console.error('Error calculating echo chamber score:', error);
    res.status(500).json({ error: 'Failed to calculate score' });
  }
});

// ============================================================================
// API ROUTES - USERS
// ============================================================================

// Get or create user profile
app.get('/api/users/:userId', async (req, res) => {
  try {
    let user = await User.findOne({ userId: req.params.userId });
    
    if (!user) {
      user = new User({ userId: req.params.userId });
      await user.save();
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user preferences
app.put('/api/users/:userId/preferences', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { userId: req.params.userId },
      { 
        preferences: req.body,
        updatedAt: Date.now()
      },
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Clear user data
app.delete('/api/users/:userId/data', async (req, res) => {
  try {
    await Interaction.deleteMany({ userId: req.params.userId });
    await BiasAnalysis.deleteMany({ userId: req.params.userId });
    res.json({ success: true, message: 'User data cleared' });
  } catch (error) {
    console.error('Error clearing user data:', error);
    res.status(500).json({ error: 'Failed to clear data' });
  }
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function calculateRelevanceScore(content, sliderValues) {
  let score = 0;

  // Education vs Entertainment
  if (content.type === 'educational') {
    score += (100 - sliderValues.education) / 25;
  } else {
    score += sliderValues.education / 25;
  }

  // Viewpoint
  const viewpointScores = { agreeable: 0, neutral: 50, opposing: 100 };
  const viewpointDiff = Math.abs(sliderValues.viewpoint - viewpointScores[content.viewpoint]);
  score += (100 - viewpointDiff) / 25;

  // Sentiment
  if (content.sentiment === 'positive') {
    score += (100 - sliderValues.sentiment) / 25;
  } else {
    score += sliderValues.sentiment / 25;
  }

  // Virality
  const viralityMatch = sliderValues.recency / 100;
  score += (content.virality / 100) * viralityMatch * 4;
  score += (1 - viralityMatch) * 2;

  return score / 4;
}

function calculateUserStats(interactions, content) {
  // Implementation similar to frontend dataStore.calculateStats
  // Returns user statistics object
  const viewedContent = interactions
    .filter(i => i.action === 'view')
    .map(i => content.find(c => c.contentId === i.contentId))
    .filter(Boolean);

  const total = viewedContent.length;
  if (total === 0) {
    return getDefaultStats();
  }

  // Calculate distributions
  const educational = viewedContent.filter(c => c.type === 'educational').length;
  const agreeable = viewedContent.filter(c => c.viewpoint === 'agreeable').length;

  return {
    totalViewed: total,
    avgBiasScore: (viewedContent.reduce((sum, c) => sum + c.biasScore, 0) / total).toFixed(1),
    avgTrustScore: (viewedContent.reduce((sum, c) => sum + c.trustScore, 0) / total).toFixed(1),
    contentDistribution: {
      educational: Math.round((educational / total) * 100),
      entertainment: Math.round(((total - educational) / total) * 100)
    },
    echoChamberScore: Math.round((agreeable / total) * 100)
  };
}

function getDefaultStats() {
  return {
    totalViewed: 0,
    avgBiasScore: 0,
    avgTrustScore: 0,
    contentDistribution: { educational: 50, entertainment: 50 },
    echoChamberScore: 50
  };
}

async function logFeedRequest(userId, sliderValues, contentIds) {
  // Log feed request for analytics
  console.log(`Feed request: ${userId}`, { sliderValues, contentIds });
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: Date.now(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ============================================================================
// SERVE FRONTEND (PRODUCTION UNIFICATION)
// ============================================================================

// Serve the static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route: any request that doesn't match an API route goes to React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(`🚀 OpenMind Backend Server running on port ${PORT}`);
  console.log(`📊 MongoDB: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}`);
  console.log(`🤖 OpenRouter: ${process.env.OPENROUTER_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  mongoose.connection.close();
  process.exit(0);
});
