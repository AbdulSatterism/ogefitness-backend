import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { UserWorkoutPlan } from './userWorkPlan.model';
import { WorkoutPlan } from '../workoutPlan/workoutPlan.model';

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

// TODO: need pagination by day by day
// const singleWorkPlan = async (id: string) => {
//   const isWorkPlanExist = await UserWorkoutPlan.findById(id);

//   if (!isWorkPlanExist) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'this work plan not found');
//   }

//   const result = await UserWorkoutPlan.findById(id).populate({
//     path: 'workoutPlanId',
//     populate: {
//       path: 'workouts.warmUp.exercises workouts.mainWorkout.exercises workouts.coolDown.exercises',
//     },
//   });

//   return result;
// };

// TODO:

const singleWorkPlan = async (id: string, day: number) => {
  const isWorkPlanExist = await UserWorkoutPlan.findById(id);

  if (!isWorkPlanExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'this work plan not found');
  }

  // Find the workout for the requested day
  const workoutPlan = await WorkoutPlan.findById({
    _id: isWorkPlanExist.workoutPlanId._id,
  })
    .populate('workouts.warmUp.exercises')
    .populate('workouts.mainWorkout.exercises')
    .populate('workouts.coolDown.exercises');

  if (!workoutPlan) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Workout plan not found');
  }

  // Find the requested day's workout
  const currentWorkout = workoutPlan.workouts.find(w => w.day === day);
  if (!currentWorkout) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Workout for the requested day not found',
    );
  }

  // Update the previous day's workout as completed
  const previousWorkoutIndex = workoutPlan.workouts.findIndex(
    w => w.day === day - 1,
  );
  if (previousWorkoutIndex !== -1) {
    workoutPlan.workouts[previousWorkoutIndex].isCompleted = true;
    await workoutPlan.updateOne({
      $set: { [`workouts.${previousWorkoutIndex}.isCompleted`]: true },
    });
  }

  return currentWorkout;
};

export const userWorkPlanServices = {
  userAllWorkoutPlan,
  singleWorkPlan,
};
