import { model, Schema } from 'mongoose';
import { IDailyMealPlan, IMealPlan } from './mealPlan.interface';

const DailyMealPlanSchema = new Schema<IDailyMealPlan>({
  day: { type: Number, required: true },
  breakfast: { type: String, required: true },
  midMorningSnack: { type: String, required: true },
  lunch: { type: String, required: true },
  afternoonSnack: { type: String, required: true },
  dinner: { type: String, required: true },
  calories: { type: Number, required: true },
  carb: { type: Number, required: true },
  protein: { type: Number, required: true },
  fiber: { type: Number, required: true },
  fat: { type: Number, required: true },
  isCompleted: { type: Boolean, default: false },
});

const MealPlanSchema = new Schema<IMealPlan>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    planName: { type: String, required: true },
    plans: { type: [DailyMealPlanSchema], required: true },
  },
  { timestamps: true },
);

export const MealPlan = model<IMealPlan>('MealPlan', MealPlanSchema);
