import CustomAPIError from "../errors/custom-api.js";
import UnauthorizedError from "../errors/unauthorized.js";
import { isTokenValid, verifyJWT } from "../utils/tokenUtils.js";

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomAPIError("Authentication Invalid");
  }

  try {
    const { payload } = isTokenValid({ token });

    req.user = {
      user: payload.name,
      userId: payload.userId,
      role: payload.role,
    };

    next();
  } catch (error) {
    throw new CustomAPIError("Authentication Invalid");
  }
};

const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorized to access this rout");
    }

    next();
  };
};

export { authenticateUser, authorizePermission };
