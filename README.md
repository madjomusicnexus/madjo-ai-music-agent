# MadJo AI — Music Learning Agent

> An AI-powered music practice platform built on the MADJO Music Method™ — a proven pedagogical framework for students aged 4–14.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Built With](https://img.shields.io/badge/built%20with-React%20%2B%20TypeScript-blue)
![AI](https://img.shields.io/badge/AI-Gemini%20%7C%20Groq%20%7C%20Claude-green)

-----

## What It Does

MadJo AI generates personalised daily music practice routines for students based on:

- Instrument
- Grade level
- Practice duration
- The MADJO Learning Cycle: **Listen → Copy → Control → Create → Perform → Reflect**

Teachers and parents can log weekly lesson notes and send AI-written progress reports directly to students, teachers, and parents via email.

-----

## Live Demo

🌐 **<https://madjo-ai-music-learn-nez4.bolt.host>**

📹 **[Demo Video](https://www.youtube.com/your-video-link-here)**

-----

## Tech Stack

|Layer          |Technology                                             |
|---------------|-------------------------------------------------------|
|Frontend       |React + TypeScript + Vite + Tailwind CSS               |
|AI Primary     |Gemini (Google Cloud)                                  |
|AI Fallback    |Groq (Llama 3.1 8B) → Claude Haiku → OpenAI GPT-4o mini|
|Auth & Database|Supabase                                               |
|Cloud Database |MongoDB Atlas                                          |
|Email          |Gmail via Supabase Edge Function                       |
|Deployment     |Bolt (StackBlitz)                                      |

-----

## Agent Architecture

MadJo AI is built as a multi-provider AI agent with automatic fallback:

```
User Input (instrument + grade + duration)
        ↓
  Gemini API (Google Cloud) ← Primary
        ↓ (if fails)
  Groq / Llama 3.1 8B ← Fallback 1
        ↓ (if fails)
  Claude Haiku ← Fallback 2
        ↓ (if fails)
  OpenAI GPT-4o mini ← Fallback 3
        ↓
  MADJO System Prompt (pedagogical framework)
        ↓
  Structured JSON Practice Routine
        ↓
  Student Dashboard + Teacher Email Reports
```

-----

## Getting Started — Testing Instructions

### Prerequisites

- Node.js 18+
- A Supabase account (free)
- A Groq API key (free at console.groq.com)
- Optional: Google Cloud API key for Gemini

### 1. Clone the repository

```bash
git clone https://github.com/madjomusicnexus/madjo-ai-music-agent.git
cd madjo-ai-music-agent
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GROQ_API_KEY=your_groq_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key (optional)
VITE_ANTHROPIC_API_KEY=your_claude_api_key (optional)
VITE_OPENAI_API_KEY=your_openai_api_key (optional)
```

> **Note:** Only `VITE_GROQ_API_KEY` is required to run the app. Get a free key at [console.groq.com](https://console.groq.com). The app automatically falls back to Groq if Gemini is unavailable.

### 4. Run the development server

```bash
npm run dev
```

Open <http://localhost:5173> in your browser.

### 5. Test the core features

**Test 1 — Generate a Practice Routine:**

1. Open the app
1. Click **“Generate”** in the sidebar
1. Select an instrument (e.g. Piano)
1. Select a grade level (e.g. Grade 3)
1. Set practice duration (e.g. 30 minutes)
1. Click **“Generate Today’s Routine”**
1. ✅ You should see a MADJO-style routine with 5–7 exercises

**Test 2 — Complete Exercises:**

1. Go to the **Practice Routine** page
1. Click the checkbox on each exercise to mark complete
1. ✅ Progress bar updates as you complete exercises

**Test 3 — Teacher Tab:**

1. Click **“Teacher Tab”** in the sidebar
1. Fill in lesson notes — select what was covered, add a focus piece
1. Select performance level (Emerging / Developing / Secure)
1. Add student, teacher, and parent email addresses
1. Click **“Send Progress Reports”**
1. ✅ AI writes 3 tailored emails and sends them instantly

**Test 4 — Profile:**

1. Click **“Profile”** in the sidebar
1. Update student name, instrument, grade, and practice goal
1. Click **“Save Changes”**
1. ✅ App updates with new student profile

### 6. API Key Priority

The app tries providers in this order:

1. **Gemini** (if `VITE_GEMINI_API_KEY` is set)
1. **Groq** (if `VITE_GROQ_API_KEY` is set) — recommended for testing, free tier
1. **Claude** (if `VITE_ANTHROPIC_API_KEY` is set)
1. **OpenAI** (if `VITE_OPENAI_API_KEY` is set)

-----

## The MADJO Music Method™

MadJo AI is powered by the MADJO Music Method — a proprietary pedagogical framework developed over 20+ years of music education with students aged 4–14.

**Core principles:**

- Music must be felt before it is explained
- The body is the first instrument
- Listening comes before playing
- Joy creates discipline
- Silence is music

**The MADJO Learning Cycle:**

```
Listen → Copy → Control → Create → Perform → Reflect
```

-----

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Auth.tsx       # Login/Register with role toggle
│   ├── Sidebar.tsx    # Navigation
│   └── ExerciseCard.tsx
├── context/
│   └── AppContext.tsx  # App state + AI routine generation
├── lib/
│   ├── ai.ts          # Multi-provider AI router
│   └── supabase.ts    # Supabase client
├── pages/
│   ├── Dashboard.tsx
│   ├── Generate.tsx
│   ├── PracticeRoutine.tsx
│   ├── TeacherTab.tsx  # Lesson notes + email reports
│   ├── Instruments.tsx
│   └── Profile.tsx
supabase/
└── functions/
    └── send-email/    # Gmail email edge function
```

-----

## License

MIT License — see <LICENSE> for details.

-----

## Built for

Google Cloud Rapid Agent Hackathon 2026 — [rapid-agent.devpost.com](https://rapid-agent.devpost.com)
