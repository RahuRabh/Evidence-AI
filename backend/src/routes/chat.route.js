import { Router } from "express";
import { createChatTurn, deleteSessionById, getChatSessionById, getChatSessions } from "../controllers/chat.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const chatRouter = Router();

chatRouter.use(authMiddleware);

chatRouter.get("/sessions", getChatSessions);
chatRouter.get("/sessions/:id", getChatSessionById);
chatRouter.delete("/conversation/:conversationId", deleteSessionById);
chatRouter.post("/", createChatTurn);
