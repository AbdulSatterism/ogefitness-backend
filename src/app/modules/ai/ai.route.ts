/* eslint-disable @typescript-eslint/no-explicit-any */

import { Router } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import config from '../../../config';
import fetch from 'node-fetch';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = Router();

router.post(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  catchAsync(async (req, res) => {
    const prompt = req.body;

    const url = 'https://api.openai.com/v1/chat/completions';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.gpt.key}`,
      },
      body: JSON.stringify(prompt),
    });

    const data: any = await response.json();

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Ai data genarate successfully',
      data: data?.choices?.[0]?.message?.content || '{}',
    });
  }),
);

export const AiRoutes = router;
