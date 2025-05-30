import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { WorkoutService } from './workout.service';

const createWorkout = catchAsync(async (req, res) => {
  let image;
  if (req.files && 'image' in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }

  const value = {
    image,
    ...req.body,
  };

  const result = await WorkoutService.createWorkout(value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'workout created successfully',
    data: result,
  });
});

const getAllWorkout = catchAsync(async (req, res) => {
  const result = await WorkoutService.getAllWorkout(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'retrive all workout successfully',
    data: result,
  });
});

const singleWorkout = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await WorkoutService.singleWorkout(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'single workout retrive successfully',
    data: result,
  });
});

const updateWorkout = catchAsync(async (req, res) => {
  const { id } = req.params;

  let image;
  if (req.files && 'image' in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }

  const value = {
    image,
    ...req.body,
  };

  const result = await WorkoutService.updateWorkout(id, value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'workout updated successfully',
    data: result,
  });
});

const deleteWorkout = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await WorkoutService.deleteWorkout(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'workout deleted successfully',
    data: result,
  });
});

export const WorkoutController = {
  createWorkout,
  getAllWorkout,
  singleWorkout,
  updateWorkout,
  deleteWorkout,
};
