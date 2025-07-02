import UnauthorizedError from "../errors/unauthorized.js";

const checkPermissions = (requestUser, resourceId) => {
  if (requestUser.role === "admin") return;

  if (requestUser.userId === resourceId.toString()) return;

  throw new UnauthorizedError("Not authorized to access this route");
};

export default checkPermissions;
