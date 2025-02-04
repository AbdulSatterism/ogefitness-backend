import { Schema, model } from 'mongoose';
import { TBookAppointment } from './bookAppointment.interface';

const bookAppointmentSchema = new Schema<TBookAppointment>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHERS'], required: true },
  description: { type: String, required: true },
  appointmentId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Appointment',
  },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  selectedDate: { type: String, required: true },
  selectedTime: { type: String, required: true },
  paymentAmount: {
    type: Number,
  },
  paymentStatus: {
    type: String,
    default: 'PENDING',
  },
});

export const BookAppointment = model<TBookAppointment>(
  'BookAppointment',
  bookAppointmentSchema,
);
