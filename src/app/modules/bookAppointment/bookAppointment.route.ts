/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { bookAppointmentValidations } from './bookAppointment.validation';
import { bookAppointmentControllers } from './bookAppointment.controller';

const router = express.Router();

router.post(
  '/create-book-appointment',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  validateRequest(
    bookAppointmentValidations.createBookAppointmentValidationSchema,
  ),
  bookAppointmentControllers.createBookAppointment,
);

//! only admin
router.get(
  '/all-book-appointment',
  auth(USER_ROLES.ADMIN),
  bookAppointmentControllers.allBookAppointment,
);

router.get(
  '/book-appointment-details/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  bookAppointmentControllers.getSingleBookAppointment,
);

//! specific user booked appointment

router.get(
  '/user-book-appointment',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  bookAppointmentControllers.specificUserBookAppointment,
);

export const bookAppointmentRoutes = router;
