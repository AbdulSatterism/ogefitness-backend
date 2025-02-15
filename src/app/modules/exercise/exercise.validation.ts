import { z } from 'zod';

const createExerciseSchema = z.object({
  body: z.object({
    exerciseName: z.string().min(1, 'Exercise name is required'),
    description: z.string().min(1, 'Description is required'),
    gymEquipmentNeeded: z.enum(['yes', 'no']).optional(),
  }),
});

const updateExerciseSchema = z.object({
  body: z.object({
    exerciseName: z.string().optional(),
    description: z.string().optional(),
    gymEquipmentNeeded: z.enum(['yes', 'no']).optional(),
  }),
});

export const exerciseValidations = {
  createExerciseSchema,
  updateExerciseSchema,
};
