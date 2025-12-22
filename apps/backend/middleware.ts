import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization as string;

  if (!token) {
    return res.status(401).json({
      message: "Token not provided",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.userId = payload.id;
    next();
  } catch (error) {
    res.status(401).json({
      message: "You are not logged in",
    });
  }
}
