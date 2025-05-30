import { z } from 'zod';

const createWorkoutValidation = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    image: z.string().min(1, 'Image is required'),
  }),
});

const updateWorkoutValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const workoutValidations = {
  createWorkoutValidation,
  updateWorkoutValidation,
};
