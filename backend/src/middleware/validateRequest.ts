import * as z from "zod";
import { Request, Response, NextFunction, RequestHandler } from "express";

export const parseZod = <T extends z._ZodType>(
  schema: T,
  handler: RequestHandler
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      return handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
