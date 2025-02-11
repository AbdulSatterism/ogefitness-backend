import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { packageServices } from './package.service';

const createPackage = catchAsync(async (req, res) => {
  const result = await packageServices.createPackage(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'package create successfully',
    data: result,
  });
});

const updatePackage = catchAsync(async (req, res) => {
  const result = await packageServices.updatePackage(req.params.id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'package update successfully',
    data: result,
  });
});

const deletePackage = catchAsync(async (req, res) => {
  const result = await packageServices.deletePackage(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'package deleted successfully!',
    data: result,
  });
});

export const packageController = {
  createPackage,
  updatePackage,
  deletePackage,
};
