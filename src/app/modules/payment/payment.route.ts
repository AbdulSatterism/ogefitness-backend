import express from 'express';

import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { paymentControllers } from './payment.controller';

const router = express.Router();

//webhook
router.post(
  '/create-checkout-session',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  paymentControllers.createCheckoutSessionController,
);

export const PaymentRoutes = router;
