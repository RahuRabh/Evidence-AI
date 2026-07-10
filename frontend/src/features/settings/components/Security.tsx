import React, { useState } from "react";

import styles from "./Settings.module.css";

import { useAuth } from "../../auth/useAuth";

import { useSetting } from "../context/useSetting";

import { PasswordInput } from "../../../components/ui/PasswordInput";
import { toast } from "sonner";

export function Security() {
  const { updatePassword } = useAuth();
  const { closeView } = useSetting();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await updatePassword({
        currentPassword: currentPassword,
        newPassword: newPassword,
      });
      toast.success("Password updated");
      closeView();
    } catch (err: any) {
      setError(
        err?.response?.data?.error || "Something went wrong. Please try again!",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalContainer}>
      <button
        onClick={() => closeView()}
        type="button"
        className={styles.closeButton}
      >
        x
      </button>

      <form
        onSubmit={handleSave}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div className={styles.formGroup}>
          <PasswordInput
            label={"Current Password"}
            value={currentPassword}
            placeholder={"Enter Current Password"}
            onChange={(newValue) => setCurrentPassword(newValue)}
          />
        </div>

        <div className={styles.formGroup}>
          <PasswordInput
            label={"New Password"}
            value={newPassword}
            placeholder={"Enter New Password"}
            onChange={(newValue) => setNewPassword(newValue)}
          />
        </div>

        {error && <p>{error}</p>}

        <button
          type="submit"
          className={styles.saveButton}
          disabled={isSubmitting}
        >
          Change Password
        </button>
      </form>
    </div>
  );
}
