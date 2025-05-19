import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ChatService } from './chatMessage.service';
import { OpenAIService } from '../ai/ai.services';

const createSession = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const sessionId = await ChatService.createSessionId(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Session created successfully',
    data: { sessionId },
  });
});

const sendMessage = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const { sessionId, message } = req.body;

  await ChatService.saveMessage(userId, sessionId, 'question', message);

  const chatHistory = await ChatService.getMessages(userId, sessionId);

  const aiReply = await OpenAIService.getStepByStepAnswer(message, chatHistory);

  await ChatService.saveMessage(userId, sessionId, 'answer', aiReply);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Message processed successfully',
    data: { reply: aiReply },
  });
});

const getChatHistory = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { sessionId } = req.params;

  if (!userId || !sessionId) {
    return sendResponse(res, {
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'userId is required',
    });
  }

  const messages = await ChatService.getMessages(userId, sessionId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Chat history retrieved successfully',
    data: messages,
  });
});

const listSessions = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const sessions = await ChatService.listSessions(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Chat sessions listed successfully',
    data: sessions,
  });
});

export const ChatController = {
  createSession,
  sendMessage,
  getChatHistory,
  listSessions,
};
