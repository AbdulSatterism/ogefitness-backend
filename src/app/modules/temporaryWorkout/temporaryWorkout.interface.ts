import { Types } from 'mongoose';

//! not workable for this site

export interface DayWorkout {
  isCompleted: boolean;
  day: number;
  warmUp: WorkoutSection;
  mainWorkout: WorkoutSection;
  coolDown: WorkoutSection;
}

export interface WorkoutSection {
  duration: number;
  exercises: Types.ObjectId[];
}

export interface IWorkoutPlan {
  createdBy: string;
  planName: string;
  description: string;
  image?: string;
  rating: number;
  workouts: DayWorkout[];
}
