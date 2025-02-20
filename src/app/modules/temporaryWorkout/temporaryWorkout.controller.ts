import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { temporaryWorkoutServices } from './temporaryWorkout.service';

const createTemporaryWorkout = catchAsync(async (req, res) => {
  let image;
  if (req.files && 'image' in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }

  const value = {
    image,
    ...req.body,
  };

  const result =
    await temporaryWorkoutServices.createTemporaryWorkoutPlan(value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'temporary workout added',
    data: result,
  });
});

export const temporaryWorkoutControllers = {
  createTemporaryWorkout,
};
