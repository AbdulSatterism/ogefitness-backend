import { model, Schema } from 'mongoose';
import {
  IMealPlan,
  IDailyMealPlan,
  IMealDetail,
  IMealItem,
} from './mealPlan.interface';

const MealItemSchema = new Schema<IMealItem>({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
});

const MealDetailSchema = new Schema<IMealDetail>({
  items: { type: [MealItemSchema], required: true },
  time: { type: String, required: true },
});

const DailyMealPlanSchema = new Schema<IDailyMealPlan>({
  day: { type: Number, required: true },
  breakfast: { type: MealDetailSchema, required: true },
  midMorningSnack: { type: MealDetailSchema, required: true },
  lunch: { type: MealDetailSchema, required: true },
  afternoonSnack: { type: MealDetailSchema, required: true },
  dinner: { type: MealDetailSchema, required: true },
  calories: { type: Number, required: true },
  carb: { type: Number, required: true },
  protein: { type: Number, required: true },
  fiber: { type: Number, required: true },
  fat: { type: Number, required: true },
  isCompleted: { type: Boolean, default: false },
});

const MealPlanSchema = new Schema<IMealPlan>(
  {
    userId: { type: Schema.Types.ObjectId, required: false, ref: 'User' },
    planName: { type: String, required: true },
    plans: { type: [DailyMealPlanSchema], required: true },
  },
  {
    timestamps: true,
  },
);

export const MealPlan = model<IMealPlan>('MealPlan', MealPlanSchema);
