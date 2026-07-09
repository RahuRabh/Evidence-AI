import { useState } from "react";

import type { ChatSessionSummary } from "../../types/chat";
import { useAuth } from "../../features/auth/AuthProvider";

import { UserMenu } from "../../features/profile/UserMenu";

type SidebarProps = {
  sessions: ChatSessionSummary[];
  conversationId: string | null;
  isHistoryLoading: boolean;
  isSidebarOpen: boolean;
  onCloseSidebar: () => void;
  onNewConversation: () => void;
  onOpenSession: (sessionId: string) => void;
  loginModal: () => void;
};

export function Sidebar({
  sessions,
  conversationId,
  isHistoryLoading,
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
        className={
          isSidebarOpen ? "sidebar-overlay visible" : "sidebar-overlay"
        }
        onClick={onCloseSidebar}
      />

      <aside
        className={
          isSidebarOpen
            ? "session-sidebar session-sidebar-open"
            : "session-sidebar"
        }
      >
        <div className="sidebar-mobile-header">
          <div className="brand-block">
            <p className="eyebrow">CuraLink</p>
            <h1>AI Medical Research Assistant</h1>
          </div>

          <button
            className="sidebar-close-button"
            type="button"
            onClick={onCloseSidebar}
          >
            ✕
          </button>
        </div>

        <button
          className="create-session-button"
          type="button"
          onClick={onNewConversation}
        >
          + Create new session
        </button>

        <section className="history-section">
          <div className="sidebar-heading">
            <h2>Chat History</h2>
          </div>

          {isHistoryLoading ? (
            <p className="muted-text">Loading session...</p>
          ) : null}

          <div className="history-list">
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <button
                  key={session.id}
                  type="button"
                  className={
                    session.id === conversationId
                      ? "history-item active"
                      : "history-item"
                  }
                  onClick={() => {
                    onOpenSession(session.id);
                    onCloseSidebar();
                  }}
                >
                  <strong>{session.title}</strong>
                </button>
              ))
            ) : (
              <p className="muted-text">
                Your saved research sessions will appear here.
              </p>
            )}
          </div>
        </section>

        <section className="sidebar-footer">
          {isAuthenticated ? (
            <div onClick={toggleUserMenu} className="user-info">
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
            <button onClick={loginModal} className="logout-action">
              Log In
            </button>
          )}
        </section>
      </aside>
    </>
  );
}
