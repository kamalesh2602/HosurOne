import { verifyToken, getUserById } from '../modules/auth/auth.service.js';

/**
 * Authentication middleware: verifies Bearer JWT token
 */
export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Authentication required. Please log in to perform this action.',
        status: 401,
      },
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    const user = await getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'The user account associated with this session no longer exists.',
          status: 401,
        },
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        error: {
          message: 'This account has been suspended by an administrator.',
          status: 403,
        },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid or expired authentication session. Please log in again.',
        status: 401,
      },
    });
  }
}

/**
 * Authorization middleware: restricts route to specific roles
 */
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required.', status: 401 },
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          message: `Forbidden: This operation requires one of the following roles: [${allowedRoles.join(', ')}].`,
          status: 403,
        },
      });
    }

    next();
  };
}

/**
 * Optional authentication middleware: populates req.user if token valid, but allows guest access
 */
export async function optionalAuthenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      const user = await getUserById(decoded.id);
      if (user && user.status !== 'suspended') {
        req.user = user;
      }
    } catch {
      // Ignore token failure for optional authentication
    }
  }
  next();
}

export default { authenticate, authorize, optionalAuthenticate };

