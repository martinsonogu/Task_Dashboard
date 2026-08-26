import type { TaskPriority } from "../../types/task.types";
import styles from "./PriorityBadge.module.css";
export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={`${styles.badge} ${styles[priority]}`}>{priority}</span>
  );
}
