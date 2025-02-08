import { Types } from 'mongoose';

export interface TUserWorkoutPlan {
  user: Types.ObjectId;
  workoutPlanId: Types.ObjectId;
}
