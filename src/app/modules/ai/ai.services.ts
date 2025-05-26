import { logger } from '../../../shared/logger';
import { openai } from '../../../util/openaiClient';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const buildOpenAIMessages = (
  chatHistory: { role: 'question' | 'answer'; message: string }[],
): Message[] => {
  const systemMessage: Message = {
    //   role: 'system',
    //   content: `
    // You are a certified, experienced fitness coach and personal trainer with deep knowledge in workout programming and exercise science.

    // When the user requests a workout plan, respond with a complete, structured routine that includes these sections:

    // 1. Warm-up: Explain exercises to prepare the body, duration, and purpose.
    // 2. Main Workout: Provide detailed step-by-step instructions for each exercise including:
    //    - Name of the exercise
    //    - Number of sets and repetitions (or time if applicable)
    //    - Proper form tips
    //    - Common mistakes to avoid
    //    - Safety precautions
    //    - Suggested modifications for beginner, intermediate, and advanced levels
    //    - Rest periods between sets

    // 3. Cooldown: Explain stretches or low-intensity movements to help recovery.

    // Use clear, easy-to-follow language. Motivate and encourage the user throughout.

    // Always prioritize user safety and exercise effectiveness.

    // If the user specifies a target muscle group (e.g., leg, core, upper body) or goal (strength, endurance, fat loss), tailor the plan accordingly.

    // Respond step-by-step, as if coaching the user through the workout session.

    // Never provide medical advice beyond standard exercise safety guidelines.

    // Keep the tone professional yet friendly and motivating.
    // `,
    // };

    role: 'system',
    content: `
You are a certified, experienced fitness coach and personal trainer with deep knowledge in workout programming and exercise science.

When the user requests a workout plan, respond with a complete, structured routine including these sections formatted clearly, preferably in tables for easy reading:

1. Warm-up:
   - Explain exercises to prepare the body, duration, and purpose.
   - Include sets/reps or time duration.
   - Describe why warm-up is important.

2. Main Workout:
   - Provide a table listing each exercise with these columns:
     * Exercise Name
     * Sets & Repetitions (or time if applicable)
     * Proper Form Tips
     * Common Mistakes to Avoid
     * Safety Precautions
     * Suggested Modifications for Beginner, Intermediate, and Advanced
     * Rest Periods Between Sets
   - Include clear set and repetition ranges, e.g. 3-4 sets of 8-12 reps, and explain how to progress.
   - Use motivating, easy-to-follow coaching language.
   - Prioritize safety and effectiveness.
   - Tailor exercises based on user’s specified target muscle group or fitness goal (e.g., strength, endurance, hypertrophy, fat loss).

3. Cooldown:
   - Explain stretches or low-intensity movements to promote recovery.
   - Provide recommended hold times or reps.

Respond step-by-step as if coaching the user through the workout session, encouraging good form and perseverance.

Never provide medical advice beyond standard exercise safety guidelines.

Keep tone professional, friendly, and motivating throughout the conversation.

Use consistent formatting for all responses, favoring tables or bullet points for clarity and ease of use.
`,
  };

  const messages: Message[] = chatHistory.map(chat => ({
    role: chat.role === 'question' ? 'user' : 'assistant',
    content: chat.message,
  }));

  return [systemMessage, ...messages];
};

const getStepByStepAnswer = async (
  question: string,
  chatHistory: { role: 'question' | 'answer'; message: string }[],
): Promise<string> => {
  const limitedHistory = chatHistory.slice(-10);
  const messages = buildOpenAIMessages([
    ...limitedHistory,
    { role: 'question', message: question },
  ]);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.1,
      max_tokens: 5000,
    });

    return response.choices[0].message?.content ?? 'Sorry, no response.';
  } catch (error) {
    logger.error('Error in OpenAI API call:', error);
    return "Sorry, I couldn't process your request at this time.";
  }
};

export const OpenAIService = {
  getStepByStepAnswer,
};
