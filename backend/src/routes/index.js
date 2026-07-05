import { Router } from "express";

import { chatRouter } from "./chat.route.js";
import { healthRouter } from "./health.route.js";
import { authRouter } from "./auth.route.js";

import { googleAuthHandler } from "../services/auth/auth.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/chat", chatRouter);
apiRouter.use("/health", healthRouter);
