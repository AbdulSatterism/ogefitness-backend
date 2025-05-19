import { z } from 'zod';

const mealItemSchema = z.object({
  name: z.string(),
  quantity: z.string(),
});

const mealDetailSchema = z.object({
  items: z.array(mealItemSchema),
  time: z.string(),
});

const dailyMealPlanSchema = z.object({
  day: z.number(),
  breakfast: mealDetailSchema,
  midMorningSnack: mealDetailSchema,
  lunch: mealDetailSchema,
  afternoonSnack: mealDetailSchema,
  dinner: mealDetailSchema,
  calories: z.number(),
  carb: z.number(),
  protein: z.number(),
  fiber: z.number(),
  fat: z.number(),
  isCompleted: z.boolean().default(false),
});

const createMealPlanValidationSchema = z.object({
  body: z.object({
    planName: z.string(),
    plans: z.array(dailyMealPlanSchema),
  }),
});

export const mealPlanValidations = {
  createMealPlanValidationSchema,
};
