import type { FormEvent } from "react";
import type { StructuredContext } from "../../types/chat";
import { InputField } from "../ui/InputField";

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
    <form className="question-palette" onSubmit={onSubmit}>
      <div className="question-palette-inner">
        <div className="context-fields">
          
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

        <div className="message-row">
          <textarea
            id="message-input"
            value={message}
            onChange={(event) => onMessageChange(event.target.value)}
            placeholder="Ask a follow-up or describe the research question..."
            rows={1}
            disabled={isLoading}
          />

          <button
            className="primary-button-form"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Asking..." : "Ask"}
          </button>
        </div>

        {error ? <p className="form-error">{error}</p> : null}
      </div>
    </form>
  );
}
