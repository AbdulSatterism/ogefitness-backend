/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import unlinkFile from '../../../shared/unlinkFile';
import { IWorkoutPlan } from './workoutPlan.interface';
import { WorkoutPlan } from './workoutPlan.model';
import { UserWorkoutPlan } from '../userWorkPlan/userWorkPlan.model';

//* create workout plan by admin and if user then create also in user add to plan

const createWorkoutPlan = async (user: any, payload: IWorkoutPlan) => {
  let result;
  if (user.role === 'ADMIN') {
    payload.createdBy = user.role;
    result = await WorkoutPlan.create(payload);
  }

  if (user.role === 'USER') {
    // add first workout plan collection
    payload.createdBy = user.role;
    result = await WorkoutPlan.create(payload);

    // add into user workout plan

    await UserWorkoutPlan.create({
      user: user.id,
      workoutPlanId: result._id,
    });
  }

  return result;
};

//TODO: need update all things
// const getAllWorkoutPlan = async () => {
//   //* find only whose data created by admin
//   const result = await WorkoutPlan.find({ createdBy: 'ADMIN' })
//     .populate('workouts.warmUp.exercises') // Populate warmUp exercises
//     .populate('workouts.mainWorkout.exercises') // Populate mainWorkout exercises
//     .populate('workouts.coolDown.exercises')
//     .sort({ rating: -1 });

//   return result;
// };

const getAllWorkoutPlan = async () => {
  // Find only those workout plans created by admin
  const result = await WorkoutPlan.find({ createdBy: 'ADMIN' })
    .populate('workouts.warmUp.exercises') // Populate warmUp exercises
    .populate('workouts.mainWorkout.exercises') // Populate mainWorkout exercises
    .populate('workouts.coolDown.exercises')
    .sort({ rating: -1 });

  // Iterate through each workout plan to calculate total days
  const workoutPlansWithStats = result.map(workoutPlan => {
    // Calculate total number of days in the workout plan
    const totalDays = workoutPlan.workouts.length;

    // Organize the results with totalDays and exerciseCounts
    return {
      ...workoutPlan.toObject(),
      totalDays,
    };
  });

  return workoutPlansWithStats;
};

const getSingleWorkoutPlan = async (id: string) => {
  const isExistWorkoutPlan = await WorkoutPlan.findById(id);

  if (!isExistWorkoutPlan) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Workout plan not found');
  }

  // Find the workout for the requested day
  const workoutPlan = await WorkoutPlan.findById(id)
    .populate('workouts.warmUp.exercises')
    .populate('workouts.mainWorkout.exercises')
    .populate('workouts.coolDown.exercises');

  if (!workoutPlan) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Workout plan not found');
  }

  return workoutPlan;
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
