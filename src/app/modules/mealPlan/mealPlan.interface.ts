import { Document, Types } from 'mongoose';

export interface IDailyMealPlan {
  day: number;
  breakfast: string;
  midMorningSnack: string;
  lunch: string;
  afternoonSnack: string;
  dinner: string;
  calories: number;
  carb: number;
  protein: number;
  fiber: number;
  fat: number;
  isCompleted?: boolean;
}

export interface IMealPlan extends Document {
  userId: Types.ObjectId;
  planName: string;
  plans: IDailyMealPlan[];
}
