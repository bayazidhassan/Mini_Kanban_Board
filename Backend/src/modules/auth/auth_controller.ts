import catchAsync from '../../utils/catchAsync';
import { authService } from './auth_service';

const loginUser = catchAsync(async (req, res) => {
  const result = await authService.loginUser(req.body);

  res.status(200).json({
    success: true,
    message: 'Login successful.',
    data: result,
  });
});

export const authController = {
  loginUser,
};
