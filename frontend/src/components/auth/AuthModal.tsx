import { useState } from "react";
import { AuthForm } from "./AuthForm";
import { GoogleLoginButton } from "./GoogleLoginButton";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AuthModal({ open, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");

  if (!open) return null;

  return (
    <div className="auth-modal">
      <div className="auth-copy">
        <p className="eyebrow">Research Medical Assistant</p>
        <button type="button" className="modal-close-button" onClick={onClose}>
          x
        </button>
        <p>Access your saved conversations and AI-powerder medical research.</p>
      </div>
      <AuthForm mode={mode} onSuccess={onClose} />
      <span>
        {mode === "login" ? (
          <>
            <p>Don't have an account?</p>
            <button
              className="auth-footer-button"
              type="button"
              onClick={() => setMode("register")}
            >
              Create one
            </button>
          </>
        ) : (
          <>
            <p>Already have an account?</p>
            <button
              className="auth-footer-button"
              type="button"
              onClick={() => setMode("login")}
            >
              Log in instead
            </button>
          </>
        )}
      </span>
      <div className="auth-divider">
        <p>OR</p>
        <GoogleLoginButton onClose={onClose} />
      </div>
    </div>
  );
}
