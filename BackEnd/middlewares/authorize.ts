import { Request, Response, NextFunction } from "express";

interface AuthorizedRequest extends Request {
  role?: string;
}
module.exports = function authorizeRoles(allowedRoles: string[]) {
  return (req: AuthorizedRequest, res: Response, next: NextFunction) => {
    const userRole = req.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403).json({ message: "Not Authorized" });
    }
    next();
  };
};
