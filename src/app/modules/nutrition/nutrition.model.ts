import { Schema, model } from 'mongoose';
import { IRecipe, TNutrition } from './nutrition.interface';

const RecipeSchema = new Schema<IRecipe>({
  step: { type: Number, required: true },
  description: { type: String, required: true },
});

const NutritionSchema = new Schema<TNutrition>({
  title: { type: String, required: true },
  image: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbohydrate: { type: Number, required: true },
  fat: { type: Number, required: true },
  fiber: { type: Number, required: true },
  rating: { type: Number, required: true },
  reviewsCount: { type: Number, required: true },
  ingredients: { type: [String], required: true },
  recipe: { type: [RecipeSchema], required: true },
});

export const Nutrition = model<TNutrition>('Nutrition', NutritionSchema);
