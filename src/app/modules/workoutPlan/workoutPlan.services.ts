/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import unlinkFile from '../../../shared/unlinkFile';
import { IWorkoutPlan } from './workoutPlan.interface';
import { WorkoutPlan } from './workoutPlan.model';

//TODO: update create workout plan for searching criteria

const createWorkoutPlan = async (user: any, payload: IWorkoutPlan) => {
  payload.createdBy = user.role;

  const result = await WorkoutPlan.create(payload);

  return result;
};

const getAllWorkoutPlan = async (query: Record<string, unknown>) => {
  const { page, limit } = query;

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  // Find only those workout plans created by admin
  const result = await WorkoutPlan.find({ createdBy: 'ADMIN' })
    .populate('workouts.warmUp.exercises') // Populate warmUp exercises
    .populate('workouts.mainWorkout.exercises') // Populate mainWorkout exercises
    .populate('workouts.coolDown.exercises')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size);

  const workoutPlansWithStats = result.map(workoutPlan => {
    const totalDays = workoutPlan.workouts.length;
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
    .populate('workouts.coolDown.exercises')
    .lean();

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
