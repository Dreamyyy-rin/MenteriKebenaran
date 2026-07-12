/*
* Route example
* Defining the API routes for authentication.
* This code and comments is allowed to delete.
*/

import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";

const router = Router();
const controller = new AuthController();

router.post("/register", controller.register);

export default router;
