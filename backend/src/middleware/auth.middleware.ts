import { NextFunction, Request as ExpressRequest, Response } from "express";

// import jwt, { Secret } from "jsonwebtoken";
import { Role } from "../../generated/prisma";

export interface Request extends ExpressRequest {
  user?: any;
}

/**
 * Middleware to authenticate JWT tokens and authorize user roles.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next function to call the next middleware
 */
// export const authenticate = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const jwtSecret: Secret = process.env.JWT_SECRET || "";
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer "))
//       return res.status(401).json({ message: "Missing or malformed token" });

//     const token = authHeader.split(" ")[1];
//     const decodedToken = jwt.verify(token, jwtSecret);
//     req.user = decodedToken;
//     next();
//   } catch (err: any) {
//     console.error("JWT Error:", err.message);
//     return res.status(401).json({ message: "Unauthorized: Invalid token" });
//   }
// };

// export const authorizeRoles = (...allowedRoles: string[]) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     if (!req.user || !allowedRoles.includes(req.user.role)) {
//       return res
//         .status(403)
//         .json(
//           "Access Denied, You do not have permission to perform this action"
//         );
//     }
//     next();
//   };
// };

/**
 * Middleware to authenticate session tokens and authorize user roles.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next function to call the next middleware
 */
//switch to session based authorization
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Session in protected route:", req.session);

  if (!req.session?.user?.id) {
    console.log("session: ", req.session);
    return res.status(401).json({ message: "Unauthorized: No session found" });
  }
  next();
};

export const authorizeRoles = (roles: "ADMIN" | "SUPER_ADMIN") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.session?.user?.role;
    console.log("role: ", userRole);
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({
        message:
          "Access Denied:  You do not have permission to perform this action",
      });
    }
    next();
  };
};
