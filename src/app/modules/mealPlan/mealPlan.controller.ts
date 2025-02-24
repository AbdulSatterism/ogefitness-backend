import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { mealPlanServices } from './mealPlan.service';

const createMealPlan = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await mealPlanServices.createMealPlan(userId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'meal plan created successfully',
    data: result,
  });
});

const userAllMealPlan = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await mealPlanServices.userAllMealPlan(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'meal plan retrive successfully',
    data: result,
  });
});

const userSingleMealPlan = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const result = await mealPlanServices.userSingleMealPlan(userId, id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'single meal plan retrive successfully',
    data: result,
  });
});

//* for admin
const allMealPlan = catchAsync(async (req, res) => {
  const result = await mealPlanServices.allMealPlan();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'all plan retrive successfully',
    data: result,
  });
});

export const mealPlanControllers = {
  createMealPlan,
  userAllMealPlan,
  userSingleMealPlan,
  allMealPlan,
};
