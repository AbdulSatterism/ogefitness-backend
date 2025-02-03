import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';

import unlinkFile from '../../../shared/unlinkFile';
import { TExercise } from './exercise.interface';
import { Exercise } from './exercise.model';

const createExercise = async (payload: TExercise) => {
  const result = await Exercise.create(payload);

  return result;
};

const getAllExercise = async () => {
  const result = await Exercise.find();

  return result;
};

const getSingleExercise = async (id: string) => {
  const isExistExercise = await Exercise.findById(id);

  if (!isExistExercise) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'This exercise not found');
  }

  return isExistExercise;
};

const updateExercise = async (id: string, payload: Partial<TExercise>) => {
  const isExistExercise = await Exercise.findById(id);

  if (!isExistExercise) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'this exercise not found');
  }

  if (payload.gifImage && isExistExercise.gifImage) {
    unlinkFile(isExistExercise.gifImage);
  }

  const result = await Exercise.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

export const exerciseServices = {
  createExercise,
  getAllExercise,
  getSingleExercise,
  updateExercise,
};
