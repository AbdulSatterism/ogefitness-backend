/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { nutritionControllers } from './nutrition.controller';
import { nutritionValidations } from './nutrition.validation';
const router = express.Router();

router.post(
  '/create-nutrition',
  auth(USER_ROLES.ADMIN),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(nutritionValidations.createNutritionValidationSchema),
  nutritionControllers.createNutrition,
);

router.get('/all-nutrition', nutritionControllers.getAllNutriton);

//TODO: if need update user role base auth or subscription base restictioin
router.get(
  '/nutriton-details/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  nutritionControllers.getSingleNutriton,
);

router.post(
  '/update-nutrition/:id',
  auth(USER_ROLES.ADMIN),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(nutritionValidations.updateNutritionValidationSchema),
  nutritionControllers.updateNutriton,
);

export const nutritionRoutes = router;
