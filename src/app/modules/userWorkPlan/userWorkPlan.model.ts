import { Schema, model } from 'mongoose';
import { TUserWorkoutPlan } from './userWorkPlan.interface';

const userWorkoutPlanSchema = new Schema<TUserWorkoutPlan>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  workoutPlanId: {
    type: Schema.Types.ObjectId,
    ref: 'WorkoutPlan',
    required: true,
  },
});

export const UserWorkoutPlan = model<TUserWorkoutPlan>(
  'UserWorkoutPlan',
  userWorkoutPlanSchema,
);
