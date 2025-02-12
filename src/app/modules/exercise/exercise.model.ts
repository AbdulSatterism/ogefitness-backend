import { Schema, model } from 'mongoose';
import { TExercise } from './exercise.interface';

const exerciseSchema = new Schema<TExercise>({
  exerciseName: { type: String, required: true, unique: true },
  gifImage: { type: String, required: true },
  description: { type: String, required: true },
  gymEquipmentNeeded: { type: String, enum: ['yes', 'no'], default: 'no' },
  isDeleted: { type: Boolean, default: false },
});

export const Exercise = model<TExercise>('Exercise', exerciseSchema);
