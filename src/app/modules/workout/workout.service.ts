import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IWorkout } from './workout.interface';
import { Workout } from './workout.model';
import unlinkFile from '../../../shared/unlinkFile';

const createWorkout = async (payload: IWorkout) => {
  const result = await Workout.create(payload);

  return result;
};

const getAllWorkout = async (query: Record<string, unknown>) => {
  const { page, limit } = query;
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Workout.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  return result;
};

const singleWorkout = async (id: string) => {
  const workout = await Workout.findById(id);

  if (!workout) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'workout not found');
  }

  return workout;
};

const updateWorkout = async (id: string, payload: Partial<IWorkout>) => {
  const isExistWorkout = await Workout.findById(id);

  if (!isExistWorkout) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Workout not found');
  }

  if (payload.image && isExistWorkout.image) {
    unlinkFile(isExistWorkout.image);
  }

  const result = await Workout.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

const deleteWorkout = async (id: string) => {
  const isExistNutrition = await Workout.findById(id);

  if (!isExistNutrition) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'workout not found');
  }

  const result = await Workout.findByIdAndDelete(id, { new: true });

  return result;
};

export const WorkoutService = {
  createWorkout,
  getAllWorkout,
  singleWorkout,
  updateWorkout,
  deleteWorkout,
};
