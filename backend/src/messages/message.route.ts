import { Router } from 'express';
import { MessageController } from './messages.controller';
import { uploader } from './../configs/multer.config';
import { validateBody } from './../middlewares/validateBody.middlware';
import { sendMessageSchema } from './validator/sendMessage.validator';
// import { deleteMessageSchema } from './validator/deleteMessage.validator';

const router: Router = Router();

router.post(
  '/send',
  [validateBody(sendMessageSchema), uploader.single('file')],
  MessageController.sendMessage,
);

router.post('/get-messages', MessageController.getAllMessagesRoomWithID);

export const MessageRoutes = router;
