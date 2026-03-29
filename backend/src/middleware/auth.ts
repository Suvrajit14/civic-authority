import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "No token" });
    }

    const decoded = jwt.verify(token, "SECRET_KEY") as any;

    req.user = decoded;

    next();

  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};