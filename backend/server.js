require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const crypto = require('crypto');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const port = process.env.PORT || 5000;
const salt = process.env.SALT || 'default_mindbridge_salt';

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Anthropic AI
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key_to_prevent_crash',
});

// Database Connection
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to MongoDB Atlas');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });
} else {
  console.warn('⚠️ MONGO_URI is missing. Please add it to your .env file.');
}

// Mongoose Schema & Model
const journalSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // SHA-256 Hashed ID
  date: { type: Date, default: Date.now },
  mood: { type: String, default: '😐 Neutral' },
  text: { type: String, required: true }
});

const Journal = mongoose.model('Journal', journalSchema);

// Helper: Hash Identity
// Privacy-first identity mapping: We never store the actual token/username
const hashIdentity = (token) => {
  return crypto.createHash('sha256').update((token || 'anonymous') + salt).digest('hex');
};

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'MindBridge AI Backend is running securely' });
});

// --- Journal & Mood Routes ---

// Get all journals for the logged-in user
app.get('/api/journal', async (req, res) => {
  try {
    const token = req.headers.authorization;
    const userId = hashIdentity(token);

    // If MongoDB is not connected (e.g., local dev without URI), return empty array
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }

    const journals = await Journal.find({ userId }).sort({ date: -1 });
    res.json(journals);
  } catch (error) {
    console.error('Error fetching journals:', error);
    res.status(500).json({ error: 'Failed to fetch journals' });
  }
});

// Create new journal entry
app.post('/api/journal', async (req, res) => {
  const { mood, text, token } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Journal text is required' });
  }

  try {
    const userId = hashIdentity(token);

    if (mongoose.connection.readyState === 1) {
      const newEntry = new Journal({ userId, mood, text });
      await newEntry.save();
      return res.status(201).json({ message: 'Journal saved securely', entry: newEntry });
    } else {
      // Fallback if DB is not connected
      console.warn('DB not connected. Journal not saved persistently.');
      return res.status(201).json({ message: 'Simulated save (DB not connected)', entry: { _id: Date.now().toString(), date: new Date(), mood, text } });
    }
  } catch (error) {
    console.error('Error saving journal:', error);
    res.status(500).json({ error: 'Failed to save journal' });
  }
});

// --- AI Chat Route ---

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Chat messages are required' });
  }

  try {
    // Format messages for Anthropic API
    const formattedMessages = messages
      .filter(m => m.role === 'user' || m.role === 'bot')
      .map(m => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.text
      }));

    if (!process.env.ANTHROPIC_API_KEY) {
      await new Promise(r => setTimeout(r, 1000));
      return res.json({ 
        reply: "Hello! I am MindBridge AI. My creator hasn't added the Anthropic API key to the server yet, so I'm currently running in offline mode. Please add ANTHROPIC_API_KEY to your backend environment variables to enable full AI chat! 🌿" 
      });
    }

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 300,
      system: "You are MindBridge AI, a compassionate, empathetic, and professional mental health support assistant. Your goal is to listen without judgment, offer gentle reflections, and provide a safe space for the user. Keep your responses relatively concise (1-3 sentences) and warm.",
      messages: formattedMessages
    });

    res.json({ reply: response.content[0].text });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ error: 'Failed to communicate with AI', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
