import { z } from 'zod';

const createNutritionValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    calories: z.number().min(0, 'Calories must be a non-negative number'),
    protein: z.number().min(0, 'Protein must be a non-negative number'),
    carbohydrate: z
      .number()
      .min(0, 'Carbohydrate must be a non-negative number'),
    fat: z.number().min(0, 'Fat must be a non-negative number'),
    fiber: z.number().min(0, 'Fiber must be a non-negative number'),
    rating: z.number().min(0, 'Rating must be between 0 and 5'),
    category: z.array(z.string()).nonempty('category cannot be empty'),
    ingredients: z.array(z.string()).nonempty('Ingredients cannot be empty'),
    instruction: z.string().min(1, 'Instruction is required'),
  }),
});

const updateNutritionValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    calories: z.number().optional(),
    protein: z.number().optional(),
    carbohydrate: z.number().optional(),
    fat: z.number().optional(),
    fiber: z.number().optional(),
    rating: z.number().optional(),
    category: z.array(z.string()).optional(),
    ingredients: z.array(z.string()).optional(),
    instruction: z.string().optional(),
  }),
});

export const nutritionValidations = {
  createNutritionValidationSchema,
  updateNutritionValidationSchema,
};
