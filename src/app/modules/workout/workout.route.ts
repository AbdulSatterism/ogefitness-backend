import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { workoutValidations } from './workout.validation';
import { WorkoutController } from './workout.controller';

const router = express.Router();

router.post(
  '/create-workout',
  auth(USER_ROLES.ADMIN),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(workoutValidations.createWorkoutValidation),
  WorkoutController.createWorkout,
);

router.get('/all-workout', WorkoutController.getAllWorkout);

router.get(
  '/workout/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  WorkoutController.singleWorkout,
);

router.post(
  '/update-workout/:id',
  auth(USER_ROLES.ADMIN),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(workoutValidations.updateWorkoutValidation),
  WorkoutController.updateWorkout,
);

router.post(
  '/delete-workout/:id',
  auth(USER_ROLES.ADMIN),
  WorkoutController.deleteWorkout,
);

export const workoutRoutes = router;
