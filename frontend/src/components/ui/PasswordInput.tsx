import React, { useState } from "react";
import { InputField } from "./InputField"

import styles from "./PasswordInput.module.css"

type PasswordInputProps = {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

export function PasswordInput({ label, value, placeholder, onChange }: PasswordInputProps) {
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
      type={showPassword ? "text" : "password"} // The core trick!
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder || "••••••••"}
      rightElement={ToggleButton}
    />
  );
}