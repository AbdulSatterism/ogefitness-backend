import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { TExerciseReview } from './exerciseReview.interface';
import { ExerciseReview } from './exerciseReview.model';

const createExerciseReview = async (
  userId: string,
  payload: Partial<TExerciseReview>,
) => {
  payload.userId = new mongoose.Types.ObjectId(userId);

  const isExistUser = await User.isExistUserById(userId);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'this user  not found');
  }

  const result = await ExerciseReview.create(payload);

  return result;
};

const getAllExerciseReviewByAdmin = async () => {
  const result = await ExerciseReview.find()
    .populate({
      path: 'userId',
      select: 'name image email', // Only fetch name, image, and email
    })
    .populate({
      path: 'exerciseId',
      select: 'exerciseName gifImage', // Only fetch exercise name and gif
    });

  return result;
};

// const getSingleUserReview = async (userId: string) => {
//   // Find the latest review for the given userId
//   const result = await Review.findOne({ userId: userId })
//     .sort({ createdAt: -1 }) // Sort reviews by createdAt in descending order
//     .limit(1); // Limit the result to one document

//   return result;
//   // const result = await Review.findOne({ userId: userId });

//   // return result;
// };

const deleteExerciseReviewByAdmin = async (id: string) => {
  const isExistReview = await ExerciseReview.findById(id);

  if (!isExistReview) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'this review not found');
  }

  const result = await ExerciseReview.findByIdAndDelete(id, { new: true });

  return result;
};

export const exerciseReviewServices = {
  createExerciseReview,
  getAllExerciseReviewByAdmin,
  deleteExerciseReviewByAdmin,
};
