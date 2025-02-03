import { z } from 'zod';

const createExerciseSchema = z.object({
  body: z.object({
    exerciseName: z.string().min(1, 'Exercise name is required'),
    description: z.string().min(1, 'Description is required'),
  }),
});

const updateExerciseSchema = z.object({
  body: z.object({
    exerciseName: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const exerciseValidations = {
  createExerciseSchema,
  updateExerciseSchema,
};
