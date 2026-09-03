import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import { boardController } from './board_controller';

const router = Router();

router.post('/', authenticate, boardController.createBoard);
router.get('/', authenticate, boardController.getMyBoards);

export const boardRoutes = router;
