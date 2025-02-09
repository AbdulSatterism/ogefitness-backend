// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable no-unused-vars */
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import { exerciseReviewServices } from './exerciseReview.services';

const createExerciseReview = catchAsync(async (req, res) => {
  const { id } = req.user;
  const result = await exerciseReviewServices.createExerciseReview(
    id,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'review created succefully',
    data: result,
  });
});

const getAllExerciseReviewByAdmin = catchAsync(async (req, res) => {
  const result = await exerciseReviewServices.getAllExerciseReviewByAdmin();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'all review retrieve succefully',
    data: result,
  });
});

// const getSingleUserReview = catchAsync(async (req, res) => {
//   const result = await reviewServices.getSingleUserReview(req.params.id);

//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: 'review retrieve succefully',
//     data: result,
//   });
// });

const deleteExerciseReviewByAdmin = catchAsync(async (req, res) => {
  const result = await exerciseReviewServices.deleteExerciseReviewByAdmin(
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'review deleted succefully',
    data: result,
  });
});

export const exerciseReviewControllers = {
  createExerciseReview,
  getAllExerciseReviewByAdmin,
  deleteExerciseReviewByAdmin,
};
