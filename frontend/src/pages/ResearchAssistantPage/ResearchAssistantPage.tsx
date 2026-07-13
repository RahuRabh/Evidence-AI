import { toast } from "sonner";
import { useState, FormEvent } from "react";

import { useChat } from "@/features/chat/context/useChat";
import { Sidebar } from "@/features/chat/component/Sidebar/Sidebar";
import { QuestionForm } from "@/features/chat/component/QuestionForm/QuestionForm";
import { AnswerSections } from "@/features/chat/component/AnswerSection/AnswerSection";

import { useAuth } from "@/features/auth/context/useAuth";
import { AuthModal } from "@/features/auth/component/AuthModal/AuthModal";

import { useSetting } from "@/features/settings/context/useSetting";
import { Profile } from "@/features/settings/components/Profile/Profile";
import { Security } from "@/features/settings/components/Security/Security";

import styles from "./ResearchAssistantPage.module.css"
import { Button } from "@/components/ui/button/Button";

export function ResearchAssistantPage() {
  const auth = useAuth();
  const chat = useChat();
  const { activeView } = useSetting();

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
    <main className={styles.assistantApp}>
      <Sidebar
        sessions={chat.sessions}
        conversationId={chat.conversationId}
        isSidebarOpen={isSidebarOpen}
        onNewConversation={chat.resetChatState}
        onOpenSession={(id) => void handleOpenSession(id)}
        onCloseSidebar={() => setIsSidebarOpen(false)}
        loginModal={() => setIsAuthModalOpen(true)}
      />

      <section className={styles.researchWorkspace}>
        <section className={styles.responsePanel}>
          
          <Button
          type="button"
          size="icon"
          onClick={() => setIsSidebarOpen(true)}
          className={styles.sidebartoggleButton}
          >☰</Button>

          <div className={styles.chatWindow} aria-live="polite">
            {chat.messages.length === 0 ? (
              <div className={styles.emptyChat}>
                <h2>Start a research session.</h2>
                <p>Add a disease, query, and optional location below.</p>
              </div>
            ) : (
              chat.messages?.map((item) =>
                item.role === "user" ? (
                  <article className={`${styles.chatMessage} ${styles.userMessage}`} key={item.id}>
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
                      isHistoryLoading={chat.isHistoryLoading}
                    />
                  </article>
                ),
              )
            )}

            {chat.isLoading ? (
              <div className={styles.loadingState}>
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
          className={styles.modalOverlay}
          onClick={() => setIsAuthModalOpen(false)}
        >
          <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <AuthModal
              open={isAuthModalOpen}
              closeModal={() => setIsAuthModalOpen(false)}
            />
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
