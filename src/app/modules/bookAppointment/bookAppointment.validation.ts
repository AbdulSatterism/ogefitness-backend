import { z } from 'zod';

const createBookAppointmentValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    age: z
      .number()
      .int()
      .positive({ message: 'Age must be a positive integer' }),
    gender: z.enum(['MALE', 'FEMALE', 'OTHERS'], {
      message: "Gender must be one of 'MALE', 'FEMALE', or 'OTHERS'",
    }),
    description: z.string(),
    appointmentId: z.string(),
    userId: z.string(),
    selectedDate: z.string(),
    selectedTime: z.string(),
  }),
});

const updateBookAppointmentValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    age: z.number().int().positive().optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHERS']).optional(),
    description: z.string().optional(),
    appointmentId: z.string().optional(),
    userId: z.string().optional(),
    selectedDate: z.string().optional(),
    selectedTime: z.string().optional(),
  }),
});

export const bookAppointmentValidations = {
  createBookAppointmentValidationSchema,
  updateBookAppointmentValidationSchema,
};
