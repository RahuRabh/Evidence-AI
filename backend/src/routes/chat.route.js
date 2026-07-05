import { Router } from "express";
import { createChatTurn, getChatSessionById, getChatSessions } from "../controllers/chat.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const chatRouter = Router();

chatRouter.use(authMiddleware);

chatRouter.get("/sessions", getChatSessions);
chatRouter.get("/sessions/:id", getChatSessionById);
chatRouter.post("/", createChatTurn);
