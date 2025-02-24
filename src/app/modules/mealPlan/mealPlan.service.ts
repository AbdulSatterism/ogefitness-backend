import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { IMealPlan } from './mealPlan.interface';
import { MealPlan } from './mealPlan.model';

const createMealPlan = async (userId: string, payload: IMealPlan) => {
  const userExist = await User.findById(userId);

  if (!userExist) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'user not valied for create it',
    );
  }

  payload.userId = userExist?._id;

  const result = await MealPlan.create(payload);

  return result;
};

const userAllMealPlan = async (userId: string) => {
  const userExist = await User.findById(userId);

  if (!userExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'user not found');
  }

  const result = await MealPlan.find({ userId });

  return result;
};

const userSingleMealPlan = async (userId: string, id: string) => {
  const userExist = await User.findById(userId);

  if (!userExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'user not found');
  }

  const result = await MealPlan.findById(id);

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'meal plan not found');
  }

  return result;
};

// for admin all plan

const allMealPlan = async () => {
  const result = await MealPlan.find();

  return result;
};

export const mealPlanServices = {
  createMealPlan,
  userAllMealPlan,
  userSingleMealPlan,
  allMealPlan,
};
