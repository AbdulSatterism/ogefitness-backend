import { z } from 'zod';

const createWorkoutSectionSchema = z.object({
  duration: z.number().min(1, 'Duration must be a positive number'),
  exercises: z.array(z.string()).nonempty('Exercises array cannot be empty'),
});

const createDayWorkoutSchema = z.object({
  isCompleted: z.boolean(),
  day: z.number().min(1, 'Day must be a positive number'),
  warmUp: createWorkoutSectionSchema,
  mainWorkout: createWorkoutSectionSchema,
  coolDown: createWorkoutSectionSchema,
});

const createWorkoutPlanValidationSchema = z.object({
  body: z.object({
    planName: z.string().min(1, 'Plan name is required'),
    description: z.string().min(1, 'Description is required'),
    workouts: z
      .array(createDayWorkoutSchema)
      .nonempty('Workouts array cannot be empty'),
  }),
});

const updateWorkoutSectionSchema = z.object({
  duration: z.number().optional(),
  exercises: z.array(z.string()).optional(),
});

const updateDayWorkoutSchema = z.object({
  isCompleted: z.boolean().optional(),
  day: z.number().optional(),
  warmUp: updateWorkoutSectionSchema.optional(),
  mainWorkout: updateWorkoutSectionSchema.optional(),
  coolDown: updateWorkoutSectionSchema.optional(),
});

const updateWorkoutPlanValidationSchema = z.object({
  body: z.object({
    planName: z.string().optional(),
    description: z.string().optional(),
    workouts: z.array(updateDayWorkoutSchema).optional(),
  }),
});

export const workoutPlanValidations = {
  createWorkoutPlanValidationSchema,
  updateWorkoutPlanValidationSchema,
};
