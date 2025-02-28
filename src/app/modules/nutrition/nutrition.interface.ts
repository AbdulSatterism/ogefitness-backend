export type TNutrition = {
  title: string;
  image: string;
  calories: number;
  protein: number;
  carbohydrate: number;
  fat: number;
  fiber: number;
  rating: number;
  reviewsCount?: number;
  ingredients: string[];
  instruction: string;
};
