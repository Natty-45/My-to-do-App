import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';

const HF_TOKEN = process.env.HF_TOKEN || '';

export const generateTodos = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ message: 'A description of your task idea is required.' });
    }

    const systemPrompt = `You are a smart todo list assistant. Based on the user's description, generate a structured list of todos.
    
For each todo, provide:
- title: A clear task title
- description: A brief description
- priority: One of "low", "medium", "high", or "urgent"
- category: A category like "Work", "Personal", "Study", "Health", "Finance", "Shopping", "Home"
- tags: An array of 1-3 relevant tag strings

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "todos": [
    {
      "title": "Task title",
      "description": "Brief description",
      "priority": "medium",
      "category": "Work",
      "tags": ["tag1", "tag2"]
    }
  ]
}

Generate 1-5 todos based on the complexity of the user's description.`;

    // Use Hugging Face free inference API
    // No token required for basic access (rate-limited)
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (HF_TOKEN) {
      headers['Authorization'] = `Bearer ${HF_TOKEN}`;
    }

    const hfResponse = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3',
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          inputs: `<s>[INST] ${systemPrompt}\n\nUser request: ${prompt} [/INST]`,
          parameters: { max_new_tokens: 2000, temperature: 0.7 },
        }),
      }
    );

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error('HuggingFace error:', hfResponse.status, errorText);
      
      // If it's a model loading error, the model is loading (first request)
      if (errorText.includes('loading')) {
        return res.status(503).json({
          message: 'AI model is loading. Please wait a moment and try again.',
          retryAfter: 20,
        });
      }

      // If unauthenticated, guide them
      if (hfResponse.status === 403) {
        return res.status(500).json({
          message: 'AI service needs a free token.',
          hint: 'Get a free Hugging Face token (1 min): https://huggingface.co/settings/tokens',
          instructions: 'Add HF_TOKEN=your_token to server/.env and restart. OR just keep trying - it works without a token too (rate limited).',
        });
      }

      return res.status(500).json({
        message: 'AI service temporarily unavailable. Please try again.',
        error: `HTTP ${hfResponse.status}`,
      });
    }

    const hfData = await hfResponse.json();
    
    // Parse the response
    let rawText = '';
    if (Array.isArray(hfData)) {
      rawText = hfData[0]?.generated_text || '';
    } else if (hfData?.generated_text) {
      rawText = hfData.generated_text;
    }

    if (!rawText) {
      return res.status(500).json({ message: 'AI returned empty response. Try again.' });
    }

    // Extract response after the instruction
    const responseText = rawText.includes('[/INST]') 
      ? rawText.split('[/INST]')[1].trim() 
      : rawText.trim();

    let cleaned = responseText.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```(?:json)?\n?/g, '').trim();
    }

    // Try to find JSON if it's embedded in text
    const jsonMatch = cleaned.match(/\{[\s\S]*"todos"[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }

    const parsed = JSON.parse(cleaned);

    if (!parsed.todos || !Array.isArray(parsed.todos)) {
      return res.status(500).json({ message: 'AI returned unexpected format. Try again.' });
    }

    return res.status(200).json({ message: 'Todos generated successfully', data: parsed.todos });
  } catch (error: any) {
    console.error('Error generating todos:', error);
    return res.status(500).json({
      message: 'Failed to generate todos. Try again.',
      error: error.message,
    });
  }
};
