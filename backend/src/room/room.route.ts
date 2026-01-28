import { Router } from 'express';
import { RoomController } from './room.controller';
import { validateBody } from '../middlewares/validateBody.middlware';
import { createRoomSchema } from './validator/createRoom.validator';
import { updateRoomSchema } from './validator/updateRoom.valdiator';
import { uploader } from '../configs/multer.config';
import { getRoomSchema } from './validator/getRoom.validator';

const router: Router = Router();

router.post(
  '/create',
  [validateBody(createRoomSchema), uploader.single('file')],
  RoomController.createRoom,
);
router.put(
  '/update',
  [validateBody(updateRoomSchema), uploader.single('file')],
  RoomController.updateRoom,
);

router.get(
  '/get/:id',
  validateBody(getRoomSchema),
  RoomController.getRoomMessagesWithID,
);

router.post('/get-all', RoomController.getAllRoomsWithConvId);

export const RoomsRoutes = router;
