import catchAsync from '../../utils/catchAsync';
import { userService } from './user_service';

const registerUser = catchAsync(async (req, res) => {
  const result = await userService.registerUser(req.body);

  res.status(201).json({
    success: true,
    message: 'User created successfully.',
    data: result,
  });
});

export const userController = {
  registerUser,
};
