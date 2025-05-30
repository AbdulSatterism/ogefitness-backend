import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from './chatMessage.model';
import { User } from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

const createSessionId = async (userId: string) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'user not found');
  }

  const sessionId = uuidv4();
  return sessionId;
};

const saveMessage = async (
  userId: string,
  sessionId: string,
  role: 'question' | 'answer',
  message: string,
) => {
  const chatMessage = new ChatMessage({
    userId,
    sessionId,
    role,
    message,
  });
  return await chatMessage.save();
};

const getMessages = async (userId: string, sessionId: string) => {
  return await ChatMessage.find({ userId, sessionId })
    .sort({ createdAt: 1 })
    .lean();
};

const listSessions = async (userId: string) => {
  const id = new mongoose.Types.ObjectId(userId);

  const sessions = await ChatMessage.aggregate([
    { $match: { userId: id } },

    // Separate pipeline to get first question per session
    {
      $group: {
        _id: '$sessionId',
        lastMessageAt: { $max: '$createdAt' }, // last message date
        firstQuestionMessageId: {
          $min: {
            $cond: [{ $eq: ['$role', 'question'] }, '$createdAt', null],
          },
        },
      },
    },

    // Lookup the message document with firstQuestionMessageId
    {
      $lookup: {
        from: 'chatmessages',
        let: { sessionId: '$_id', createdAt: '$firstQuestionMessageId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$sessionId', '$$sessionId'] },
                  { $eq: ['$createdAt', '$$createdAt'] },
                  { $eq: ['$role', 'question'] },
                ],
              },
            },
          },
          { $limit: 1 },
        ],
        as: 'firstQuestion',
      },
    },

    // Flatten the firstQuestion array
    {
      $addFields: {
        firstQuestion: { $arrayElemAt: ['$firstQuestion', 0] },
      },
    },

    { $sort: { lastMessageAt: -1 } },
  ]);

  return sessions.map(session => ({
    sessionId: session._id,
    createdAt: new Date(session.lastMessageAt).toLocaleString(),
    question: session.firstQuestion?.message || null,
  }));
};

export const ChatService = {
  createSessionId,
  saveMessage,
  getMessages,
  listSessions,
};
