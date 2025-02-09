import { model, Schema } from 'mongoose';
import { TExerciseReview } from './exerciseReview.interface';

const reviewSchema = new Schema<TExerciseReview>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    exerciseId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Exercise',
    },

    comment: { type: String, required: true },
  },
  { timestamps: true },
);

export const ExerciseReview = model<TExerciseReview>(
  'ExerciseReview',
  reviewSchema,
);
