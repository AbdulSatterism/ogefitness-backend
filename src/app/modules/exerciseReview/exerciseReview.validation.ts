import { z } from 'zod';

const createExerciseReviewValidation = z.object({
  body: z.object({
    exerciseId: z.string(),
    comment: z.string(),
  }),
});

const updateExerciseReviewValidatioin = z.object({
  body: z.object({
    comment: z.string().optional(),
  }),
});

export const exerciseReviewValidations = {
  createExerciseReviewValidation,
  updateExerciseReviewValidatioin,
};
