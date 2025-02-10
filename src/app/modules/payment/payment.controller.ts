///webhook

import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import stripe from './utils';
import config from '../../../config';

const createCheckoutSessionController = async (req: Request, res: Response) => {
  const userId: string = req.user.id;
  const email: string = req.user.email;

  const { appointmentId, appointmentPrice } = req.body;

  try {
    const sessionUrl = await PaymentService.createCheckoutSessionService(
      userId,
      email,
      appointmentPrice,
      appointmentId,
    );
    res.status(200).json({ url: sessionUrl });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
};

const stripeWebhookController = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      config.payment.stripe_webhook_secret as string,
    );

    await PaymentService.handleStripeWebhookService(event);

    res.status(200).send({ received: true });
  } catch (err) {
    console.error('Error in Stripe webhook');
    res.status(400).send(`Webhook Error:`);
  }
};

export const paymentControllers = {
  createCheckoutSessionController,
  stripeWebhookController,
};
