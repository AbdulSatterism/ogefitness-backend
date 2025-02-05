// /interfaces/payment.interface.ts
import { Types } from 'mongoose';

export type TPayment = {
  userId: Types.ObjectId;
  appointmentId: Types.ObjectId;
  transactionId: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED';
};
