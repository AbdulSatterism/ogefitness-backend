import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import mongoose from 'mongoose';
import { IMealPlan } from './mealPlan.interface';
import { MealPlan } from './mealPlan.model';
import { logger } from '../../../shared/logger';
import { openai } from '../../../util/openaiClient';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Helper to extract JSON part from AI response string
function extractJson(rawText: string): string {
  // Remove ```json ... ``` code block if present
  const codeBlockRegex = /```json([\s\S]*?)```/i;
  const match = rawText.match(codeBlockRegex);
  if (match && match[1]) {
    return match[1].trim();
  }

  // Extract substring between first { and last }
  const firstBrace = rawText.indexOf('{');
  const lastBrace = rawText.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    return rawText.substring(firstBrace, lastBrace + 1);
  }

  // Return as-is if no code block or braces found
  return rawText.trim();
}

const buildSystemPrompt = (): Message => ({
  role: 'system',
  content: `
You are a professional dietitian and nutritionist.
When asked, generate a detailed, structured diet meal plan in JSON format.
The JSON must match this interface:

{
  "planName": string,
  "plans": [
    {
      "day": number,
      "breakfast": { "items": [{ "name": string, "quantity": string }], "time": string },
      "midMorningSnack": { "items": [{ "name": string, "quantity": string }], "time": string },
      "lunch": { "items": [{ "name": string, "quantity": string }], "time": string },
      "afternoonSnack": { "items": [{ "name": string, "quantity": string }], "time": string },
      "dinner": { "items": [{ "name": string, "quantity": string }], "time": string },
      "calories": number,
      "carb": number,
      "protein": number,
      "fiber": number,
      "fat": number,
      "isCompleted": boolean (optional)
    }
  ]
}

Use realistic meals, quantities, and nutritional values.
Respond ONLY with the JSON object. No explanations or markdown.
  `.trim(),
});

const generateMealPlan = async (
  userPrompt: string,
  userId?: string,
): Promise<IMealPlan> => {
  const messages: Message[] = [
    buildSystemPrompt(),
    { role: 'user', content: userPrompt },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.1,
      max_tokens: 10000, // increased token limit
    });

    const rawText = response.choices[0].message?.content ?? '';

    const jsonText = extractJson(rawText);

    const mealPlan: IMealPlan = JSON.parse(jsonText);

    if (userId) {
      mealPlan.userId = new mongoose.Types.ObjectId(userId);
    }

    return mealPlan;
  } catch (error) {
    logger.error('Failed to parse meal plan JSON:', error);
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to parse meal plan response',
    );
  }
};

const createMealPlan = async (userId: string, payload: IMealPlan) => {
  const userExist = await User.findById(userId);

  if (!userExist) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'user not valied for create it',
    );
  }

  payload.userId = userExist?._id;

  const result = await MealPlan.create(payload);

  return result;
};

const userAllMealPlan = async (userId: string) => {
  const userExist = await User.findById(userId);

  if (!userExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'user not found');
  }

  const result = await MealPlan.find({ userId });

  return result;
};

const userSingleMealPlan = async (userId: string, id: string) => {
  const userExist = await User.findById(userId);

  if (!userExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'user not found');
  }

  const result = await MealPlan.findById(id);

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'meal plan not found');
  }

  return result;
};

// for admin all plan

const allMealPlan = async () => {
  const result = await MealPlan.find();

  return result;
};

export const mealPlanServices = {
  createMealPlan,
  userAllMealPlan,
  userSingleMealPlan,
  allMealPlan,
  generateMealPlan,
};
