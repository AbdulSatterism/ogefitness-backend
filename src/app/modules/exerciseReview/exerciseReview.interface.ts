import { Types } from 'mongoose';

export interface TExerciseReview {
  userId: Types.ObjectId;
  exerciseId: Types.ObjectId;
  comment: string;
}
