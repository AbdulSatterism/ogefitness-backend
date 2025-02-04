import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { bookAppointmentServices } from './bookAppointment.service';

const createBookAppointment = catchAsync(async (req, res) => {
  const result = await bookAppointmentServices.createBookAppointment(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'appointment book successfully',
    data: result,
  });
});

const allBookAppointment = catchAsync(async (req, res) => {
  const { page, limit } = req.query;

  // Set default values for page and limit if they are not provided
  const pageNumber = page ? parseInt(page as string, 10) : 1;
  const limitNumber = limit ? parseInt(limit as string, 10) : 10;

  const result = await bookAppointmentServices.getAllBookAppointment(
    pageNumber,
    limitNumber,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'retrive all booked appointment',
    data: result,
  });
});

const getSingleBookAppointment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await bookAppointmentServices.getSingleBookAppointment(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'booked appointment retrive successfully',
    data: result,
  });
});

const specificUserBookAppointment = catchAsync(async (req, res) => {
  const { id } = req.user;
  const result = await bookAppointmentServices.specificUserBookAppointment(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'your all booked appointment',
    data: result,
  });
});

// const updateAppointment = catchAsync(async (req, res) => {
//   const { id } = req.params;

//   const value = {

//     ...req.body,
//   };

//   const result = await appointmentServices.updateAppointment(id, value);

//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: 'appointment updated successfully',
//     data: result,
//   });
// });

export const bookAppointmentControllers = {
  createBookAppointment,
  getSingleBookAppointment,
  allBookAppointment,
  specificUserBookAppointment,
};
