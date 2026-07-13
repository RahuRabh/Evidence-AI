import { useAuth } from "@/features/auth/context/useAuth";
import { useSetting } from "@/features/settings/context/useSetting";

import { Button } from "@/components/ui/button/Button";
import { MenuItem } from "@/components/ui/MenuItem/MenuItem";

import styles from "./UserMenu.module.css";

type UserMenuProps = {
  onClose: () => void;
};

export function UserMenu({ onClose }: UserMenuProps) {
  const { user, logout } = useAuth();
  const { openView } = useSetting();

  return (
    <div
      className={styles.popoverContainer}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.popoverHeader}>
        <p className={styles.popoverName}>{user?.name || "No Name"}</p>
        <p className={styles.popoverEmail}>{user?.email || "No Email"}</p>
        <Button
          size="icon"
          variant="ghost"
          type="button"
          className={styles.xButton}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          x
        </Button>
      </div>

      <div className={styles.popoverDivider} />

      <div className={styles.popoverMenu}>
        <MenuItem
          icon="👤"
          label="Profile"
          variant="default"
          onClick={() => openView("profile")}
        />

        <MenuItem
          icon="⚙️"
          label="Settings"
          variant="default"
          onClick={() => {
            openView("security");
          }}
        />

        <MenuItem
          icon="🔑"
          variant="default"
          label="Change Password"
          onClick={() => {
            openView("security");
          }}
        />
      </div>

      <div className={styles.popoverDivider} />

      <div className={styles.popoverMenu}>
        <MenuItem
          variant="danger"
          icon="🚪"
          label="Logout"
          onClick={() => logout()}
        />
      </div>
    </div>
  );
}
