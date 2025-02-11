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

//* get all payment and price
router.get(
  '/all-payment',
  auth(USER_ROLES.ADMIN),
  paymentControllers.allPayment,
);

export const PaymentRoutes = router;
