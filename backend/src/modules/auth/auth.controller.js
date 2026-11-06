import authService from './auth.service.js';

/**
 * POST /api/auth/register
 */
export async function register(req, res, next) {
  try {
    const { name, email, password, locality } = req.body;
    const result = await authService.registerUser({ name, email, password, locality });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/login
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/auth/me
 */
export async function getMe(req, res) {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
}

export default { register, login, getMe };

