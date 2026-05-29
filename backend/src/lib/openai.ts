import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export const generateBudgetInsights = async (budgetData: any) => {
  if (!openai) {
    console.warn('OpenAI API key is missing. Skipping insights.');
    return { summary: "AI insights are currently unavailable.", alerts: [], suggestions: [], nextMonthBudget: {}, savingsScore: 0 };
  }
  const openaiPrompt = `
    You are a personal finance advisor for an Indian user.
    Analyze this monthly budget data and provide insights in JSON format.

    Budget Data: ${JSON.stringify(budgetData)}

    Return a JSON object with:
    {
      "summary": "one line overall summary",
      "alerts": ["overspending warning 1", "warning 2"],
      "suggestions": ["saving tip 1", "tip 2", "tip 3"],
      "nextMonthBudget": {
        "Food": 4500,
        "Transport": 2000
      },
      "savingsScore": 75  // score out of 100
    }
    `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: openaiPrompt }],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0].message.content || '{}';
  // Strip markdown code blocks if present
  const cleanedJson = content.replace(/```json\n?|```/g, '').trim();
  
  try {
    return JSON.parse(cleanedJson);
  } catch (err) {
    console.error('LLM JSON Parse Error:', err, 'Content:', content);
    return {};
  }
};
