import React from "react";

import styles from "./SessionListItem.module.css";

import { Button } from "@/components/ui/button/Button";

type SessionListItemProps = {
  title: string;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
};

export function SessionListItem({
  title,
  isActive,
  onSelect,
  onDelete,
}: SessionListItemProps) {
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    onDelete();
  };

  return (
    <div 
      className={`${styles.sessionItem} ${isActive ? styles.active : ""}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
    >
      <p className={styles.title} title={title}>
        {title}
      </p>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={styles.deleteButton}
        onClick={handleDeleteClick}
        aria-label={`Delete ${title}`}
      >
        🗑️
      </Button>
    </div>
  );
}