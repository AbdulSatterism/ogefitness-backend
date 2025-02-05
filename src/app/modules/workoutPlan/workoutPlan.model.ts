import { Schema, model } from 'mongoose';
import {
  DayWorkout,
  IWorkoutPlan,
  WorkoutSection,
} from './workoutPlan.interface';

const WorkoutSectionSchema = new Schema<WorkoutSection>({
  duration: { type: Number, required: true },
  exercises: { type: [String], required: true },
});

const DayWorkoutSchema = new Schema<DayWorkout>({
  isCompleted: { type: Boolean, required: true },
  day: { type: Number, required: true },
  warmUp: { type: WorkoutSectionSchema, required: true },
  mainWorkout: { type: WorkoutSectionSchema, required: true },
  coolDown: { type: WorkoutSectionSchema, required: true },
});

const WorkoutPlanSchema = new Schema<IWorkoutPlan>({
  planName: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: 'https://i.ibb.co.com/fd0nMfrB/fitness.png' },
  workouts: { type: [DayWorkoutSchema], required: true },
});

export const WorkoutPlan = model<IWorkoutPlan>(
  'WorkoutPlan',
  WorkoutPlanSchema,
);
