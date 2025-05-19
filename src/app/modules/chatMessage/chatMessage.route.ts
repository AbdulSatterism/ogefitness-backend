import { Router } from 'express';
import { ChatController } from './chatMessage.controller';

const router = Router();

router.post('/session', ChatController.createSession);
router.post('/message', ChatController.sendMessage);
router.get('/history/:sessionId', ChatController.getChatHistory);
router.get('/sessions', ChatController.listSessions);

export const ChatRoutes = router;
