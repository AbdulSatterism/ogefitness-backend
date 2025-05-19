import { Document, Types } from 'mongoose';

export interface IMealItem {
  name: string;
  quantity: string;
}

export interface IMealDetail {
  items: IMealItem[];
  time: string;
}

export interface IDailyMealPlan {
  day: number;
  breakfast: IMealDetail;
  midMorningSnack: IMealDetail;
  lunch: IMealDetail;
  afternoonSnack: IMealDetail;
  dinner: IMealDetail;
  calories: number;
  carb: number;
  protein: number;
  fiber: number;
  fat: number;
  isCompleted?: boolean;
}

export interface IMealPlan extends Document {
  userId?: Types.ObjectId;
  planName: string;
  plans: IDailyMealPlan[];
}
