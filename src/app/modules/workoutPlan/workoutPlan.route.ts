/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { workoutPlanValidations } from './workoutPlan.validation';
import { workoutPlanControllers } from './workoutPlan.controller';

const router = express.Router();

//* user also create workout plan for plan and also store in admin collection but did not publish in from home
router.post(
  '/create-workout-plan',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(workoutPlanValidations.createWorkoutPlanValidationSchema),
  workoutPlanControllers.createWorkoutPlan,
);

router.get('/all-workout-plan', workoutPlanControllers.getAllWorkoutPlan);

//TODO: if need update user role base auth or subscription base restictioin
router.get(
  '/workout-plan-details/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  workoutPlanControllers.getSingleWorkoutPlan,
);

router.post(
  '/update-workout-plan/:id',
  auth(USER_ROLES.ADMIN),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(workoutPlanValidations.updateWorkoutPlanValidationSchema),
  workoutPlanControllers.updateWorkoutPlan,
);

export const workoutPlanRoutes = router;
