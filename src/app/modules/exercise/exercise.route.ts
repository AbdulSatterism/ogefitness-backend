/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';

import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { exerciseValidations } from './exercise.validation';
import { exerciseControllers } from './exercise.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/create-exercise',
  auth(USER_ROLES.ADMIN),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(exerciseValidations.createExerciseSchema),
  exerciseControllers.createExercise,
);

router.get('/all-exercise', exerciseControllers.getAllExercise);

router.get(
  '/exercise-details/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  exerciseControllers.getSingleExercise,
);

router.post(
  '/update-exercise/:id',
  auth(USER_ROLES.ADMIN),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(exerciseValidations.updateExerciseSchema),
  exerciseControllers.updateExercise,
);

export const exerciseRoutes = router;
