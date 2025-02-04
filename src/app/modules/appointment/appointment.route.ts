/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { appointmentValidations } from './appointment.validation';
import { appointmentControllers } from './appointment.controller';

const router = express.Router();

router.post(
  '/create-appointment',
  auth(USER_ROLES.ADMIN),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(appointmentValidations.createAppointmentValidationSchema),
  appointmentControllers.createAppointment,
);

router.get('/all-appointment', appointmentControllers.getAllAppointment);

//TODO: if need update user role base auth or subscription base restictioin
router.get(
  '/appointment-details/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  appointmentControllers.getSingleAppointment,
);

router.post(
  '/update-appointment/:id',
  auth(USER_ROLES.ADMIN),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(appointmentValidations.updateAppointmentValidationSchema),
  appointmentControllers.updateAppointment,
);

export const appointmentRoutes = router;
