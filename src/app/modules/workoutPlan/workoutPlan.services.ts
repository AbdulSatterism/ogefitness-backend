import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import unlinkFile from '../../../shared/unlinkFile';
import { IWorkoutPlan } from './workoutPlan.interface';
import { WorkoutPlan } from './workoutPlan.model';

//! create workout plan by admin
const createWorkoutPlan = async (payload: IWorkoutPlan) => {
  const result = await WorkoutPlan.create(payload);

  return result;
};

//TODO: need update all things
const getAllWorkoutPlan = async () => {
  const result = await WorkoutPlan.find();

  return result;
};

//TODO : need populate exercise when get single workout plan
const getSingleWorkoutPlan = async (id: string) => {
  const isExistWorkoutPlan = await WorkoutPlan.findById(id);

  if (!isExistWorkoutPlan) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'workout plan not found');
  }

  return isExistWorkoutPlan;
};

const updateWorkoutPlan = async (
  id: string,
  payload: Partial<IWorkoutPlan>,
) => {
  const isExistWorkoutPlan = await WorkoutPlan.findById(id);

  if (!isExistWorkoutPlan) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'workout plan not found');
  }

  if (payload.image && isExistWorkoutPlan.image) {
    unlinkFile(isExistWorkoutPlan.image);
  }

  const result = await WorkoutPlan.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

export const workoutPlanServices = {
  createWorkoutPlan,
  getAllWorkoutPlan,
  updateWorkoutPlan,
  getSingleWorkoutPlan,
};
