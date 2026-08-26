import type { TaskStatus } from "../../types/task.types";
import { statusLabels } from "../../utils/taskHelpers";
import styles from "./StatusBadge.module.css";
export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
