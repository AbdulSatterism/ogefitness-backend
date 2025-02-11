import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { TNutrition } from './nutrition.interface';
import { Nutrition } from './nutrition.model';
import unlinkFile from '../../../shared/unlinkFile';

const createNutritionIntoDB = async (payload: TNutrition) => {
  const result = await Nutrition.create(payload);

  return result;
};

const getAllNutrition = async () => {
  const result = await Nutrition.find();

  return result;
};

// const getSingleNutrition = async (id: string) => {
//   const isExistNutrition = await Nutrition.findById(id);

//   if (!isExistNutrition) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, 'nutrition not found');
//   }

//   return isExistNutrition;
// };

//! get single nutriton with related nutrition
export const getSingleNutrition = async (id: string) => {
  const nutrition = await Nutrition.findById(id);

  if (!nutrition) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Nutrition not found');
  }

  // Find related nutrition items based on categories, excluding the current one
  const relatedNutritions = await Nutrition.find({
    _id: { $ne: id }, // Exclude the current nutrition item
    category: { $in: nutrition.category }, // Match any of the categories
  }).limit(4);

  return {
    nutrition,
    relatedNutritions,
  };
};

const updateNutriton = async (id: string, payload: Partial<TNutrition>) => {
  const isExistNutrition = await Nutrition.findById(id);

  if (!isExistNutrition) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'nutrition not found');
  }

  if (payload.image && isExistNutrition.image) {
    unlinkFile(isExistNutrition.image);
  }

  const result = await Nutrition.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

export const nutritionServices = {
  createNutritionIntoDB,
  getAllNutrition,
  getSingleNutrition,
  updateNutriton,
};
