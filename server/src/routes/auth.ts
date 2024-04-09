import { Router } from "express";
import { AuthController } from "../controllers";
import { Interceptors } from "../middlewares";

const router = Router();

router.post("/register", AuthController.register, Interceptors.handleEmit);

export default router;
