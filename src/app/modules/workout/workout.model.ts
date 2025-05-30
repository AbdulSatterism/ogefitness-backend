import { model, Schema } from 'mongoose';
import { IWorkout } from './workout.interface';

const WorkoutSchema = new Schema<IWorkout>({
  name: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});

export const Workout = model<IWorkout>('Workout', WorkoutSchema);
