import styles from "./InputField.module.css";

type InputFieldProps = {
  type: string;
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  minLength?: number;
  onChange: (value: string) => void;
  helperText?: string;
  rightElement?: React.ReactNode;
};

export function InputField({
  type,
  label,
  value,
  maxLength,
  minLength,
  helperText = "",
  placeholder = "",
  required = false,
  disabled = false,
  rightElement,
  onChange,
}: InputFieldProps) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <div className={styles.inputWrapper}>
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
          className={`${styles.input} ${rightElement ? styles.hasRightElement : ""}`}
        />
        {rightElement && (
          <div className={styles.rightElement}>{rightElement}</div>
        )}
      </div>
      {helperText && <span className={styles.helperText}>{helperText}</span>}
    </label>
  );
}
