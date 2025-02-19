/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { TNutrition } from './nutrition.interface';
import { Nutrition } from './nutrition.model';
import unlinkFile from '../../../shared/unlinkFile';
import mongoose from 'mongoose';

const createNutritionIntoDB = async (payload: TNutrition) => {
  const result = await Nutrition.create(payload);

  return result;
};

const getAllNutrition = async (query: Record<string, unknown>) => {
  const { page, limit } = query;
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Nutrition.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  return result;
};

// export const getSingleNutrition = async (id: string) => {
//   const nutrition = await Nutrition.findById(id);

//   if (!nutrition) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'Nutrition not found');
//   }

// Find related nutrition items based on categories, excluding the current one
// const relatedNutritions = await Nutrition.find({
//   _id: { $ne: id }, // Exclude the current nutrition item
//   category: { $in: nutrition.category }, // Match any of the categories
// }).limit(4);

//   return {
//     nutrition,
// relatedNutritions,
//   };
// };

//! get single nutriton with related nutrition
export const getSingleNutrition = async (id: string) => {
  const nutrition = await Nutrition.findById(id);

  if (!nutrition) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Nutrition not found');
  }

  // Build query conditions for related nutrition
  const queryConditions: any[] = [
    { title: { $regex: nutrition.title.split(' ')[0], $options: 'i' } }, // Partial title match
    { ingredients: { $in: nutrition.ingredients } }, // Match at least one ingredient
    {
      $or: [
        {
          calories: {
            $gte: nutrition.calories - 20,
            $lte: nutrition.calories + 20,
          },
        },
        {
          protein: { $gte: nutrition.protein - 2, $lte: nutrition.protein + 2 },
        },
        {
          carbohydrate: {
            $gte: nutrition.carbohydrate - 5,
            $lte: nutrition.carbohydrate + 5,
          },
        },
        { fat: { $gte: nutrition.fat - 3, $lte: nutrition.fat + 3 } },
        { fiber: { $gte: nutrition.fiber - 2, $lte: nutrition.fiber + 2 } },
      ],
    },
  ];

  // Find related nutrition items, excluding the current one
  const relatedNutritions = await Nutrition.find({
    _id: { $ne: new mongoose.Types.ObjectId(id) }, // Exclude current item
    $or: queryConditions, // Match any condition
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

const deleteNutrition = async (id: string) => {
  const isExistNutrition = await Nutrition.findById(id);

  if (!isExistNutrition) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'nutrition not found');
  }

  const result = await Nutrition.findByIdAndDelete(id, { new: true });

  return result;
};

export const nutritionServices = {
  createNutritionIntoDB,
  getAllNutrition,
  getSingleNutrition,
  updateNutriton,
  deleteNutrition,
};
