import mongoose from 'mongoose';

// Student Model
const studentSchema = new mongoose.Schema({
  anonymousId: { type: String, required: true, unique: true },
  emailHash: { type: String, required: true, unique: true }, // We never store raw emails
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  triggers: [{ type: String }],
  lastActive: { type: Date, default: Date.now }
});

export const Student = mongoose.model('Student', studentSchema);

// Journal Model
const journalSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  mood: { type: String, required: true },
  text: { type: String, required: true }, // In a real app, this would be encrypted before saving
  date: { type: Date, default: Date.now },
  promptUsed: { type: String }
});

export const Journal = mongoose.model('Journal', journalSchema);

// Message Model (Counselor to Student)
const messageSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  text: { type: String, required: true },
  read: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

export const Message = mongoose.model('Message', messageSchema);
