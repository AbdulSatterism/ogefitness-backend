import { Router } from 'express';
import auth from '../middlewares/auth';
import { USER_ROLES } from '../../enums/user';
import validateRequest from '../middlewares/validateRequest';
import { mealPlanValidations } from './mealPlan.validation';
import { mealPlanControllers } from './mealPlan.controller';

const router = Router();

router.post(
  '/create-meal-plan',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  validateRequest(mealPlanValidations.createMealPlanValidationSchema),
  mealPlanControllers.createMealPlan,
);

//* user all meal plan
router.get(
  '/user-all-meal-plan',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),

  mealPlanControllers.userAllMealPlan,
);

router.get(
  '/single-meal-plan/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  mealPlanControllers.userSingleMealPlan,
);

//* for admin all meal plan
router.get(
  '/all-meal-plan',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),

  mealPlanControllers.allMealPlan,
);

export const mealPlanRoutes = router;
