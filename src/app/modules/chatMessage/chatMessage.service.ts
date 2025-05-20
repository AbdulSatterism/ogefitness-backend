import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from './chatMessage.model';
import { User } from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

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

// const listSessions = async (userId: string) => {
//   const sessions = await ChatMessage.aggregate([
//     { $match: { userId } },
//     { $sort: { createdAt: -1 } },
//     {
//       $group: {
//         _id: '$sessionId',
//         createdAt: { $first: '$createdAt' },
//       },
//     },
//   ]);
//   return sessions.map(session => ({
//     sessionId: session._id,
//     createdAt: session.createdAt,
//   }));
// };

export const ChatService = {
  createSessionId,
  saveMessage,
  getMessages,
};
