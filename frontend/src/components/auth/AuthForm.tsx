import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { useAuth } from "../../features/auth/useAuth";
import type { AuthMode } from "./AuthModal";
import { sendOtpRequest, verifyOtpRequest } from "../../api/auth";

type AuthFormProps = {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
  onSuccess: () => void;
};

export function AuthForm({ onSuccess, mode, setMode }: AuthFormProps) {
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "register") {
        const res = await register(name, email, password);
        toast.success(res?.message || "Registered successfully");
        onSuccess();
      } else if (mode === "login") {
        const res = await login(email, password);
        toast.success(res?.message || "Logged in successfully.");
        onSuccess();
      } else if (mode === "forgot") {
        const res = await sendOtpRequest(email);
        toast.success(res?.message || "OTP sent successfully.");
        setMode("verify");
      } else if (mode === "verify") {
        const res = await verifyOtpRequest({
          email,
          otp,
          newPassword: password,
        });
        toast.success(res?.message || "Password updated successfully");
        setMode("login");
        setPassword("");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "Something went wrong here. please try again!",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-card">
      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === "register" && (
          <label className="field">
            <span>Name</span>
            <input
              type="string"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="your name"
              required
            />
          </label>
        )}

        {/* EMAIL: Shown in all states except during OTP verification */}
        {mode !== "verify" && (
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
        )}

        {/* OTP INPUT: Only shown during verification stage */}
        {mode === "verify" && (
          <label className="field">
            <span>Verification Code</span>
            <input
              type="text"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              placeholder="6-digit code"
              maxLength={6}
              className="text-center tracking-widest font-bold"
              required
            />
          </label>
        )}

        {/* PASSWORD / NEW PASSWORD: Hide only during the initial email OTP request stage */}
        {mode !== "forgot" && (
          <label className="field">
            <span>{mode === "verify" ? "New Password" : "Password"}</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 8 characters"
              minLength={8}
              required
            />
          </label>
        )}

        {/* FORGOT PASSWORD INLINE LINK BUTTON */}
        {mode === "login" && (
          <button
            type="button"
            className="forgot-password-link"
            style={{
              textDecoration: "underline",
              fontSize: "13px",
              cursor: "pointer",
              alignSelf: "flex-end",
              border: "none",
              background: "none",
              color: "gray",
              marginTop: "-8px",
              marginBottom: "8px",
            }}
            onClick={() => {
              setError("");
              setMode("forgot");
            }}
          >
            Forgot Password?
          </button>
        )}

        {error ? <p className="form-error">{error}</p> : null}

        <button
          className="primary-button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Please wait..."
            : mode === "login"
              ? "Log In"
              : mode === "register"
                ? "Register"
                : mode === "forgot"
                  ? "Get Code"
                  : "Save New Password"}
        </button>
      </form>
    </div>
  );
}
