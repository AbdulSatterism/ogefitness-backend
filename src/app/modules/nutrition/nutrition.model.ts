import { Schema, model } from 'mongoose';
import { TNutrition } from './nutrition.interface';

const NutritionSchema = new Schema<TNutrition>({
  title: { type: String, required: true },
  image: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbohydrate: { type: Number, required: true },
  fat: { type: Number, required: true },
  fiber: { type: Number, required: true },
  rating: { type: Number, required: true },
  reviewsCount: { type: Number, default: 0 },
  category: { type: [String], required: true },
  ingredients: { type: [String], required: true },
  instruction: { type: String, required: true },
});

export const Nutrition = model<TNutrition>('Nutrition', NutritionSchema);
