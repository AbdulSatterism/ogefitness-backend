/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { userWorkoutPlanControllers } from './userWorkPlan.controller';
import validateRequest from '../../middlewares/validateRequest';
import { userWorkPlanValidations } from './userWorkPlan.validation';

const router = express.Router();

router.post(
  '/user-add-work-plan',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  validateRequest(userWorkPlanValidations.addWorkPlanValidationSchema),
  userWorkoutPlanControllers.addToPlan,
);

router.get(
  '/user-work-plan',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  userWorkoutPlanControllers.userAllWorkoutPlan,
);

router.get(
  '/user-work-plan-details/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  userWorkoutPlanControllers.singleWorkPlan,
);

export const userWorkoutPlanRoutes = router;
