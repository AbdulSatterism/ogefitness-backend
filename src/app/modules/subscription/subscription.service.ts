/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Package } from '../package/package.model';
import { User } from '../user/user.model';
import Stripe from 'stripe';
import { WebhookService } from '../../../shared/webhook';
import stripe from '../payment/utils';
import { Subscription } from './subscription.model';

const createCheckoutSessionService = async (
  userId: string,
  packageId: string,
) => {
  const isUser = await User.findById(userId);

  try {
    const plan = await Package.findById(packageId);
    if (!plan) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Package not found');
    }

    // Create a checkout session for a subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url:
        'https://yourapp.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://yourapp.com/cancel',
      metadata: {
        userId,
        packageId,
      },
      customer_email: isUser?.email,
    });

    // Return the checkout session URL
    return session.url;
  } catch (error) {
    throw new Error('Failed to create checkout session');
  }
};

const handleStripeWebhookService = async (event: Stripe.Event) => {
  switch (event.type) {
    case 'checkout.session.completed':
      WebhookService.handleCheckoutSessionCompleted(event.data.object);
      break;

    case 'invoice.payment_succeeded':
      WebhookService.handleInvoicePaymentSucceeded(event.data.object);
      break;

    case 'invoice.payment_failed':
      WebhookService.handleInvoicePaymentFailed(event.data.object);
      break;

    case 'checkout.session.async_payment_failed':
      WebhookService.handleAsyncPaymentFailed(event.data.object);
      break;

    case 'customer.subscription.deleted':
      WebhookService.handleSubscriptionDeleted(event.data.object);
      break;

    default:
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid event type');
  }
};

const getSpecificUserSubscription = async (userId: string) => {
  const isUser = await User.findById(userId);

  if (!isUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found');
  }

  const subscription = await Subscription.findOne({ user: userId })
    .populate({
      path: 'user',
      select: 'name email subscription',
    })
    .populate({
      path: 'package',
      select: 'name interval unitAmount',
    });

  if (!subscription) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Subscribtion not found');
  }
  return subscription;
};

const cancelSubscriptation = async (userId: string) => {
  const isUser = await User.findById(userId);

  if (!isUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found');
  }

  const subscription = await Subscription.findOne({ user: userId });
  if (!subscription) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Subscribtion not found');
  }

  const updatedSubscription = await stripe.subscriptions.update(
    subscription.subscriptionId,
    {
      cancel_at_period_end: true,
    },
  );

  if (!updatedSubscription) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Subscribtion not cancel');
  }

  const updatedSub = await Subscription.findOneAndUpdate(
    { user: userId },
    { status: 'cancel' },
    { new: true },
  );
  return updatedSub;
};

//* by admin
const getAllSubs = async (query: Record<string, unknown>) => {
  const { page, limit } = query;

  const anyConditions: any[] = [{ status: 'active' }];

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  // Fetch campaigns
  const result = await Subscription.find(whereConditions)
    .populate('user', 'name email')
    .populate('package', 'name unitAmount interval')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await Subscription.countDocuments(whereConditions);
  const totalAmount = Number(
    result.reduce((sum, sub) => sum + (sub.amount || 0), 0).toFixed(2),
  );

  return {
    result,
    page: pages,
    totalSubscription: count,
    totalAmount,
  };
};

const updateSubscriptionPlanService = async (
  userId: string,
  newPackageId: string,
) => {
  // Step 1: Fetch the user
  const isUser = await User.findById(userId);
  if (!isUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found');
  }

  // Step 2: Fetch the user's subscription
  const subscription = await Subscription.findOne({ user: userId });
  if (!subscription) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Subscription not found');
  }

  // Step 3: Fetch the new plan details
  const newPlan = await Package.findById(newPackageId);
  if (!newPlan) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'New plan not found');
  }

  // Step 4: Fetch the current subscription from Stripe
  const stripeSubscription = await stripe.subscriptions.retrieve(
    subscription.subscriptionId,
  );

  if (!stripeSubscription) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Stripe subscription not found',
    );
  }

  // Step 5: Update the subscription in Stripe
  const updatedStripeSubscription = await stripe.subscriptions.update(
    subscription.subscriptionId,
    {
      items: [
        {
          id: stripeSubscription.items.data[0].id,
          price: newPlan.priceId, // The new plan's price ID
        },
      ],
      proration_behavior: 'create_prorations', // Optional: set based on your requirements
    },
  );

  if (!updatedStripeSubscription) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Stripe subscription update failed',
    );
  }

  // Step 6: Retrieve the upcoming invoice to calculate proration
  const invoicePreview = await stripe.invoices.retrieveUpcoming({
    customer: updatedStripeSubscription.customer as string,
    subscription: updatedStripeSubscription.id,
  });

  const prorationAmount = (invoicePreview.total || 0) / 100;

  // Step 7: Update the local database with the actual charged amount (proration)
  const updatedSub = await Subscription.findByIdAndUpdate(
    subscription._id,
    {
      package: newPackageId,
      amount: prorationAmount,
      time: newPlan.interval,
      startDate: new Date(invoicePreview.period_start * 1000),
      endDate: new Date(invoicePreview.period_end * 1000),
    },
    { new: true },
  );

  if (updatedSub) {
    updatedSub.status = 'active';
    await updatedSub.save();
  }

  return updatedSub;
};

//* by admin
// const getSingleSubscriptionDetails = async (paymentId: string) => {
//   const payment = await Payment.findById(paymentId).populate({
//     path: 'userId',
//     select: 'name email',
//   });

//   if (!payment) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'payment not found');
//   }

//   const { transactionId } = payment;

//   if (!transactionId) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, 'Transaction ID is missing');
//   }

//   ///* Retrieve transaction details from Stripe
//   const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);

//   // Fetch charge details to get card details
//   const charge = await stripe.charges.retrieve(
//     paymentIntent.latest_charge as string,
//   );

//   const transactionDetails = {
//     currency: paymentIntent.currency,
//     status: paymentIntent.status,
//     paymentMethod: paymentIntent.payment_method_types[0],
//     paymentEmail: charge.billing_details.email,
//     paymentName: charge.billing_details.name,
//     brand: charge.payment_method_details?.card?.brand ?? null,
//     last4: charge.payment_method_details?.card?.last4 ?? null,
//   };

//   return {
//     ...payment.toObject(), // Convert Mongoose document to a plain object
//     transactionDetails,
//   };
// };

export const SubscriptationService = {
  createCheckoutSessionService,
  handleStripeWebhookService,
  getSpecificUserSubscription,
  cancelSubscriptation,
  getAllSubs,
  updateSubscriptionPlanService,
};
