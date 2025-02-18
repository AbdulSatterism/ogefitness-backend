import { Schema, model } from 'mongoose';
import {
  DayWorkout,
  IWorkoutPlan,
  WorkoutSection,
} from './temporaryWorkout.interface';

const WorkoutSectionSchema = new Schema<WorkoutSection>({
  duration: { type: Number, required: true },
  exercises: { type: [Schema.Types.ObjectId], ref: 'Exercise', required: true },
});

const DayWorkoutSchema = new Schema<DayWorkout>({
  isCompleted: { type: Boolean, required: true },
  day: { type: Number, required: true },
  warmUp: { type: WorkoutSectionSchema, required: true },
  mainWorkout: { type: WorkoutSectionSchema, required: true },
  coolDown: { type: WorkoutSectionSchema, required: true },
});

const WorkoutPlanSchema = new Schema<IWorkoutPlan>({
  createdBy: { type: String, required: true },
  planName: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, default: 5 },
  image: { type: String, default: 'https://i.ibb.co.com/fd0nMfrB/fitness.png' },
  workouts: { type: [DayWorkoutSchema], required: true },
});

export const TemporaryWorkout = model<IWorkoutPlan>(
  'TemporaryWorkout',
  WorkoutPlanSchema,
);
