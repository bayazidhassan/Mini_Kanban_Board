import { Router } from 'express';
import { userController } from './user_controller';

const router = Router();

router.post('/register', userController.registerUser);

export const userRoutes = router;
