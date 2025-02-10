import { z } from 'zod';

const addWorkPlanValidationSchema = z.object({
  body: z.object({
    workoutPlanId: z.string(),
  }),
});

export const userWorkPlanValidations = {
  addWorkPlanValidationSchema,
};
