import { z } from 'zod';

const dailyMealPlanSchema = z.object({
  day: z.number(),
  breakfast: z.string(),
  midMorningSnack: z.string(),
  lunch: z.string(),
  afternoonSnack: z.string(),
  dinner: z.string(),
  calories: z.number(),
  carb: z.number(),
  protein: z.number(),
  fiber: z.number(),
  fat: z.number(),
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
