import Stripe from 'stripe';
import stripe from './utils';
import { Payment } from './payment.model';
import { Types } from 'mongoose';

const createCheckoutSessionService = async (
  userId: string,
  email: string,
  appointmentId: string,
  appointmentPrice: number, // assuming appointment price is passed directly
) => {
  try {
    const lineItems = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Appointment Payment',
            description: `Payment for appointment ${appointmentId}`,
          },
          unit_amount: Math.round(appointmentPrice * 100),
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url:
        'https://yourapp.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://yourapp.com/cancel',
      metadata: {
        userId,
        appointmentId,
      },
      customer_email: email,
    });

    return session.url;
  } catch (error) {
    console.error('Stripe session creation failed:', error);
    throw new Error('Failed to create checkout session');
  }
};

const handleStripeWebhookService = async (event: Stripe.Event) => {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      const { amount_total, metadata, payment_intent, client_secret } = session;
      const userId = metadata?.userId as string; // Ensure you pass metadata when creating a checkout session
      const products = JSON.parse(metadata?.products || '[]');
      const email = session.customer_email || '';
      // const client_secret = payment_intent || '';

      const amountTotal = (amount_total ?? 0) / 100;

      console.log(session, 'session');

      const paymentRecord = new Payment({
        amount: amountTotal, // Convert from cents to currency
        user: new Types.ObjectId(userId),
        products,
        email,
        transactionId: payment_intent,
        client_secret: client_secret,
        status: 'Completed',
      });

      await paymentRecord.save();
      break;
    }

    case 'checkout.session.async_payment_failed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const { client_secret } = session;
      const payment = await Payment.findOne({ client_secret });
      if (payment) {
        payment.status = 'FAILED';
        await payment.save();
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};

export const PaymentService = {
  createCheckoutSessionService,
  handleStripeWebhookService,
};
