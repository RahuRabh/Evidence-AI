import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { useAuth } from "../../features/auth/useAuth";

type AuthFormProps = {
  mode: "login" | "register";
  onSuccess: () => void;
};

export function AuthForm({ onSuccess, mode }: AuthFormProps) {
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
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
      } else {
        const res = await login(email, password);
        toast.success(res?.message || "Logged in successfully.");
      }
      onSuccess();
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

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimum 8 characters"
            minLength={8}
            required
          />
        </label>

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
              : "Register"}
        </button>
      </form>
    </div>
  );
}
