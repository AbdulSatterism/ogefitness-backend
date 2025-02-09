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
const getAllWorkoutPlan = async () => {
  //* find only whose data created by admin
  const result = await WorkoutPlan.find({ createdBy: 'ADMIN' })
    .populate('workouts.warmUp.exercises') // Populate warmUp exercises
    .populate('workouts.mainWorkout.exercises') // Populate mainWorkout exercises
    .populate('workouts.coolDown.exercises');

  return result;
};

//TODO : need populate exercise when get single workout plan
// const getSingleWorkoutPlan = async (id: string) => {
//   const isExistWorkoutPlan = await WorkoutPlan.findById(id);

//   if (!isExistWorkoutPlan) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'workout plan not found');
//   }

//   const result = await WorkoutPlan.findById(id)
//     .populate('workouts.warmUp.exercises') // Populate warmUp exercises
//     .populate('workouts.mainWorkout.exercises') // Populate mainWorkout exercises
//     .populate('workouts.coolDown.exercises'); // Populate coolDown exercises

//   return result;
// };

const getSingleWorkoutPlan = async (id: string, day: number) => {
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
