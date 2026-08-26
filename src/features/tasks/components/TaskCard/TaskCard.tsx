import { Button } from "@/shared/components/Button/Button";
import type { Task, TaskStatus } from "../../types/task.types";
import { formatDate } from "../../utils/taskHelpers";
import { PriorityBadge } from "../PriorityBadge/PriorityBadge";
import { StatusBadge } from "../StatusBadge/StatusBadge";
import styles from "./TaskCard.module.css";
interface Props {
  task: Task;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatus: (id: string, status: TaskStatus) => void;
  compact?: boolean;
}
export function TaskCard({ task, onEdit, onDelete, onStatus, compact }: Props) {
  return (
    <article className={`${styles.card} ${compact ? styles.compact : ""}`}>
      <div className={styles.top}>
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
      </div>
      <h3>{task.title}</h3>
      <p>{task.description || "No description provided."}</p>
      <div className={styles.meta}>Due {formatDate(task.dueDate)}</div>
      <div className={styles.controls}>
        <select
          aria-label={`Status for ${task.title}`}
          value={task.status}
          onChange={(e) => onStatus(task.id, e.target.value as TaskStatus)}
        >
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
        <Button variant="secondary" onClick={() => onEdit(task.id)}>
          Edit
        </Button>
        <Button variant="danger" onClick={() => onDelete(task.id)}>
          Delete
        </Button>
      </div>
    </article>
  );
}
