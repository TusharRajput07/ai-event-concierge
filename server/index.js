import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Init Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

// Init Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// POST /api/propose
app.post("/api/propose", async (req, res) => {
  const { query } = req.body;

  if (!query) return res.status(400).json({ error: "Query is required" });

  try {
    const prompt = `
You are a corporate event planning expert with knowledge of unique and diverse venues worldwide.
A user wants to plan an event with this description:
"${query}"

Suggest ONE ideal venue that perfectly matches the requirements. Be creative and specific — suggest real, lesser-known gems, not just the most obvious choices. Vary your suggestions across different regions of the world.

Respond ONLY with a valid JSON object in this exact format, no extra text, no markdown, no backticks:
{
  "venue_name": "Name of the venue",
  "location": "City, Country",
  "estimated_cost": "$X,XXX - $X,XXX",
  "why_it_fits": "2-3 sentences explaining why this venue is perfect for the event"
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content;

    // Clean and parse JSON
    const cleaned = text.replace(/```json|```/g, "").trim();
    const proposal = JSON.parse(cleaned);

    // Save to Supabase
    const { error } = await supabase.from("proposals").insert({
      user_query: query,
      venue_name: proposal.venue_name,
      location: proposal.location,
      estimated_cost: proposal.estimated_cost,
      why_it_fits: proposal.why_it_fits,
    });

    if (error) console.error("Supabase error:", error);

    res.json(proposal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET /api/history
app.get("/api/history", async (req, res) => {
  const { data, error } = await supabase
    .from("proposals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
