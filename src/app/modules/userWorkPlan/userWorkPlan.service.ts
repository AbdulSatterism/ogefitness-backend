import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { UserWorkoutPlan } from './userWorkPlan.model';

const userAllWorkoutPlan = async (id: string) => {
  const isUserExist = await User.findById(id);

  if (!isUserExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'this user not found');
  }

  const result = await UserWorkoutPlan.find({ user: id }).populate({
    path: 'workoutPlanId',
    populate: {
      path: 'workouts.warmUp.exercises workouts.mainWorkout.exercises workouts.coolDown.exercises',
    },
  });

  return result;
};

const singleWorkPlan = async (id: string) => {
  const isWorkPlanExist = await UserWorkoutPlan.findById(id);

  if (!isWorkPlanExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'this work plan not found');
  }

  const result = await UserWorkoutPlan.findById(id).populate({
    path: 'workoutPlanId',
    populate: {
      path: 'workouts.warmUp.exercises workouts.mainWorkout.exercises workouts.coolDown.exercises',
    },
  });

  return result;
};

export const userWorkPlanServices = {
  userAllWorkoutPlan,
  singleWorkPlan,
};
