import type { ResearchSource } from "@/types/chat";

interface SourceCardProps {
  source: ResearchSource;
  index: number;
}

import styles from "./SourceCard.module.css";

export function SourceCard({ source }: SourceCardProps) {
  const authorLine =
    source.authors.length > 0
      ? source.authors.slice(0, 2).join(", ") +
        (source.authors.length > 2 ? " et al." : "")
      : source.type === "clinical_trial"
        ? "Clinical trial record"
        : "Unknown authors";

  return (
    <article
      className={`${styles.sourceCard} ${
        source.type === "clinical_trial"
          ? styles.trialCard
          : styles.publicationCard
      }`}
    >
      <div className={styles.sourceCardTop}>
        <span className={styles.sourcePlatformBadge}>{source.platform}</span>
        <span className={styles.sourceAuthorDate}>
          {(authorLine ?? "Unknown").split(" ")[0]}
          {source.year ? ` • ${source.year}` : ""}
        </span>
      </div>

      <h3 className={styles.title}>{source.title}</h3>

      {source.supportingSnippet && (
        <p className={styles.sourceSnippet}>{source.supportingSnippet}</p>
      )}

      <div className={styles.sourceCardFooter}>
        <span className={styles.sourceScore}>
          {source.scores ? (
            <span>
              Score{" "}
              {Number.isFinite(source.scores.final)
                ? source.scores.final.toFixed(2)
                : "0.00"}
            </span>
          ) : null}
        </span>

        <a
          href={source.url}
          className={styles.sourceLink}
          target="_blank"
          rel="noreferrer"
        >
          Open source ↗
        </a>
      </div>
    </article>
  );
}
