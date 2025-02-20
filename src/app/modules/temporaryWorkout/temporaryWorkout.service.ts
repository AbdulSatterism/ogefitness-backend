import { IWorkoutPlan } from './temporaryWorkout.interface';
import { TemporaryWorkout } from './temporaryWorkout.model';

const createTemporaryWorkoutPlan = async (payload: IWorkoutPlan) => {
  const result = await TemporaryWorkout.create(payload);
  const populatedResult = await TemporaryWorkout.findById(result._id);
  // .populate('workouts.warmUp.exercises')
  // .populate('workouts.mainWorkout.exercises') // Populate mainWorkout exercises
  // .populate('workouts.coolDown.exercises')
  // .exec();
  return populatedResult;
};

export const temporaryWorkoutServices = {
  createTemporaryWorkoutPlan,
};
