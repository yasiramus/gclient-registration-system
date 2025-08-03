"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.requireAuth = void 0;
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
const requireAuth = (req, res, next) => {
    var _a, _b;
    if (!((_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id)) {
        return res.status(401).json({ message: "Unauthorized: No session found" });
    }
    next();
};
exports.requireAuth = requireAuth;
const authorizeRoles = (roles) => {
    return (req, res, next) => {
        var _a, _b;
        const userRole = (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.role;
        if (!userRole || !roles.includes(userRole)) {
            return res.status(403).json({
                message: "Access Denied:  You do not have permission to perform this action",
            });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
