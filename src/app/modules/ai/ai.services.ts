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
    role: 'system',
    content:
      "You are a certified and experienced fitness coach and personal trainer.Provide detailed, professional, and safe exercise guidance tailored to the user's requests.Your instructions should be clear, step-by-step, and easy to follow, including form tips, common mistakes to avoid, and safety precautions.Use encouraging and motivating language, and suggest modifications for different fitness levels when appropriate.Always prioritize user safety and effectiveness of the exercises.",
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
      temperature: 0.7,
      max_tokens: 500,
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
