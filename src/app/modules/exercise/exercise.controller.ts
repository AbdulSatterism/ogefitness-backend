import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { exerciseServices } from './exercise.service';

const createExercise = catchAsync(async (req, res) => {
  let gifImage;
  if (req.files && 'gifImage' in req.files && req.files.gifImage[0]) {
    gifImage = `/gifImage/${req.files.gifImage[0].filename}`;
  }

  const value = {
    gifImage,
    ...req.body,
  };

  const result = await exerciseServices.createExercise(value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'exercise created successfully',
    data: result,
  });
});

const getAllExercise = catchAsync(async (req, res) => {
  const result = await exerciseServices.getAllExercise(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'retrive all exercise successfully',
    data: result,
  });
});
//* all exercise without pagination
const allExercise = catchAsync(async (req, res) => {
  const result = await exerciseServices.allExercise();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'retrive all exercise successfully',
    data: result,
  });
});

const getSingleExercise = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await exerciseServices.getSingleExercise(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'single exercise retrive successfully',
    data: result,
  });
});

const updateExercise = catchAsync(async (req, res) => {
  const { id } = req.params;

  let gifImage;
  if (req.files && 'gifImage' in req.files && req.files.gifImage[0]) {
    gifImage = `/gifImage/${req.files.gifImage[0].filename}`;
  }

  const value = {
    gifImage,
    ...req.body,
  };

  const result = await exerciseServices.updateExercise(id, value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'exercise updated successfully',
    data: result,
  });
});

export const exerciseControllers = {
  createExercise,
  getAllExercise,
  getSingleExercise,
  updateExercise,
  allExercise,
};
