/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';

import validateRequest from '../../middlewares/validateRequest';
import { exerciseReviewValidations } from './exerciseReview.validation';
import { exerciseReviewControllers } from './exerciseReview.controller';

const router = express.Router();

router.post(
  '/create-exercise-review',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  validateRequest(exerciseReviewValidations.createExerciseReviewValidation),
  exerciseReviewControllers.createExerciseReview,
);

router.get(
  '/',
  auth(USER_ROLES.ADMIN),
  exerciseReviewControllers.getAllExerciseReviewByAdmin,
);

// router.get(
//   '/single-review/:id',
//   auth(USER_ROLES.ADMIN),
//   reviewControllers.getSingleUserReview,
// );

router.post(
  '/exercise-review-delete/:id',
  auth(USER_ROLES.ADMIN),
  exerciseReviewControllers.deleteExerciseReviewByAdmin,
);

export const exerciseReviewRoutes = router;
