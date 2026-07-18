import { useAuth } from "../../auth/context/useAuth";
import { createContext, useState, useEffect, ReactNode } from "react";

import { makeId, mapStoredMessagesToChatMessages } from "./chatHelpers";

import {
  deleteMessageById,
  getChatSession,
  getChatSessions,
  sendChatMessage,
} from "@/api/chat";

import type {
  ChatMessage,
  ChatSessionSummary,
  StructuredContext,
} from "@/types/chat";

export type ChatContextType = {
  conversationId: string | null;
  structuredContext: StructuredContext;
  messages: ChatMessage[];
  sessions: ChatSessionSummary[];
  isLoading: boolean;
  isHistoryLoading: boolean;
  error: string;
  setError: (err: string) => void;
  updateContext: (field: keyof StructuredContext, value: string) => void;
  resetChatState: () => void;
  refreshSessions: () => Promise<void>;
  openSession: (sessionId: string) => Promise<void>;
  sendMessage: (textContent: string) => Promise<void>;
  deleteMessage: (messageId: string | null) => Promise<void>;
};

export const ChatContext = createContext<ChatContextType | null>(null);

const emptyContext: StructuredContext = {
  patientName: "",
  disease: "",
  intent: "",
  location: "",
};

export function ChatProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [structuredContext, setStructuredContext] =
    useState<StructuredContext>(emptyContext);

  const refreshSessions = async () => {
    if (!auth.isAuthenticated) {
      setSessions([]);
      return;
    }
    try {
      const nextSessions = await getChatSessions();
      setSessions(nextSessions);
    } catch (sessionError) {
      console.error("Failed to sync chat sessions:", sessionError);
      setError("Failed to reload chat list summaries.");
    }
  };

  useEffect(() => {
    if (!auth.isAuthenticated) {
      setSessions([]);
      setConversationId(null);
      setMessages([]);
      setStructuredContext(emptyContext);
      setError("");
      return;
    }
    void refreshSessions();
  }, [auth.isAuthenticated]);

  const updateContext = (field: keyof StructuredContext, value: string) => {
    setStructuredContext((current) => ({ ...current, [field]: value }));
  };

  const resetChatState = () => {
    setConversationId(null);
    setMessages([]);
    setStructuredContext(emptyContext);
    setError("");
  };

  const openSession = async (sessionId: string) => {
    setIsHistoryLoading(true);
    setError("");
    try {
      const session = await getChatSession(sessionId);
      setConversationId(session.conversation.id);
      setStructuredContext({
        patientName: session.conversation.patientName ?? "",
        disease: session.conversation.activeDisease ?? "",
        intent: session.conversation.activeIntent ?? "",
        location: session.conversation.activeLocation ?? "",
      });
      setMessages(mapStoredMessagesToChatMessages(session.messages));
    } catch (sessionError) {
      console.error(sessionError);
      setError("Could not retrieve session details.");
      throw sessionError;
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const sendMessage = async (textContent: string) => {
    const targetQuery = textContent.trim() || structuredContext.intent.trim();
    if (!targetQuery) {
      setError("Ask a question or add an intent before submitting.");
      throw new Error("Empty query validation failure");
    }

    setIsLoading(true);
    setError("");
    setMessages((current) => [
      ...current,
      { id: makeId(), role: "user", content: targetQuery },
    ]);

    try {
      const result = await sendChatMessage({
        conversationId,
        message: targetQuery,
        structuredContext,
      });

      setConversationId(result.conversationId);
      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: "assistant",
          answer: result.answer,
          sources: result.sources,
          metadata: result.metadata,
        },
      ]);
      await refreshSessions();
    } catch (requestError) {
      console.error(requestError);
      setError(
        "The assistant could not respond. Please verify your connection setup.",
      );
      throw requestError;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMessage = async (messageId: typeof conversationId) => {
    setIsLoading(true);
    setError("");
    try {
      await deleteMessageById(messageId);
      setMessages((current) => current.filter((msg) => msg.id !== messageId));
      await refreshSessions();
      if (messageId === conversationId) resetChatState();
    } catch (requestError) {
      console.error("Failed to delete message", requestError);
      setError("Could not delete the message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversationId,
        structuredContext,
        messages,
        sessions,
        isLoading,
        isHistoryLoading,
        error,
        setError,
        updateContext,
        resetChatState,
        refreshSessions,
        openSession,
        sendMessage,
        deleteMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
