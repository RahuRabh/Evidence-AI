import { useState } from "react";

import { AuthForm } from "./AuthForm";
import { GoogleLoginButton } from "./GoogleLoginButton";

import { Button } from "../../../components/ui/button/Button";

import styles from "./Auth.module.css";

type AuthModalProps = {
  open: boolean;
  closeModal: () => void;
};

export type AuthMode = "login" | "register" | "forgot" | "verify";

export function AuthModal({ open, closeModal }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("login");

  if (!open) return null;

  return (
    <div className={styles.authModal}>
      <div className={styles.authHeader}>
        <p className={styles.eyebrow}>Research Medical Assistant</p>
        <Button
          variant="ghost"
          size="icon"
          onClick={closeModal}
          aria-label="Close"
          className={styles.xButton}
        >
          x
        </Button>
        <p className={styles.para}>
          Access your saved conversations and AI-powered medical research
        </p>
      </div>

      <AuthForm mode={mode} setMode={setMode} onSuccess={closeModal} />

      <div className={styles.modalFooter}>
        {mode === "login" && (
          <div className={styles.buttonGroup}>
            <p>Don't have an account?</p>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setMode("register")}
              className={styles.authButtons}
            >
              Create One
            </Button>
          </div>
        )}

        {mode === "register" && (
          <div className={styles.buttonGroup}>
            <p>Already have an account?</p>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setMode("login")}
              className={styles.authButtons}
            >
              Log in
            </Button>
          </div>
        )}

        {(mode === "forgot" || mode === "verify") && (
          <div className={styles.buttonGroup}>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setMode("login")}
              className={styles.authButtons}
            >
              {" "}
              ← Back to Log In
            </Button>
          </div>
        )}

        {(mode === "login" || mode === "register") && (
          <div className={styles.authDivider}>
            <p>OR</p>
            <GoogleLoginButton onClose={closeModal} />
          </div>
        )}
      </div>
    </div>
  );
}
