import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import { boardController } from './board_controller';

const router = Router();

router.post('/', authenticate, boardController.createBoard);
router.get('/', authenticate, boardController.getMyBoards);

router.get('/members/:id', authenticate, boardController.getBoardMembers);
router.post('/add-member/:id', authenticate, boardController.addMemberToBoard);
router.delete(
  '/remove-member/:id',
  authenticate,
  boardController.removeMemberFromBoard,
);

router.get('/:id', authenticate, boardController.getABoard);
router.patch('/:id', authenticate, boardController.updateBoard);
router.delete('/:id', authenticate, boardController.deleteBoard);

export const boardRoutes = router;
