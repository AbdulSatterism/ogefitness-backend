import { z } from 'zod';

const createAppointmentValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    description: z
      .array(z.string())
      .min(1, { message: 'Description is required' }),
    price: z.number().min(0, { message: 'Price must be a positive number' }),
    availableTimes: z
      .array(z.string())
      .min(1, { message: 'at least enter one time' }),
  }),
});

const updateAppointmentValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.array(z.string()).optional(),
    price: z.number().optional(),
    availableTimes: z.array(z.string()).optional(),
  }),
});

export const appointmentValidations = {
  createAppointmentValidationSchema,
  updateAppointmentValidationSchema,
};
