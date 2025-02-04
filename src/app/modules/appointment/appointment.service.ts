import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import unlinkFile from '../../../shared/unlinkFile';
import { TAppointment } from './appointment.interfacel';
import { Appointment } from './appointment.model';

const createAppointment = async (payload: TAppointment) => {
  const result = await Appointment.create(payload);

  return result;
};

const getAllAppointment = async () => {
  const result = await Appointment.find();

  return result;
};

const getSingleAppointment = async (id: string) => {
  const isExistAppointment = await Appointment.findById(id);

  if (!isExistAppointment) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'appointment  not found');
  }

  return isExistAppointment;
};

const updateAppointment = async (
  id: string,
  payload: Partial<TAppointment>,
) => {
  const isExistAppointment = await Appointment.findById(id);

  if (!isExistAppointment) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'appointment not found');
  }

  if (payload.image && isExistAppointment.image) {
    unlinkFile(isExistAppointment.image);
  }

  const result = await Appointment.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

export const appointmentServices = {
  createAppointment,
  getAllAppointment,
  getSingleAppointment,
  updateAppointment,
};
