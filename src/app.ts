import cors from 'cors';
import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './routes';
import { Morgan } from './shared/morgen';
import { paymentControllers } from './app/modules/payment/payment.controller';
import { SubscriptionController } from './app/modules/subscription/subscription.controller';

const app = express();

//morgan
app.use(Morgan.successHandler);
app.use(Morgan.errorHandler);

//body parser

app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);

//webhook
app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  paymentControllers.paymentStripeWebhookController,
);

//TODO help needed
//subscriptation
app.post(
  '/subscription-webhook',
  express.raw({ type: 'application/json' }),
  SubscriptionController.subscriptionStripeWebhookController,
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//file retrieve
app.use(express.static('uploads'));

//router
app.use('/api/v1', router);

//live response
app.get('/', (req: Request, res: Response) => {
  res.send(
    '<h1 style="text-align:center; color:#A55FEF; font-family:Verdana;">Hay Ozzy how can i assist you</h1>',
  );
});

//global error handle
app.use(globalErrorHandler);

//*handle not found route;
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: 'Not found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API NOT FOUND',
      },
    ],
  });
});

export default app;
