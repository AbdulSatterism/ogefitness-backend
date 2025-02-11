import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { TBookAppointment } from './bookAppointment.interface';
import { BookAppointment } from './bookAppointment.model';
import { User } from '../user/user.model';
import { Appointment } from '../appointment/appointment.model';
import { Notification } from '../notifications/notifications.model';

const createBookAppointment = async (payload: TBookAppointment) => {
  const { userId, appointmentId } = payload;

  const isExistUser = await User.findById(userId);

  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const isAppointmentExist = await Appointment.findById(appointmentId);

  if (!isAppointmentExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'this appointment not found');
  }

  const { price } = isAppointmentExist;

  payload.paymentAmount = price;

  //* check apointment available or not
  if (!isAppointmentExist.status) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'this appointment not avilable now',
    );
  }

  const result = await BookAppointment.create(payload);

  //* create appointment notification
  if (result) {
    const notificationData = {
      message: 'new appointment booked',
      patientName: result.name,
    };

    await Notification.create(notificationData);
  }

  // const payment = await createPayment({
  //   userId,
  //   appointmentId,
  //   amount: price,
  // });

  // return { appointment, payment };

  return result;
};

//* admin only
const getAllBookAppointment = async (page: number, limit: number) => {
  // Calculate skip value
  const skip = (page - 1) * limit;

  // Get the total count of appointments
  const totalAppointments = await BookAppointment.countDocuments({
    paymentStatus: 'COMPLETED',
  });

  // Fetch the paginated appointments
  const appointments = await BookAppointment.find({
    paymentStatus: 'COMPLETED',
  })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate({
      path: 'userId',
      select: 'name email phone',
    })
    .populate('appointmentId');

  // Return paginated result along with metadata
  return {
    totalAppointments,
    totalPages: Math.ceil(totalAppointments / limit),
    currentPage: page,
    appointments,
  };
};

const getSingleBookAppointment = async (id: string) => {
  const isExistBookAppointment = await BookAppointment.findById(id);

  if (!isExistBookAppointment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'appointment  not found');
  }

  return isExistBookAppointment;
};

//! get specific user book appointment

const specificUserBookAppointment = async (userId: string) => {
  const isExistUser = await User.findById(userId);

  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'this user not found');
  }

  //* find all data by userId who buy an appointment

  const result = await BookAppointment.find({ userId: userId }).populate(
    'appointmentId',
  );

  return result;
};

//TODO: need update bookAppointment letter
// const updateAppointment = async (
//   id: string,
//   payload: Partial<TBookAppointment>,
// ) => {
//   const isExistAppointment = await Appointment.findById(id);

//   if (!isExistAppointment) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, 'appointment not found');
//   }

//   const result = await Appointment.findByIdAndUpdate(id, payload, {
//     new: true,
//   });

//   return result;
// }

export const bookAppointmentServices = {
  createBookAppointment,
  getAllBookAppointment,
  getSingleBookAppointment,
  specificUserBookAppointment,
};
