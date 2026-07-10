import React, { useRef, useState } from "react";

import styles from "./Settings.module.css";

import { useAuth } from "../../auth/useAuth";
import { useSetting } from "../context/useSetting";

import { InputField } from "../../../components/ui/InputField";
import { toast } from "sonner";

export function Profile() {
  const { user, updateProfile } = useAuth();
  const { closeView } = useSetting();

  const [name, setName] = useState(user?.name || "");
  const [previewImage, setPreviewImage] = useState(user?.picture || "");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ref to securely trigger hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return;
    }

    setError("");

    // save file for backend upload and generate URL for UI Preview
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await updateProfile({
        name: name,
        imageFile: imageFile,
      });
      toast.success(res?.message || "Profile Updated")
      closeView();
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "Something went wrong here. please try again!",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <div className={styles.modalContainer}>
        <button
          onClick={() => closeView()}
          type="button"
          className={styles.closeButton}
        >
          x
        </button>
        <div className={styles.avatarSection}>
          <img
            src={previewImage}
            alt={name || "user profile"}
            className={styles.avatarPreview}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          <button
            type="button"
            className={styles.uploadButton}
            onClick={() => fileInputRef.current?.click()}
          >
            ✎
          </button>
        </div>

        <div className={styles.formGroup}>
          <InputField
            type={"string"}
            label={"Display Name"}
            value={name}
            placeholder={"Your name"}
            onChange={(newValue) => setName(newValue)}
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.formGroup}>
          <InputField
            type={"email"}
            label={"Email"}
            value={user?.email || "User Email"}
            placeholder={"Your Email"}
            onChange={() => {}}
            disabled={true}
          />
        </div>

        {error && <p>{error}</p>}

        <button
          type="submit"
          className={styles.saveButton}
          disabled={isSubmitting}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
