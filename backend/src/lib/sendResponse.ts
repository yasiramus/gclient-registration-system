import { Response } from "express";

type ResponseType<T> = {
  status?: true | false;
  message?: string;
  data?: T;
  statusCode?: number;
};

export function sendResponse<T>(
  res: Response,
  {
    status = true,
    message = "Request successful",
    data,
    statusCode = 200,
  }: ResponseType<T>
) {
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
}
