import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { Student, Journal, Message } from './models.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mindbridge';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas (MindBridge Database)'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));


// --- Helper Functions ---
// Hash email securely so we NEVER store a real email address
const hashEmail = (email) => crypto.createHash('sha256').update(email.toLowerCase().trim() + (process.env.SALT || 'supersecret')).digest('hex');

// Simple risk assessment algorithm (simulated NLP)
const assessRisk = (text) => {
  const highRiskWords = ['suicide', 'kill', 'end it', 'hopeless', 'harm', 'giving up'];
  const mediumRiskWords = ['anxiety', 'panic', 'stress', 'lonely', 'sleep', 'overwhelmed'];
  
  const lowerText = text.toLowerCase();
  
  const hasHigh = highRiskWords.some(w => lowerText.includes(w));
  if (hasHigh) return { level: 'High', triggers: highRiskWords.filter(w => lowerText.includes(w)) };
  
  const hasMedium = mediumRiskWords.some(w => lowerText.includes(w));
  if (hasMedium) return { level: 'Medium', triggers: mediumRiskWords.filter(w => lowerText.includes(w)) };
  
  return { level: 'Low', triggers: [] };
}


// --- API Endpoints: AUTH ---

// Login / Verify OTP (MOCK) -> Returns Student Data
app.post('/api/auth/verify', async (req, res) => {
  try {
    const { email } = req.body;
    
    // If anonymous, just return a fake session
    if (!email) {
      return res.json({ token: 'anon-session', student: { anonymousId: 'Anon-Guest' } });
    }

    const emailHash = hashEmail(email);
    
    // Find or create student
    let student = await Student.findOne({ emailHash });
    
    if (!student) {
      // Create new anonymous identity
      const anonId = 'MB-' + Math.floor(1000 + Math.random() * 9000); // e.g., MB-4921
      student = new Student({ anonymousId: anonId, emailHash });
      await student.save();
    }

    // In a real app, generate a JWT here
    res.json({ token: student._id, student: { anonymousId: student.anonymousId, riskLevel: student.riskLevel } });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
});


// --- API Endpoints: STUDENT APP ---

// Save a journal entry
app.post('/api/journal', async (req, res) => {
  try {
    const { token, mood, text, promptUsed } = req.body;
    
    let student;
    if (token === 'anon-session') {
       student = await Student.findOne({ anonymousId: 'Anon-Guest' });
       if (!student) {
           student = new Student({ anonymousId: 'Anon-Guest', emailHash: 'anon_hash_' + Math.random(), riskLevel: 'Low', triggers: [], lastActive: Date.now() });
           await student.save();
       }
    } else {
        student = await Student.findById(token);
    }
    
    if (!student) return res.status(401).json({ error: 'Unauthorized' });

    const entry = new Journal({ studentId: student._id, mood, text, promptUsed });
    await entry.save();

    // Analyze Risk
    const { level, triggers } = assessRisk(text);
    
    // Escalate risk if needed (never downgrade automatically to ensure safety)
    if (level === 'High' || (level === 'Medium' && student.riskLevel === 'Low')) {
      student.riskLevel = level;
      // Merge unique triggers
      const newTriggers = new Set([...student.triggers, ...triggers]);
      student.triggers = Array.from(newTriggers);
    }
    
    student.lastActive = Date.now();
    await student.save();

    res.status(201).json({ success: true, entry, riskAssessed: level });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get student's past journal entries
app.get('/api/journal', async (req, res) => {
  try {
    const token = req.headers.authorization;
    let studentId = token;
    
    if (token === 'anon-session') {
      const student = await Student.findOne({ anonymousId: 'Anon-Guest' });
      if (student) studentId = student._id;
    }
    
    // Validate ObjectId if not anon, else if studentId is not set properly return empty
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return res.json([]);
    }
    
    const journals = await Journal.find({ studentId }).sort({ date: -1 });
    res.json(journals);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check for unread counselor messages
app.get('/api/messages', async (req, res) => {
  try {
    let studentId = req.headers.authorization;
    if (studentId === 'anon-session') {
      const student = await Student.findOne({ anonymousId: 'Anon-Guest' });
      if (student) studentId = student._id;
    }
    
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return res.json([]);
    }
    
    const msgs = await Message.find({ studentId, read: false });
    res.json(msgs);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
});


// --- API Endpoints: COUNSELOR DASHBOARD ---

// Get all monitored students
app.get('/api/counselor/students', async (req, res) => {
  try {
    // We only return the anonymous mapping to counselors, NEVER the email hash
    const students = await Student.find({}, 'anonymousId riskLevel triggers lastActive').sort({ lastActive: -1 });
    res.json(students);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send message to student
app.post('/api/counselor/message', async (req, res) => {
  try {
    const { anonymousId, text } = req.body;
    
    const student = await Student.findOne({ anonymousId });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const msg = new Message({ studentId: student._id, text });
    await msg.save();

    res.json({ success: true, message: 'Sent securely' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 MindBridge Backend running on port ${PORT}`));
