import type { ResearchSource } from "@/types/chat";

import { SourceCard } from "../SourceCard/SourceCard";

import styles from "./SourceGrid.module.css";

type SourceGridProps = {
  title: string;
  sources: ResearchSource[];
  emptyText: string;
};

export function SourceGrid({ title, sources, emptyText }: SourceGridProps) {
  return (
    <div className={styles.sourceGridWrapper}>
      <div className={styles.sectionRowHeading}>
        <h3>{title}</h3>
        <span>{sources.length}</span>
      </div>

      {sources.length > 0 ? (
        <div className={styles.sourceGrid}>
          {sources.map((source, index) => (
            <SourceCard
              key={`${source.platform}-${source.title}-${index}`}
              source={source}
              index={index}
            />
          ))}
        </div>
      ) : (
        <p className={styles.mutedText}>{emptyText}</p>
      )}
    </div>
  );
}
