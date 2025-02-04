import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { appointmentServices } from './appointment.service';

const createAppointment = catchAsync(async (req, res) => {
  let image;
  if (req.files && 'image' in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }

  const value = {
    image,
    ...req.body,
  };

  const result = await appointmentServices.createAppointment(value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'appointment created successfully',
    data: result,
  });
});

const getAllAppointment = catchAsync(async (req, res) => {
  const result = await appointmentServices.getAllAppointment();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'retrive all appointment successfully',
    data: result,
  });
});

const getSingleAppointment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await appointmentServices.getSingleAppointment(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'single appointment retrive successfully',
    data: result,
  });
});

const updateAppointment = catchAsync(async (req, res) => {
  const { id } = req.params;

  let image;
  if (req.files && 'image' in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }

  const value = {
    image,
    ...req.body,
  };

  const result = await appointmentServices.updateAppointment(id, value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'appointment updated successfully',
    data: result,
  });
});

export const appointmentControllers = {
  createAppointment,
  getAllAppointment,
  getSingleAppointment,
  updateAppointment,
};
