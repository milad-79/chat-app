import { Router } from 'express';
import { UserController } from './users.controller';
import { validateBody } from './../middlewares/validateBody.middlware';
import {
  usernameSchema,
  registerUserSchema,
} from './validator/users.validators';

import { logoutSchema } from './validator/logout.validators';
import { CheckAuthentication } from './../auth/middlewares/authentication.middleware';

const router: Router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  UserController.registerUser,
);

router.post('/login', validateBody(registerUserSchema), UserController.login);

router.post(
  '/logout',
  [CheckAuthentication, validateBody(logoutSchema)],
  UserController.logout,
);

router.get(
  '/get-user/:username',
  [CheckAuthentication, validateBody(usernameSchema)],
  UserController.getUserWithUserName,
);

export const UserRoutes = router;
