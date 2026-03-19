# AI Event Concierge

An AI-powered corporate event planning platform that takes a natural language description of an event and returns a structured venue proposal.

## Live Demo

https://ai-event-concierge-taupe.vercel.app/

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **AI:** Groq API (Llama 3.3 70B)
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel (frontend) + Render (backend)

## Features

- Natural language event input
- AI-generated venue proposals with name, location, cost, and justification
- Persistent search history saved to database
- Responsive design for mobile and desktop

## How to Run Locally

### Prerequisites

- Node.js v18+
- Groq API key (free at console.groq.com)
- Supabase project

### 1. Clone the repository

git clone https://github.com/TusharRajput07/ai-event-concierge.git
cd ai-event-concierge

### 2. Setup Backend

cd server
npm install

Create a .env file inside the server/ folder:
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=5000

npm run dev

### 3. Setup Frontend

cd client
npm install
npm run dev

Open http://localhost:5173 in your browser.

## Database Setup

Run this SQL in your Supabase SQL Editor:

CREATE TABLE proposals (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
user_query TEXT NOT NULL,
venue_name TEXT,
location TEXT,
estimated_cost TEXT,
why_it_fits TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

GRANT ALL ON proposals TO anon;
GRANT ALL ON proposals TO authenticated;
