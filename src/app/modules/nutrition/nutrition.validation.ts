import { z } from 'zod';

const createNutritionValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string(),
    password: z.string().min(8, 'Password must have at least 8 characters'),
  }),
});

// const updateUserProfileSchema = z.object({
//   name: z.string().optional(),
//   phone: z.string().optional(),
//   country: z.string().optional(),
//   injury: z.string().optional(),
//   age: z.number().optional(),
//   height: z.number().optional(),
//   weight: z.number().optional(),
//   gender: z.enum(['MALE', 'FEMALE', 'OTHERS']).optional(),
//   fitnessLevel: z.enum(['BASIC', 'INTERMEDIATE', 'ADVANCED']).optional(),
// });

export const nutritionValidations = {};
