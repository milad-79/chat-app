import { Router } from 'express';
import { UserRoutes } from '../users/user.routes';
import { UserDetailesRoutes } from '../user_detailes/userDatiales.routes';
import { ConvRoutes } from '../conversition/conversition.routes';
import { RoomsRoutes } from '../room/room.route';
import { MessageRoutes } from '../messages/message.route';
import { CheckAuthentication } from '../auth/middlewares/authentication.middleware';

const router: Router = Router();

router.use('/user', UserRoutes);
router.use('/user-detaile', CheckAuthentication, UserDetailesRoutes);
router.use('/conv', CheckAuthentication, ConvRoutes);
router.use('/room', CheckAuthentication, RoomsRoutes);
router.use('/message', CheckAuthentication, MessageRoutes);

export default router;
