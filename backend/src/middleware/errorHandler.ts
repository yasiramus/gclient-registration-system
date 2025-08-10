import { Request, Response, NextFunction } from "express";

import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Error occurred: ", err.message || err);
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "false",
      message: "Validation failed",
      errors: err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }
  if (err.message === "Track name already exists") {
    return res.status(409).json({
      status: "false",
      message: "Track name already exists",
    });
  }
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    status: "false",
    message: err.message || "Internal Server Error",
  });
};
