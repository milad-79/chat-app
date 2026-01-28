import { Router } from 'express';
import { UserDetailesClass } from './userDetail.controller';
import { uploader } from './../configs/multer.config';
import { validateBody } from './../middlewares/validateBody.middlware';
import { userDetailCreateSchema } from './validator/createProfile.validators';
import { userDetailUpdateSchema } from './validator/updateProfile.validators';

const router: Router = Router();

router.post(
  '/create',
  [uploader.single('file'), validateBody(userDetailCreateSchema)],
  UserDetailesClass.createProfile,
);

router.post('/get', UserDetailesClass.getUserProfile);

router.put(
  '/update',
  [uploader.single('file'), validateBody(userDetailUpdateSchema)],
  UserDetailesClass.updateProfile,
);

export const UserDetailesRoutes = router;
