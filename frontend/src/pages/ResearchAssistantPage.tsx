import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { getChatSession, getChatSessions, sendChatMessage } from "../api/chat";
import { AnswerSections } from "../components/chat/AnswerSections";
import type {
  ChatMessage,
  ChatSessionSummary,
  ResearchAnswer,
  StructuredContext,
} from "../types/chat";
import { QuestionForm } from "../components/chat/QuestionForm";
import { Sidebar } from "../components/chat/Sidebar";
import { useAuth } from "../features/auth/AuthProvider";
import { AuthModal } from "../components/auth/AuthModal";

const emptyContext: StructuredContext = {
  patientName: "",
  disease: "",
  intent: "",
  location: "",
};

function makeId() {
  return crypto.randomUUID();
}

function isResearchAnswer(content: unknown): content is ResearchAnswer {
  return Boolean(
    content &&
    typeof content === "object" &&
    "conditionOverview" in content &&
    "researchInsights" in content,
  );
}

export function ResearchAssistantPage() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [structuredContext, setStructuredContext] =
    useState<StructuredContext>(emptyContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const auth = useAuth();

  async function refreshSessions() {
    try {
      const nextSessions = await getChatSessions();
      setSessions(nextSessions);
    } catch (sessionError) {
      console.error(sessionError);
    }
  }

  useEffect(() => {
    void refreshSessions();
  }, []);

  function updateContext(field: keyof StructuredContext, value: string) {
    setStructuredContext((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function startNewConversation() {
    setConversationId(null);
    setMessages([]);
    setStructuredContext(emptyContext);
    setMessage("");
    setError("");
  }

  async function openSession(sessionId: string) {
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
      setMessages(
        session.messages
          .map<ChatMessage | null>((item) => {
            if (item.role === "user" && typeof item.content === "string") {
              return {
                id: item._id,
                role: "user",
                content: item.content,
              };
            }

            if (item.role === "assistant" && isResearchAnswer(item.content)) {
              return {
                id: item._id,
                role: "assistant",
                answer: item.content,
                sources: item.sourcesUsed ?? [],
              };
            }

            return null;
          })
          .filter((item): item is ChatMessage => item !== null),
      );
    } catch (sessionError) {
      console.error(sessionError);
      setError("Could not open that session.");
    } finally {
      setIsHistoryLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!auth.isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    const trimmedMessage = message.trim() || structuredContext.intent.trim();

    if (!trimmedMessage) {
      setError("Ask a question or add an intent before submitting.");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessages((current) => [
      ...current,
      {
        id: makeId(),
        role: "user",
        content: trimmedMessage,
      },
    ]);

    try {
      const result = await sendChatMessage({
        conversationId,
        message: trimmedMessage,
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
      setMessage("");
      await refreshSessions();
    } catch (requestError) {
      console.error(requestError);
      setError(
        "The assistant could not respond. Check that the backend and MongoDB are running.",
      );
      toast.error("Unable to send message");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="curalink-app">
      <Sidebar
        sessions={sessions}
        conversationId={conversationId}
        isHistoryLoading={isHistoryLoading}
        isSidebarOpen={isSidebarOpen}
        onNewConversation={startNewConversation}
        onOpenSession={(id) => void openSession(id)}
        onCloseSidebar={() => setIsSidebarOpen(false)}
        loginModal={() => setIsAuthModalOpen(true)}
      />

      <section className="research-workspace">
        <section className="response-panel">
          <button
            className="sidebar-toggle-button"
            type="button"
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰
          </button>

          <div className="chat-window" aria-live="polite">
            {messages.length === 0 ? (
              <div className="empty-chat">
                <h2>Start a research session.</h2>
                <p>Add a disease, query, and optional location below.</p>
              </div>
            ) : (
              messages?.map((item) =>
                item.role === "user" ? (
                  <article className="chat-message user-message" key={item.id}>
                    <p>{item.content}</p>
                  </article>
                ) : (
                  <article
                    className="chat-message assistant-message"
                    key={item.id}
                  >
                    <span>CuraLink</span>
                    <AnswerSections
                      answer={item.answer}
                      sources={item.sources}
                      metadata={item.metadata}
                    />
                  </article>
                ),
              )
            )}

            {isLoading ? (
              <div className="loading-state">
                <span />
                Searching OpenAlex, PubMed, and ClinicalTrials.gov...
              </div>
            ) : null}
          </div>

          <QuestionForm
            structuredContext={structuredContext}
            message={message}
            isLoading={isLoading}
            error={error}
            onSubmit={handleSubmit}
            onContextChange={updateContext}
            onMessageChange={setMessage}
          />
        </section>
      </section>

      {isAuthModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <AuthModal
              open={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
            />
          </div>
        </div>
      )}
    </main>
  );
}
