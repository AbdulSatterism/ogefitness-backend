/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { userWorkoutPlanControllers } from './userWorkPlan.controller';

const router = express.Router();

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
