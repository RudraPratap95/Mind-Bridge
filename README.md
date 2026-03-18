# MindBridge AI — Your Mental Wellness Companion 🌷

MindBridge AI is a modern, premium web application designed to bridge the gap between students and mental health support. It provides a safe, private space for students to journal their thoughts, track their emotional well-being, and access immediate calming tools, while allowing college counselors to monitor campus-wide emotional trends and intervene in high-risk situations anonymously.

## ✨ Core Features

### 🧘 Calm Zone
A dedicated space for immediate relief:
- **Breathing Exercises**: Box Breathing, 4-7-8 Technique, and Deep Belly Breathing with interactive visualizers.
- **Guided Meditation**: 5-minute mindful check-in audio player.
- **Ambient Sounds**: Curated sounds like Rain, Forest, and Ocean to aid relaxation.
- **Session Timer**: Integrated countdown for focused mindfulness.

### 📝 Secure Journaling & AI Insights
- **Encrypted Space**: Private journaling environment with a focus on trust and security.
- **Mood Calendar**: A color-coded monthly grid that visualizes emotional patterns over time.
- **Automated Risk Detection**: Intelligent scanning for high-risk language that prompts immediate crisis support.
- **Trend Analysis**: Data-driven insights identifying patterns like weekly mood dips or exam-week stressors.

### 🛡️ Counselor Dashboard
- **Anonymous Monitoring**: Real-time monitoring of student risk levels without compromising privacy.
- **Intervention Tools**: Direct secure messaging between counselors and students.
- **Campus KPIs**: High-level metrics showing Total Students Monitored, High Risk Students, and Intervention Need Rates.

## 🎨 Design Aesthetic: "Midnight Bloom"
The application uses a custom-crafted high-fidelity theme:
- **Background**: Deep Midnight Navy (#0A0E1A)
- **Accents**: Vibrant Violet (#7C3AED) and Electric Cyan (#06B6D4)
- **Typography**: Elegant Playfair Display (Headings) and clean DM Sans (Body)
- **Data Metrics**: Precise JetBrains Mono for timestamps and stats.

## 🛠️ Tech Stack
**Frontend**
- React (Vite)
- Vanilla CSS (Custom Design System)
- Lucide Icons (SVG based)

**Backend**
- Node.js & Express
- MongoDB Atlas (Cloud Database)
- Mongoose (ODM)
- SHA-256 Hashing (Privacy-first identity mapping)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas Account

### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=your_mongodb_atlas_connection_string
   PORT=5000
   SALT=your_random_hashing_salt
   ```
4. Start the server:
   ```bash
   node server.js
   ```

### Frontend Setup
1. Navigate to the root directory:
   ```bash
   cd ..
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173`

## 📂 Project Structure
```text
mindbridge-ai/
├── backend/            # Express server, Mongoose models, API routes
├── src/
│   ├── components/     # UI Components (tabs, modals, dashboard)
│   ├── data/           # Affirmations, tips, and constants
│   ├── App.jsx         # Root component & Routing logic
│   └── index.css       # Midnight Bloom Design System
├── public/             # Static assets
└── package.json        # Dependencies
```

## 🤝 Contributing
This project was built for a 24-hour presentation challenge. Contributions to enhance the NLP risk detection patterns or end-to-end encryption layers are welcome!
