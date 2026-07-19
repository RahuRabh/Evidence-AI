import { z } from "zod";

import { getChatSession, processChatRequest, listChatSessions, deleteChatMessage, renameChatSessions } from "../services/chat/chat.service.js";
import { asyncHandler } from "../utils/async-handler.js";

const chatBodySchema = z.object({
  conversationId: z.string().nullable().optional(),
  message: z.string().trim().min(1, "Message is required"),
  structuredContext: z
    .object({
      patientName: z.string().optional(),
      disease: z.string().optional(),
      intent: z.string().optional(),
      location: z.string().optional(),
    })
    .optional(),
});

export const createChatTurn = asyncHandler(async (req, res) => {
  const body = chatBodySchema.parse(req.body);
  const result = await processChatRequest({...body, userId: req.user.userId});

  res.status(201).json(result);
});

export const getChatSessions = asyncHandler(async (req, res) => {
  const sessions = await listChatSessions(req.user.userId);
  
  res.status(200).json({ sessions });
});

export const getChatSessionById = asyncHandler(async (req, res) => {
  const sessionId = z.string().parse(req.params.id);
  const session = await getChatSession(sessionId, req.user.userId);
  
  res.status(200).json(session);
});

export const deleteSessionById = asyncHandler(async (req, res) => {
  const conversationId = req.params.conversationId;
  const result =  await deleteChatMessage(conversationId, req.user.userId);

  res.status(200).json(result);
})

export const updateSessionById = asyncHandler(async (req, res) => {
  const conversationId = req.params.conversationId;
  const {newTitle} = req.body;

  const result = await renameChatSessions(conversationId, req.user.userId, newTitle);

  res.status(200).json(result);
})