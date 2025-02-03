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

// const getAllNutriton = catchAsync(async (req, res) => {
//   const result = await nutritionServices.getAllNutrition();

//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: 'retrive all nutrition successfully',
//     data: result,
//   });
// });

// const getSingleNutriton = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await nutritionServices.getSingleNutrition(id);

//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: 'single nutritioin retrive successfully',
//     data: result,
//   });
// });

// const updateNutriton = catchAsync(async (req, res) => {
//   const { id } = req.params;

//   let image;
//   if (req.files && 'image' in req.files && req.files.image[0]) {
//     image = `/images/${req.files.image[0].filename}`;
//   }

//   const value = {
//     image,
//     ...req.body,
//   };

//   const result = await nutritionServices.updateNutriton(id, value);

//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: 'nutrition updated successfully',
//     data: result,
//   });
// });

export const exerciseControllers = {
  createExercise,
};
