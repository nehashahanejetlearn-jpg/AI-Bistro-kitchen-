import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize server-side Gemini client
  const apiKey = process.env.GEMINI_API_KEY || '';
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // 1. Generate Meal Plan endpoint
  app.post('/api/generate-meal-plan', async (req: Request, res: Response) => {
    try {
      const {
        prompt = '',
        allergens = [],
        dietaryPreference = 'Balanced Gourmet',
        familyMembers = 4,
        maxCookingTime = 30,
        budgetCap = 3500,
        pantryItems = [],
      } = req.body;

      if (!ai) {
        return res.json({
          status: 'success',
          source: 'local_engine',
          message: 'Generated with BistroChef Rule-Based Culinary Engine (Configure GEMINI_API_KEY in Secrets for live AI model).',
        });
      }

      const systemPrompt = `You are Chef Auguste, the world-class executive chef of BistroChef AI Companion.
Your task is to generate or customize a family meal plan tailored to the user's specific dietary requests, allergens to avoid, and available pantry stock.
Always strictly avoid any listed allergens: ${allergens.join(', ') || 'None'}.
Family size: ${familyMembers} people.
Maximum weekday cook time: ${maxCookingTime} minutes.
Dietary preference: ${dietaryPreference}.
Target weekly budget: ₹${budgetCap} / $${Math.round(budgetCap / 85)}.
Key available pantry items to prioritize: ${pantryItems.slice(0, 8).join(', ') || 'Fresh seasonal staples'}.

Return a JSON array of 7 day meal plans (Monday to Sunday).
Each day must have:
- day: string ("Monday", etc.)
- dateStr: string (e.g. "Oct 26")
- dailyPantryMatch: number (between 75 and 98)
- totalCalories: number (around 1400-1800)
- breakfast: { title, description, prepTime, cookTime, servings, calories, protein, carbs, fat, allergens: string[], tags: string[], chefTips, estimatedCost }
- lunch: { title, description, prepTime, cookTime, servings, calories, protein, carbs, fat, allergens: string[], tags: string[], chefTips, estimatedCost }
- dinner: { title, description, prepTime, cookTime, servings, calories, protein, carbs, fat, allergens: string[], tags: string[], chefTips, estimatedCost }
- snack: { title, description, prepTime, cookTime, servings, calories, protein, carbs, fat, allergens: string[], tags: string[], chefTips, estimatedCost }

Only return valid JSON without markdown wrapping.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `User Instructions: "${prompt}". Please generate the complete 7-day family meal plan strictly respecting allergens and preferences.`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const rawText = response.text || '';
      try {
        const parsedPlan = JSON.parse(rawText);
        return res.json({
          status: 'success',
          source: 'gemini-3.8-flash',
          plan: parsedPlan,
        });
      } catch (e) {
        return res.json({
          status: 'partial',
          source: 'gemini-3.8-flash',
          rawText,
        });
      }
    } catch (error: any) {
      console.error('Error generating meal plan with Gemini:', error);
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to generate meal plan',
      });
    }
  });

  // 2. Chef Auguste Chat Assistant endpoint
  app.post('/api/chef-chat', async (req: Request, res: Response) => {
    try {
      const { message = '', history = [], userPreferences = {} } = req.body;

      if (!ai) {
        return res.json({
          reply: `Welcome to the kitchen! As your BistroChef culinary companion, I recommend focusing on fresh, seasonal ingredients. With your preference for ${userPreferences.dietaryStyle || 'family-friendly'} dining, you can easily substitute heavy ingredients with silky purees or Greek yogurt. Let me know what dish you are preparing today!`,
          source: 'local_engine',
        });
      }

      const systemInstruction = `You are Chef Auguste, the warm, articulate, Michelin-star trained culinary advisor of BistroChef AI Companion.
You specialize in family cooking, smart ingredient substitutions (dairy-free, gluten-free, nut-free), reducing food waste, fast 15-30 minute weeknight dinner hacks, and kid-approved nutrition.
Tone: Warm, encouraging, authoritative yet approachable, passionate about food flavor and technique.
Avoid lengthy filler; provide practical, actionable chef advice with clear steps, ingredient proportions, and sensory cues (e.g. "when golden brown and fragrant").`;

      const chatContents = [
        ...history.map((h: any) => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        })),
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: chatContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({
        reply: response.text || 'Bon appétit! How else may I assist with your meal prep today?',
        source: 'gemini-3.8-flash',
      });
    } catch (error: any) {
      console.error('Chef chat error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to consult Chef Auguste',
      });
    }
  });

  // 3. Smart Pantry Suggestions (What to cook from in-stock expiring items)
  app.post('/api/pantry-smart-ideas', async (req: Request, res: Response) => {
    try {
      const { expiringItems = [], allergensToAvoid = [] } = req.body;

      if (!ai) {
        return res.json({
          ideas: [
            {
              title: 'Artisan Skillet Frittata with Wilted Greens',
              prepTime: 15,
              ingredientsUsed: expiringItems.slice(0, 3),
              description: 'Quick oven-baked egg frittata utilizing your immediate produce and herbs.',
            },
            {
              title: 'Rustic Pan-Roasted Medley Bowl',
              prepTime: 20,
              ingredientsUsed: expiringItems.slice(0, 4),
              description: 'Crispy skillet tossed grains and caramelized vegetables topped with lemon herb drizzle.',
            },
          ],
        });
      }

      const prompt = `Based on these expiring pantry items: ${expiringItems.join(', ')}, suggest 3 rapid, delicious meals that eliminate food waste while strictly avoiding: ${allergensToAvoid.join(', ') || 'none'}.
Return JSON array with items having: { title: string, prepTime: number, ingredientsUsed: string[], description: string, chefTip: string }.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      try {
        const parsed = JSON.parse(response.text || '[]');
        return res.json({ ideas: parsed, source: 'gemini-3.8-flash' });
      } catch (e) {
        return res.json({ ideas: [], raw: response.text });
      }
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Mount Vite middleware in dev or static files in production
  if (isProd) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BistroChef server active on port ${PORT}`);
  });
}

startServer();
