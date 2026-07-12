import type { Request, Response, NextFunction } from "express";

export function auth(req: Request, res: Response, next: NextFunction) {

    // verify jwt

    next();

}
