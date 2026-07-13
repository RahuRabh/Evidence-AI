import { useState } from "react";

import type { RetrievalMetadata } from "@/types/chat";

import styles from "./ResearchDetails.module.css";

type ResearchDetailsProps = {
  metadata: RetrievalMetadata;
};

export function ResearchDetails({ metadata }: ResearchDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.researchDetails}>
      <button
        type="button"
        className={`{styles.researchDetailsToggle} ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className={styles.researchDetailsLabel}>Research details</span>

        <span className={styles.chevron}>{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className={styles.researchDetailsBody}>
          <div className={styles.researchDetailRow}>
            <span className={styles.researchDetailLabel}>Candidates</span>

            <div className={styles.researchDetailPills}>
              <span className={styles.researchDetailPill}>
                Fetched {metadata.retrievalStats.totalBeforeDedup}
              </span>

              <span className={styles.researchDetailPill}>
                Unique {metadata.retrievalStats.totalAfterDedup}
              </span>

              <span className={styles.researchDetailPill}>
                Selected {metadata.rankingStats.selectedCount}
              </span>
            </div>
          </div>

          <div className={styles.researchDetailRow}>
            <span className={styles.researchDetailLabel}>Sources</span>

            <div className={styles.researchDetailPills}>
              <span className={styles.researchDetailPill}>
                PubMed {metadata.retrievalStats.pubMedCount}
              </span>

              <span className={styles.researchDetailPill}>
                OpenAlex {metadata.retrievalStats.openAlexCount}
              </span>

              <span className={styles.researchDetailPill}>
                ClinicalTrials {metadata.retrievalStats.clinicalTrialsCount}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
