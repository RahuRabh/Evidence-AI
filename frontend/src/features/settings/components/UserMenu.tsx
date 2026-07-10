import { useAuth } from "../../auth/useAuth";
import { useSetting } from "../context/useSetting";

type UserMenuProps = {
  onClose: () => void;
};

export function UserMenu({ onClose }: UserMenuProps) {
  const { user, logout } = useAuth();
  const { openView } = useSetting();

  return (
    <div className="pop-over-container" onClick={(e) => e.stopPropagation()}>
      <div className="pop-over-header">
        <p className="pop-over-name">{user?.name || "No Name"}</p>
        <p className="pop-over-email">{user?.email || "No Email"}</p>
        <button
          className="profile-close-button"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      <div className="pop-over-divider" />

      <div className="pop-over-menu">
        <button
          className="pop-over-item"
          onClick={() => {
            openView("profile");
          }}
        >
          <span className="icon">👤</span> Profile
        </button>
        <button
          className="pop-over-item"
          disabled
          onClick={() => {
            openView("settings");
          }}
        >
          <span className="icon">⚙️</span> Settings
        </button>
        <button
          className="pop-over-item"
          onClick={() => {
            openView("security");
          }}
        >
          <span className="icon">🔑</span> Change Password
        </button>
      </div>

      <div className="pop-over-divider" />

      <button className="pop-over-item logout-action" onClick={() => logout()}>
        <span className="icon">🚪</span> Logout
      </button>
    </div>
  );
}
