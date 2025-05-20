import { Router } from 'express';
import { ChatController } from './chatMessage.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = Router();

router.post(
  '/session',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  ChatController.createSession,
);
router.post(
  '/message',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  ChatController.sendMessage,
);
router.get(
  '/history/:sessionId',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  ChatController.getChatHistory,
);
router.get(
  '/sessions',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  ChatController.listSessions,
);

export const ChatRoutes = router;
