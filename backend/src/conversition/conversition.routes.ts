import { Router } from 'express';
import { ConversitionController } from './conversition.controller';
import { validateBody } from './../middlewares/validateBody.middlware';
import { createConvSchema } from './validator/createCon.validator';
import { updateConvSchema } from './validator/updateConv.validator';
import { uploader } from './../configs/multer.config';

const router: Router = Router();

router.post(
  '/create',
  [validateBody(createConvSchema), uploader.single('file')],
  ConversitionController.createConversition,
);

router.put(
  '/update',
  [validateBody(updateConvSchema), uploader.single('file')],
  ConversitionController.updateConversition,
);

router.get('/get', ConversitionController.getAllConversition);

export const ConvRoutes = router;
