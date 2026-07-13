import type { FormEvent } from "react";

import type { StructuredContext } from "@/types/chat";

import { Button } from "@/components/ui/button/Button";
import { InputField } from "@/components/ui/InputField/InputField";

import styles from "./QuestionForm.module.css";

type QuestionFormProps = {
  structuredContext: StructuredContext;
  message: string;
  isLoading: boolean;
  error: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onContextChange: (field: keyof StructuredContext, value: string) => void;
  onMessageChange: (value: string) => void;
};

export function QuestionForm({
  structuredContext,
  message,
  isLoading,
  error,
  onSubmit,
  onContextChange,
  onMessageChange,
}: QuestionFormProps) {
  return (
    <form className={styles.questionPalette} onSubmit={onSubmit}>
      <div className={styles.questionPaletteInner}>
        <div className={styles.contextFields}>
          <InputField
            type={"string"}
            label={"Patient Optional"}
            value={structuredContext.patientName}
            onChange={(newValue) => onContextChange("patientName", newValue)}
            placeholder={"John Smith"}
          />

          <InputField
            type={"string"}
            label={"Disease"}
            value={structuredContext.disease}
            onChange={(newValue) => onContextChange("disease", newValue)}
            placeholder={"Parkinson's disease"}
          />

          <InputField
            type={"string"}
            label={"Intent"}
            value={structuredContext.intent}
            onChange={(newValue) => onContextChange("intent", newValue)}
            placeholder={"Deep Brain Stimulation"}
          />

          <InputField
            type={"string"}
            label={"Location optional"}
            value={structuredContext.location}
            onChange={(newValue) => onContextChange("location", newValue)}
            placeholder={"Toronto, Canada"}
          />
        </div>

        <div className={styles.messageRow}>
          <textarea
            id="message-input"
            value={message}
            onChange={(event) => onMessageChange(event.target.value)}
            placeholder="Ask a follow-up or describe the research question..."
            rows={1}
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading}
            size="sm"
            variant="primary"
            className={styles.askButton}
          >
            {isLoading ? "Asking..." : "Ask"}
          </Button>
        </div>

        {error ? <p className={styles.formError}>{error}</p> : null}
      </div>
    </form>
  );
}
