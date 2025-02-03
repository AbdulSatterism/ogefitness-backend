/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';

import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { exerciseValidations } from './exercise.validation';
import { exerciseControllers } from './exercise.controller';

const router = express.Router();

router.post(
  '/create-exercise',
  // auth(USER_ROLES.ADMIN),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(exerciseValidations.createExerciseSchema),
  exerciseControllers.createExercise,
);

// router.get('/all-nutrition', nutritionControllers.getAllNutriton);

// //TODO: if need update user role base auth or subscription base restictioin
// router.get(
//   '/nutriton-details/:id',
//   auth(USER_ROLES.ADMIN, USER_ROLES.USER),
//   nutritionControllers.getSingleNutriton,
// );

// router.post(
//   '/update-nutrition/:id',
//   auth(USER_ROLES.ADMIN),
//   fileUploadHandler(),
//   (req: Request, res: Response, next: NextFunction) => {
//     req.body = JSON.parse(req.body.data);
//     next();
//   },
//   validateRequest(nutritionValidations.updateNutritionValidationSchema),
//   nutritionControllers.updateNutriton,
// );

export const exerciseRoutes = router;
