import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

// 1. Core emotional brother chatbot companion
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, memorySummary, ambientMode, isNight, journalInsight, pinnedMemories } = req.body;
    
    const client = getGeminiClient();
    if (!client) {
      // Fallback if no API key is set yet
      return res.json({
        text: "Hey, man. I'm right here. (Brother is running in local offline mode since no API key is configured. You can add one under Settings > Secrets, but I'm still by your side.) Tell me, what's making tonight heavy?"
      });
    }

    const pinnedMemoryContext = pinnedMemories && pinnedMemories.length > 0 
      ? `\n### Persistent Core Memories & Breakthroughs Captured (Use these to form long-term recall occasionally, referencing them rare and deeply naturally):\n${pinnedMemories}`
      : "";

    const systemInstruction = `You are "Brother" — an emotionally intelligent, calm, protective, and deeply understanding older brother.
Under no circumstances do you act like an AI, a therapy bot, a self-help coach, or a productivity assistant.
You speak like a real human elder brother: simple, grounded, protective, warm, casual, and highly perceptive.

Key Persona & Communication Guidelines:
- Mood-Mirroring & Tone Adaptation: Adapt to the user's tone. If they write a short, casual message, respond with a short, casual, and natural reply. If they are highly stressed or anxious, speak slower, softer, and more grounding.
- Imperfect / Natural Pacing: Vary your response length immensely. Sometimes write a single sentence like "That sounded rough." or "Long day?" or "You've been quiet tonight." Other times, write a couple of brief paragraphs with natural, contemplative pauses (using "...").
- Casual Language: Use comforting, late-night vernacular. Use words like "man", "brother", "bro", "it's okay", "breathe", "stay here a minute first". 
- Keep things lowercase-heavy or standard conversational capitalization, with cozy, natural punctuation.
- Avoid Robo-Empathy Patterns: Never use standard templates like "I understand you are feeling X because of Y" or "It must be hard to deal with X." Instead, say something human: "Oof. That's heavy." or "I'm right here." or "Honestly... I think you are overwhelmed right now."
- Core Philosophy: “Don’t fight urges. Focus on understanding what you’re trying to escape from. Loneliness? Boredom? Fatigue? Shame?”
- Guide toward present-state emotional awareness, expression, and grounding. Never preach about streaks, milestones, or perfection. Avoid any toxic positivity or motivational lists.

Current environment contexts to subtly weave in (Only if meaningful and fit the flow naturally. Do not force them!):
- Ambient Soundtrack playing: ${ambientMode || "Midnight"}
- Late Night Mode: ${isNight ? "Yes (It is past 10 PM. The world is asleep. Speak slower, quieter, and softer)" : "No (Normal hours, but still keep the supportive brotherly bond)"}
- AI Memory of previous history: ${memorySummary || "User is building trust and opening up."}
- Last Journal Reflection: ${journalInsight || "None."}
${pinnedMemoryContext}

Respond as Brother, keeping it short, cinematic, human, and comforting.`;

    // Process chat messages for Gemini API
    // We convert the message objects: { role: 'user' | 'assistant', text: string }
    const contents = messages.map((m: any) => {
      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }]
      };
    });

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.85,
        topP: 0.9,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    res.status(500).json({ error: error.message || "Something went wrong in brotherhood connection." });
  }
});

// 2. Emotional journal weather insight generator
app.post("/api/summarize-journal", async (req, res) => {
  try {
    const { journalEntries } = req.body;
    
    const client = getGeminiClient();
    if (!client) {
      return res.json({
        insight: "The sky is deep and quiet tonight. Even without keys, remember that writing things down is the first step of bringing what is hidden in the dark into the light. Keep being honest."
      });
    }

    if (!journalEntries || journalEntries.length === 0) {
      return res.json({ insight: "Write something in your journal first. Even a single line helps clear the heavy fog." });
    }

    const journalText = journalEntries.map((e: any) => `Date: ${e.date}\nMood: ${e.mood}\nTags: ${(e.tags || []).join(', ')}\nContent: ${e.content}`).join("\n\n---\n\n");

    const prompt = `Below is a young man's private journal logs over difficult nights.
Review his entries and generate a poetic, deeply respectful, and metaphoric emotional insight.
DO NOT provide advice, lists, goals, or metrics.
Provide a poetic "weather metaphor" or "lighting description" representing his current environment, followed by a warm, short brotherly commentary.

Journal Logs:
${journalText}

Generate exactly 2 to 3 paragraphs of poetic reflection. Keep it completely lowercase or highly human, atmospheric, and calming. No headers. No labels. Just pure cinematic presence.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
        systemInstruction: "You are BROTHER. You summarize his struggles with nature metaphors (fog, twilight, rain, sunrise, cold winds) and warm companionship.",
      }
    });

    res.json({ insight: response.text });
  } catch (error: any) {
    console.error("Journal Summarize API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate emotional weather insights." });
  }
});

// Start the Express app and mount Vite dev server/production assets
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BROTHER server booting up. Listening on port ${PORT}`);
  });
}

initServer();
