/* eslint-disable no-console */
import Stripe from 'stripe';
import stripe from './utils';
import { Payment } from './payment.model';
import { Types } from 'mongoose';
import { BookAppointment } from '../bookAppointment/bookAppointment.model';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

const createCheckoutSessionService = async (
  userId: string,
  email: string,
  appointmentId: string,
) => {
  const isExistBookAppointment = await BookAppointment.findById(appointmentId);

  console.log(isExistBookAppointment);

  if (!isExistBookAppointment) {
    throw new ApiError(
      StatusCodes.BAD_GATEWAY,
      'Book-Appointment is not found!',
    );
  }

  try {
    const lineItems = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Appointment Payment',
            description: `Payment for appointment`,
          },
          unit_amount: isExistBookAppointment?.paymentAmount * 100,
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
      // success_url: 'http://192.168.10.33:3000',
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

      const { amount_total, metadata, payment_intent } = session;
      const userId = metadata?.userId as string; // Ensure you pass metadata when creating a checkout session

      const amountTotal = (amount_total ?? 0) / 100;

      const isAppointment = session?.metadata?.appointmentId;

      const paymentRecord = new Payment({
        appointmentPrice: amountTotal, // Convert from cents to currency
        userId: new Types.ObjectId(userId),
        appointmentId: isAppointment,
        transactionId: payment_intent,
        status: 'COMPLETED',
      });
      await paymentRecord.save();

      //* update book appointemtn status
      await BookAppointment.findByIdAndUpdate(
        isAppointment,
        { paymentStatus: 'COMPLETED' },
        { new: true },
      );

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
      //* update book appointemtn status if failed
      await BookAppointment.findByIdAndUpdate(
        payment?.appointmentId,
        { paymentStatus: 'FAILED' },
        { new: true },
      );

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};

//TODO: payment all data and total earning price need implemnet all things of payment

//* get all payment and calculate total price
// const getAllPayment = async () => {
//   const result = await Payment.find({ status: 'COMPLETED' });

//   return result;
// };

// const getAllPayment = async () => {
//   const result = await Payment.aggregate([
//     {
//       $match: { status: 'COMPLETED' }, // Filter only completed payments
//     },
//     {
//       $group: {
//         _id: null, // Group all documents to compute the subtotal
//         totalAppointmentPrice: { $sum: '$appointmentPrice' }, // Sum up all appointment prices
//         payments: { $push: '$$ROOT' }, // Push all documents into an array
//       },
//     },
//     {
//       $project: {
//         _id: 0, // Hide _id field
//         subtotal: '$totalAppointmentPrice', // Rename total price as subtotal
//         payments: 1, // Keep the array of payments
//       },
//     },
//   ]);

//   return result.length > 0 ? result[0] : { subtotal: 0, payments: [] };
// };

const getAllPayment = async () => {
  const result = await Payment.aggregate([
    {
      $match: { status: 'COMPLETED' }, // Filter only completed payments
    },
    {
      $lookup: {
        from: 'users', // The name of the User collection in MongoDB
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true, // In case a user is missing
      },
    },
    {
      $group: {
        _id: null, // Group all documents to compute the subtotal
        totalAppointmentPrice: { $sum: '$appointmentPrice' }, // Sum up all appointment prices
        payments: { $push: '$$ROOT' }, // Push all documents into an array
      },
    },
    {
      $project: {
        _id: 0, // Hide _id field
        subtotal: '$totalAppointmentPrice', // Rename total price as subtotal
        payments: {
          _id: 1,
          // userId: 1,
          transactionId: 1,
          appointmentPrice: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          user: { _id: 1, name: 1, email: 1 }, // Only include necessary fields from User
        },
      },
    },
  ]);

  return result.length > 0 ? result[0] : { subtotal: 0, payments: [] };
};

export const PaymentService = {
  createCheckoutSessionService,
  handleStripeWebhookService,
  getAllPayment,
};
