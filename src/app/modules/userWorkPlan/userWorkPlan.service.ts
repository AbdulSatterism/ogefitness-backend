/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { UserWorkoutPlan } from './userWorkPlan.model';
import { WorkoutPlan } from '../workoutPlan/workoutPlan.model';

const addToPlan = async (id: string, workoutPlanId: string) => {
  const isUserExist = await User.findById(id);

  const isExistWorkoutPlan = await WorkoutPlan.findById(workoutPlanId);

  if (!isUserExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'this user not found');
  }

  if (!isExistWorkoutPlan) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Workout plan not found');
  }

  const payload = {
    user: id,
    workoutPlanId: workoutPlanId,
  };

  const result = await UserWorkoutPlan.create(payload);

  return result;
};

const userAllWorkoutPlan = async (id: string) => {
  // Check if the user exists
  const isUserExist = await User.findById(id);

  if (!isUserExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'This user not found');
  }

  // Fetch all workout plans for the user, including populated exercises
  const result = await UserWorkoutPlan.find({ user: id }).populate({
    path: 'workoutPlanId',
    populate: {
      path: 'workouts.warmUp.exercises workouts.mainWorkout.exercises workouts.coolDown.exercises',
    },
  });

  // Iterate through each workout plan to calculate total days and completed days
  const workoutPlansWithStats = result.map(workoutPlanData => {
    // Extract the workoutPlanId object from the result
    const workoutPlan: any = workoutPlanData.workoutPlanId;

    // Get total number of days in the workout plan
    const totalDays = workoutPlan.workouts.length;

    // Count the number of completed days (where `isCompleted = true`)
    const completedDays = workoutPlan.workouts.filter(
      (w: any) => w.isCompleted,
    ).length;

    // Add new fields to the workoutPlan object
    return {
      ...workoutPlanData.toObject(),
      totalDays,
      completedDays,
    };
  });

  return workoutPlansWithStats;
};

const singleWorkPlan = async (id: string, day: number) => {
  const isWorkPlanExist = await UserWorkoutPlan.findById(id);

  if (!isWorkPlanExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'This work plan not found');
  }

  // Fetch the workout plan
  const workoutPlan = await WorkoutPlan.findById({
    _id: isWorkPlanExist.workoutPlanId._id,
  })
    .populate('workouts.warmUp.exercises')
    .populate('workouts.mainWorkout.exercises')
    .populate('workouts.coolDown.exercises');

  if (!workoutPlan) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Workout plan not found');
  }

  // Get the requested day's workout
  const currentWorkout = workoutPlan.workouts.find(w => w.day === day);

  if (!currentWorkout) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Workout for the requested day not found',
    );
  }

  // Get total number of days in the workout plan
  const totalDay = workoutPlan.workouts.length;

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

  // If it's the last day, mark it as completed (even if the user stays on the last day)
  if (day === totalDay) {
    const lastWorkoutIndex = workoutPlan.workouts.findIndex(w => w.day === day);
    workoutPlan.workouts[lastWorkoutIndex].isCompleted = true;
    await workoutPlan.updateOne({
      $set: { [`workouts.${lastWorkoutIndex}.isCompleted`]: true },
    });
  }

  return { data: currentWorkout, totalDay };
};

//TODO : before
// const singleWorkPlan = async (id: string, day: number) => {
//   const isWorkPlanExist = await UserWorkoutPlan.findById(id);

//   if (!isWorkPlanExist) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'this work plan not found');
//   }

//   // Find the workout for the requested day
//   const workoutPlan = await WorkoutPlan.findById({
//     _id: isWorkPlanExist.workoutPlanId._id,
//   })
//     .populate('workouts.warmUp.exercises')
//     .populate('workouts.mainWorkout.exercises')
//     .populate('workouts.coolDown.exercises');

//   if (!workoutPlan) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'Workout plan not found');
//   }

//   // Find the requested day's workout
//   const currentWorkout = workoutPlan.workouts.find(w => w.day === day);

//   if (!currentWorkout) {
//     throw new ApiError(
//       StatusCodes.NOT_FOUND,
//       'Workout for the requested day not found',
//     );
//   }

//   // Update the previous day's workout as completed
//   const previousWorkoutIndex = workoutPlan.workouts.findIndex(
//     w => w.day === day - 1,
//   );
//   if (previousWorkoutIndex !== -1) {
//     workoutPlan.workouts[previousWorkoutIndex].isCompleted = true;
//     await workoutPlan.updateOne({
//       $set: { [`workouts.${previousWorkoutIndex}.isCompleted`]: true },
//     });
//   }
//   //* implement available total days
//   const totalDay = workoutPlan.workouts.length;

//   return { data: currentWorkout, totalDay };
// };

export const userWorkPlanServices = {
  userAllWorkoutPlan,
  singleWorkPlan,
  addToPlan,
};
