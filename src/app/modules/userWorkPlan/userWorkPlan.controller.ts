// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable no-unused-vars */

import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { userWorkPlanServices } from './userWorkPlan.service';

const userAllWorkoutPlan = catchAsync(async (req, res) => {
  const result = await userWorkPlanServices.userAllWorkoutPlan(req.user.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'workout plan retrieve succefully',
    data: result,
  });
});

// const singleWorkPlan = catchAsync(async (req, res) => {
//   const { id } = req.params;

//   const result = await userWorkPlanServices.singleWorkPlan(id);

//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: 'work plan retrive succefully',
//     data: result,
//   });
// });

//* get signle workout plan by day wise
const singleWorkPlan = catchAsync(async (req, res) => {
  const { id } = req.params;
  const day = req.query.day ? parseInt(req.query.day as string, 10) : 1;
  const result = await userWorkPlanServices.singleWorkPlan(id, day);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'work plan retrive succefully',
    data: result,
  });
});

export const userWorkoutPlanControllers = {
  userAllWorkoutPlan,
  singleWorkPlan,
};
