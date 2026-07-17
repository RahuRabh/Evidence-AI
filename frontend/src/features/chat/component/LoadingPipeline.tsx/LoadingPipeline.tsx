import styles from "./LoadingPipeline.module.css";

export function LoadingPipeline() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loaderGraphic}>
        <div className={styles.spinnerCore}></div>
      </div>

      <div className={styles.pipelineTracks}>
        <span className={styles.trackStep}>
          <span className={styles.stepPulse}></span>
          Searching OpenAlex, PubMed, and ClinicalTrials.gov...
        </span>
        <span className={styles.trackStep}>
          <span className={styles.stepPulse}></span>
          Deduplicating cross-provider literature strings...
        </span>
        <span className={styles.trackStep}>
          <span className={styles.stepPulse}></span>
          Applying multi-signal hybrid ranking (BM25 & Vector)...
        </span>
        <span className={styles.trackStep}>
          <span className={styles.stepPulse}></span>
          Synthesizing evidence and pinning verified citations...
        </span>
      </div>
    </div>
  );
}
