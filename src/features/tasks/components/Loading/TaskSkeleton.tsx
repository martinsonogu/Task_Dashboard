import styles from "./TaskSkeleton.module.css";

export function TaskSkeleton() {
  return (
    <div
      className={styles.grid}
      aria-label="Loading tasks"
      aria-busy="true"
      role="status"
    >
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <div key={index} className={styles.card}>
          <div className={styles.topRow}>
            <span className={styles.badge} />
            <span className={styles.badgeWide} />
          </div>
          <span className={styles.title} />
          <span className={styles.body} />
          <span className={styles.bodyShort} />
          <div className={styles.actions}>
            <span className={styles.action} />
            <span className={styles.action} />
          </div>
        </div>
      ))}
    </div>
  );
}
