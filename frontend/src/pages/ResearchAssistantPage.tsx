import { toast } from "sonner";
import { useState, FormEvent } from "react";
import { AnswerSections } from "../components/chat/AnswerSections";

import { QuestionForm } from "../components/chat/QuestionForm";
import { Sidebar } from "../components/chat/Sidebar";
import { useAuth } from "../features/auth/AuthProvider";
import { AuthModal } from "../components/auth/AuthModal";
import { useChat } from "../features/chat/useChat";

export function ResearchAssistantPage() {
  const auth = useAuth();
  const chat = useChat();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [message, setMessage] = useState("");

  const handleOpenSession = async (id: string) => {
    try {
      await chat.openSession(id);
    } catch {
      toast.error("Failed to load historical session details");
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!auth.isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    const trimmed = message.trim() || chat.structuredContext.intent.trim();
    if (!trimmed) {
      toast.warning(
        "Plwase type a message query or select a patient intent input",
      );
    }

    try {
      setMessage("");
      await chat.sendMessage(trimmed);
    } catch {
      toast.error("Unable to compile medical assistant response");
      setMessage(trimmed);
    }
  };

  return (
    <main className="curalink-app">
      <Sidebar
        sessions={chat.sessions}
        conversationId={chat.conversationId}
        isHistoryLoading={chat.isHistoryLoading}
        isSidebarOpen={isSidebarOpen}
        onNewConversation={chat.resetChatState}
        onOpenSession={(id) => void handleOpenSession(id)}
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
            {chat.messages.length === 0 ? (
              <div className="empty-chat">
                <h2>Start a research session.</h2>
                <p>Add a disease, query, and optional location below.</p>
              </div>
            ) : (
              chat.messages?.map((item) =>
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
                      isHistoryLoading={chat.isHistoryLoading}
                    />
                  </article>
                ),
              )
            )}

            {chat.isLoading ? (
              <div className="loading-state">
                <span />
                Searching OpenAlex, PubMed, and ClinicalTrials.gov...
              </div>
            ) : null}
          </div>

          <QuestionForm
            structuredContext={chat.structuredContext}
            message={message}
            isLoading={chat.isLoading}
            error={chat.error}
            onSubmit={onSubmit}
            onContextChange={chat.updateContext}
            onMessageChange={setMessage}
          />
        </section>
      </section>

      {isAuthModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsAuthModalOpen(false)}
        >
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
