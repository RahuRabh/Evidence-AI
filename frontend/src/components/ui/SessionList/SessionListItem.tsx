import React, { useEffect, useRef, useState } from "react";

import styles from "./SessionListItem.module.css";

type SessionListItemProps = {
  title: string;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
};

export function SessionListItem({
  title,
  isActive,
  onSelect,
  onDelete,
  onRename,
}: SessionListItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editValue.trim() && editValue.trim() !== title) {
      onRename(editValue.trim());
    }
    setIsEditing(false);
    setShowMenu(false);
  };

  return (
    <div
      className={`${styles.sessionItem} ${isActive ? styles.active : ""}`}
      onClick={!isEditing ? onSelect : undefined}
      role="button"
      tabIndex={0}
    >
      {isEditing ? (
        <form
          onSubmit={handleRenameSubmit}
          className={styles.renameForm}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            className={styles.renameInput}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            autoFocus
            onBlur={handleRenameSubmit}
          />
        </form>
      ) : (
        <p className={styles.title} title={title}>
          {title}
        </p>
      )}

      <div className={styles.menuWrapper} ref={menuRef}>
        <button
          type="button"
          className={styles.menuTriggerButton}
          onClick={handleMenuToggle}
          aria-label="Chat Actions"
        >
          ⋮
        </button>

        {showMenu && (
          <div
            className={styles.dropdownMenu}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.dropdownItem}
              onClick={() => {
                setIsEditing(true);
                setShowMenu(false);
              }}
            >
              ✏️ Rename
            </button>
            <button
              type="button"
              className={styles.dropdownItem}
              onClick={() => {
                onDelete();
                setShowMenu(false);
              }}
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
