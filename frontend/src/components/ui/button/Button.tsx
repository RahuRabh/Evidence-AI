import { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  type = "button",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const buttonClass = `
    ${styles.button}
    ${styles[variant]}
    ${styles[size]}
    ${isLoading ? styles.loading : ""}
    ${className}
    `.trim();

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className={styles.spinner}>{styles.spinner}</span>
      ) : null}
      <span className={styles.content}>{children}</span>
    </button>
  );
}