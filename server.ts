import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // AI Assistant endpoint using Gemini API
  app.post('/api/ai/suggest', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.status(400).json({
          error: 'Gemini API key is not configured in settings.',
        });
      }

      const { prompt, type } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const ai = new GoogleGenAI({ apiKey });

      let systemInstruction = '';
      if (type === 'tasks') {
        systemInstruction = `You are a productivity expert. Break down the user's goal into 3 to 5 actionable subtasks or individual tasks.
Return ONLY valid JSON array with objects containing:
- title (string)
- description (string)
- priority ("low" | "medium" | "high" | "epic")
- points (number: low=10, medium=25, high=50, epic=100)
- category (string)
No markdown formatting outside JSON.`;
      } else if (type === 'rewards') {
        systemInstruction = `You are a motivation coach. Generate 3 creative custom reward ideas tailored to the user's interest or theme.
Return ONLY valid JSON array with objects containing:
- title (string)
- description (string)
- pointsCost (number between 50 and 1000)
- icon (emoji string like ☕, 🎮, 🎬, 🚴, 🍕)
- category (string)
No markdown formatting outside JSON.`;
      } else {
        systemInstruction = `You are a minimalist note-taking assistant. Refine or structure the user's note with bullet points and clear sections in markdown.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const text = response.text || '';
      res.json({ result: text });
    } catch (err: unknown) {
      console.error('AI Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate AI suggestions';
      res.status(500).json({ error: errorMessage });
    }
  });

  // Vite development middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
