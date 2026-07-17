import type {
  ResearchAnswer,
  ResearchSource,
  RetrievalMetadata,
} from "@/types/chat";

import { SourceCard } from "../SourceCard/SourceCard";
import { ResearchDetails } from "../ResearchDetails/ResearchDetails";

import styles from "./AnswerSection.module.css";

interface AnswerSectionsProps {
  answer: ResearchAnswer;
  sources?: ResearchSource[];
  metadata?: RetrievalMetadata;
  isHistoryLoading: boolean;
}

export function AnswerSections({
  answer,
  sources = [],
  metadata,
  isHistoryLoading,
}: AnswerSectionsProps) {
  const publications = sources.filter((s) => s.type !== "clinical_trial");
  const trials = sources.filter((s) => s.type === "clinical_trial");

  return (
    <div className={styles.answerSections}>
      {isHistoryLoading ? (
        <div className={styles.loader}></div>
      ) : null}

      <div className={styles.answerCard}>
        <p className={styles.answerLabel}>Condition overview</p>
        <p className={styles.answerTakeaway}>{answer.conditionOverview}</p>
      </div>

      {(answer.researchInsights ?? []).length > 0 && (
        <div className={styles.answerCard}>
          <p className={styles.answerLabel}>Research insights</p>
          <ul className={styles.answerInsights}>
            {answer.researchInsights.map((insight) => (
              <li className={styles.answerTakeaway} key={insight}>{insight}</li>
            ))}
          </ul>
        </div>
      )}

      {answer.personalizedTakeaway && (
        <div className={styles.answerCard}>
          <p className={styles.answerLabel}>Personalized takeaway</p>
          <p className={styles.answerTakeaway}>{answer.personalizedTakeaway}</p>
        </div>
      )}

      {(publications.length > 0 || trials.length > 0) && (
        <div className={styles.inlineEvidence}>
          {publications.length > 0 && (
            <div className={styles.inlineEvidenceColumn}>
              <p className={styles.inlineEvidenceHeading}>
                Source publications ({publications.length})
              </p>
              <div className={styles.sourceCardGrid}>
                {publications?.map((source, index) => (
                  <SourceCard
                    key={`${source.platform}-${source.title}`}
                    source={source}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}

          {trials.length > 0 && (
            <div className={styles.inlineEvidenceColumn}>
              <p className={styles.inlineEvidenceHeading}>
                Clinical trials ({trials.length})
              </p>
              <div className={styles.sourceCardGrid}>
                {trials.map((source, index) => (
                  <SourceCard
                    key={`${source.platform}-${source.title}`}
                    source={source}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Medical Disclaimer */}
      {answer.medicalDisclaimer && (
        <p className={styles.medicalDisclaimer}>{answer.medicalDisclaimer}</p>
      )}

      {metadata ? <ResearchDetails metadata={metadata} /> : null}
      
    </div>
  );
}
