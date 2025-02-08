import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { workoutPlanServices } from './workoutPlan.services';

//TODO: need update all things as per project requirment

const createWorkoutPlan = catchAsync(async (req, res) => {
  //* if user create this then also created at user works out collection
  const user = req.user;

  let image;
  if (req.files && 'image' in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }

  const value = {
    image,
    ...req.body,
  };

  const result = await workoutPlanServices.createWorkoutPlan(user, value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'workout created successfully',
    data: result,
  });
});

const getAllWorkoutPlan = catchAsync(async (req, res) => {
  const result = await workoutPlanServices.getAllWorkoutPlan();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'retrive all workoutPlan successfully',
    data: result,
  });
});

const getSingleWorkoutPlan = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await workoutPlanServices.getSingleWorkoutPlan(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'single workoutPlan retrive successfully',
    data: result,
  });
});

const updateWorkoutPlan = catchAsync(async (req, res) => {
  const { id } = req.params;

  let image;
  if (req.files && 'image' in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }

  const value = {
    image,
    ...req.body,
  };

  const result = await workoutPlanServices.updateWorkoutPlan(id, value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'workout updated successfully',
    data: result,
  });
});

export const workoutPlanControllers = {
  createWorkoutPlan,
  getSingleWorkoutPlan,
  getAllWorkoutPlan,
  updateWorkoutPlan,
};
