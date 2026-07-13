import React, { ButtonHTMLAttributes } from "react";
import styles from "./MenuItem.module.css";

interface MenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label?: string;
  variant?: "default" | "danger";
  className?: string;
}

export function MenuItem({
  icon,
  label,
  variant = "default",
  disabled,
  className,
  ...props
}: MenuItemProps) {
  return (
    <button
      type="button"
      className={`
        ${styles.menuItem} 
        ${variant === "danger" ? styles.danger : styles.default} 
        ${className}
      `.trim()}
      disabled={disabled}
      {...props}
    >
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{label}</span>
    </button>
  );
}
