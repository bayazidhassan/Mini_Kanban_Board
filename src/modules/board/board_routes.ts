import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import { boardController } from './board_controller';

const router = Router();

router.post('/', authenticate, boardController.createBoard);
router.get('/', authenticate, boardController.getMyBoards);
router.get('/:id', authenticate, boardController.getABoard);
router.patch('/:id', authenticate, boardController.updateBoard);
router.delete('/:id', authenticate, boardController.deleteBoard);

router.post('/add-member/:id', authenticate, boardController.addMemberToBoard);

export const boardRoutes = router;
