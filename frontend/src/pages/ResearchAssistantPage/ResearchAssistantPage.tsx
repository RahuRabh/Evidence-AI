import { toast } from "sonner";
import { useState, FormEvent } from "react";

import { useAuth } from "@/features/auth/context/useAuth";
import { useChat } from "@/features/chat/context/useChat";
import { useSetting } from "@/features/settings/context/useSetting";

import { AuthModal } from "@/features/auth/component/AuthModal/AuthModal";

import { Sidebar } from "@/features/chat/component/Sidebar/Sidebar";
import { QuestionForm } from "@/features/chat/component/QuestionForm/QuestionForm";
import { AnswerSections } from "@/features/chat/component/AnswerSection/AnswerSection";

import { Profile } from "@/features/settings/components/Profile/Profile";
import { Security } from "@/features/settings/components/Security/Security";

import { Button } from "@/components/ui/button/Button";
import { LoadingPipeline } from "@/features/chat/component/LoadingPipeline.tsx/LoadingPipeline";

import styles from "./ResearchAssistantPage.module.css";

export function ResearchAssistantPage() {
  const { isAuthenticated, isAuthModalOpen, closeAuthModal, openAuthModal } =
    useAuth();

  const {
    sessions,
    sendMessage,
    isLoading,
    error,
    updateContext,
    conversationId,
    resetChatState,
    messages,
    isHistoryLoading,
    openSession,
    structuredContext,
  } = useChat();

  const { activeView } = useSetting();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleOpenSession = async (id: string) => {
    try {
      await openSession(id);
    } catch {
      toast.error("Failed to load historical session details");
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    const trimmed = message.trim() || structuredContext.intent.trim();
    if (!trimmed) {
      toast.warning(
        "Please type a message query or select a patient intent input",
      );
    }

    try {
      setMessage("");
      await sendMessage(trimmed);
    } catch {
      toast.error("Unable to compile medical assistant response");
      setMessage(trimmed);
    }
  };

  return (
    <main className={styles.assistantApp}>
      <Sidebar
        sessions={sessions}
        conversationId={conversationId}
        isSidebarOpen={isSidebarOpen}
        onNewConversation={resetChatState}
        onOpenSession={(id) => void handleOpenSession(id)}
        onCloseSidebar={() => setIsSidebarOpen(false)}
      />

      <section className={styles.researchWorkspace}>
        <section className={styles.responsePanel}>
          <Button
            type="button"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className={styles.sidebartoggleButton}
          >
            ☰
          </Button>

          <div className={styles.chatWindow} aria-live="polite">
            {messages.length === 0 ? (
              <div className={styles.emptyChat}>
                <h2>Start a research session.</h2>
                <p>Add a disease, query, and optional location below.</p>
              </div>
            ) : (
              messages?.map((item) =>
                item.role === "user" ? (
                  <article
                    className={`${styles.chatMessage} ${styles.userMessage}`}
                    key={item.id}
                  >
                    <p>{item.content}</p>
                  </article>
                ) : (
                  <article
                    className={`${styles.chatMessage} ${styles.assistantMessage}`}
                    key={item.id}
                  >
                    <AnswerSections
                      answer={item.answer}
                      sources={item.sources}
                      metadata={item.metadata}
                      isHistoryLoading={isHistoryLoading}
                    />
                  </article>
                ),
              )
            )}
            
            {/* If loading show loading messages */}
            {isLoading && <LoadingPipeline />}

          </div>

          <QuestionForm
            structuredContext={structuredContext}
            message={message}
            isLoading={isLoading}
            error={error}
            onSubmit={onSubmit}
            onContextChange={updateContext}
            onMessageChange={setMessage}
          />
        </section>
      </section>

      {isAuthModalOpen && (
        <div className={styles.modalOverlay} onClick={() => closeAuthModal()}>
          <div
            className={styles.modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <AuthModal open={isAuthModalOpen} closeModal={closeAuthModal} />
          </div>
        </div>
      )}

      {activeView && (
        <section className={styles.workspaceOverlay}>
          {activeView === "profile" && <Profile />}
          {activeView === "security" && <Security />}
          {activeView === "settings" && <Security />}
        </section>
      )}
    </main>
  );
}
