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

const getSingleNutrition = async (id: string) => {
  const isExistNutrition = await Nutrition.findById(id);

  if (!isExistNutrition) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'nutrition not found');
  }

  return isExistNutrition;
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

// const updatePrivacy = async (payload: TPrivacy) => {
//   const result = await Privacy.findOneAndUpdate(
//     {},
//     { description: payload.description },
//     { new: true },
//   );

//   return result;
// };

export const nutritionServices = {
  createNutritionIntoDB,
  getAllNutrition,
  getSingleNutrition,
  updateNutriton,
};
