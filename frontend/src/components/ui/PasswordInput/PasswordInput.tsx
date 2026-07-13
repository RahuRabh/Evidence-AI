import React, { useState } from "react";
import { InputField } from "../InputField/InputField"

import styles from "./PasswordInput.module.css";

type PasswordInputProps = {
  label: string;
  value: string;
  minLength?: number;
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
};

export function PasswordInput({
  label,
  value,
  minLength,
  required,
  placeholder,
  onChange,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  const ToggleButton = (
    <button
      type="button"
      onClick={toggleVisibility}
      className={styles.iconButton}
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? "👁️‍🗨️" : "👁️"}
    </button>
  );

  return (
    <InputField
      type={showPassword ? "text" : "password"}
      label={label}
      value={value}
      onChange={onChange}
      minLength={minLength}
      required={required}
      placeholder={placeholder || "••••••••"}
      rightElement={ToggleButton}
    />
  );
}
