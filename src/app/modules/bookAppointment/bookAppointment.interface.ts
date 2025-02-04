import { Types } from 'mongoose';

export type TBookAppointment = {
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHERS';
  description: string;
  appointmentId: Types.ObjectId;
  userId: Types.ObjectId;
  selectedDate: string;
  selectedTime: string;
  paymentAmount: number;
  paymentStatus: 'PENDING' | 'COMPLETED';
};
