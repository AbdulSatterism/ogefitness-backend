import { Schema, model } from 'mongoose';
import { TAppointment } from './appointment.interfacel';

const appointmentSchema = new Schema<TAppointment>({
  title: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  availableTimes: { type: [String], required: true },
  status: { type: Boolean, default: true },
});

export const Appointment = model<TAppointment>(
  'Appointment',
  appointmentSchema,
);
