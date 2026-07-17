import { toast } from "sonner";
import { useState } from "react";

import { useAuth } from "@/features/auth/context/useAuth";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

import styles from "./GoogleLoginButton.module.css";

type GoogleLoginButtonProps = {
  onClose: () => void;
};

export function GoogleLoginButton({ onClose }: GoogleLoginButtonProps) {
  const { loginWithGoogle } = useAuth();

  const [isPending, setIsPending] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;
    if (!idToken) return;

    try {
      setIsPending(true);
      setGoogleError(null);

      await loginWithGoogle(idToken);

      toast.success("Logged in with Google.");
      onClose();
    } catch (error) {
      console.error("Google Auth Error:", error);
      setGoogleError("Google login failed. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
      {googleError && (
        <p
          className="google-error"
          style={{ color: "red", fontSize: "13px", marginBottom: "8px" }}
        >
          {googleError}
        </p>
      )}

      <div
        className={`${styles.container} ${isPending ? styles.pending : ""}`}
      >

        {isPending && <div className={styles.loader}></div>}
        
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => {
            setGoogleError("Google Sign-In initialization failed.");
          }}
        />
      </div>
    </div>
  );
}
