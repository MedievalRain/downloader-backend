import type { Request, Response, NextFunction } from "express";
import { CORS_URL } from "../config/config";

export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [CORS_URL];
  const origin = req.headers.origin;

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    return res.status(204).end();
  }

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
  } else {
    res.status(403).send("Forbidden");
  }
};
