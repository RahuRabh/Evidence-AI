import { useState } from "react";

import type { ChatSessionSummary } from "@/types/chat";

import { useAuth } from "@/features/auth/context/AuthProvider";
import { useChat } from "../../context/useChat";

import { Button } from "@/components/ui/button/Button";
import { Avatar } from "@/components/ui/Avatar/Avatar";
import { UserMenu } from "@/features/settings/components/UserMenu/UserMenu";
import { SessionListItem } from "@/components/ui/SessionList/SessionListItem";

import { getInitials } from "@/utils/genInitials";

import styles from "./Sidebar.module.css";

type SidebarProps = {
  sessions: ChatSessionSummary[];
  conversationId: string | null;
  isSidebarOpen: boolean;
  onCloseSidebar: () => void;
  onNewConversation: () => void;
  onOpenSession: (sessionId: string) => void;
  loginModal: () => void;
};

export function Sidebar({
  sessions,
  conversationId,
  isSidebarOpen,
  onCloseSidebar,
  onNewConversation,
  onOpenSession,
  loginModal,
}: SidebarProps) {
  const { deleteMessage } = useChat();
  const { isAuthenticated, user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleUserMenu = () => setShowUserMenu((prev) => !prev);
  return (
    <>
      <div
        className={`${styles.sidebarOverlay} ${isSidebarOpen ? styles.visible : ""}`}
        onClick={onCloseSidebar}
      />

      <aside
        className={`${styles.sessionSidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.sidebarMobileHeader}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCloseSidebar}
            className={styles.xButton}
          >
            x
          </Button>
          <h1>AI Medical Research Assistant</h1>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onNewConversation}
        >
          + Create new session
        </Button>

        <section className={styles.historySection}>
          <h2>Chat History</h2>

          {sessions.length > 0 ? (
            sessions.map((session) => (
              <SessionListItem
                key={session.id}
                title={session.title}
                isActive={session.id === conversationId}
                onSelect={() => {
                  onOpenSession(session.id);
                  onCloseSidebar();
                }}
                onDelete={() => {
                  // Prompt for confirmation, then call your delete API/Context
                  if (
                    window.confirm("Are you sure you want to delete this chat?")
                  ) {
                    deleteMessage(conversationId);
                  }
                }}
              />
            ))
          ) : (
            <p className={styles.mutedText}>
              Your saved research sessions will appear here.
            </p>
          )}
        </section>

        {isAuthenticated ? (
          <div onClick={toggleUserMenu} className={styles.userInfo}>
            {showUserMenu && (
              <UserMenu onClose={() => setShowUserMenu(false)} />
            )}
            <p>{getInitials(user?.name)}</p>

            <Avatar src={user?.image} name={user?.name} size="md" />
          </div>
        ) : (
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={loginModal}
          >
            Log In
          </Button>
        )}
      </aside>
    </>
  );
}
