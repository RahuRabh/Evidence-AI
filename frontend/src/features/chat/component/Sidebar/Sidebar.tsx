import { useState } from "react";

import type { ChatSessionSummary } from "@/types/chat";

import { useAuth } from "@/features/auth/context/AuthProvider";

import { UserMenu } from "@/features/settings/components/UserMenu/UserMenu";

import { Button } from "@/components/ui/button/Button";
import { MenuItem } from "@/components/ui/MenuItem/MenuItem";

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
          <h1>AI Medical Research Assistant</h1>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCloseSidebar}
            className={styles.xButton}
          >
            x
          </Button>
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
                <MenuItem
                  label={session.title}
                  type="button"
                  onClick={() => {
                    onOpenSession(session.id);
                    onCloseSidebar();
                  }}
                  className={`${session.id === conversationId ? styles.active : "styles.inactive"}`}
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
              <p>
                {user?.name
                  ? user.name
                      .trim()
                      .split(/\s+/)
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()
                  : "NA"}
              </p>
              <img
                src={user?.picture}
                alt={user?.name || "user profile"}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
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
