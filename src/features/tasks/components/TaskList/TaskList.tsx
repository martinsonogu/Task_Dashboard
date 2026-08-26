import type { Task, TaskStatus } from "../../types/task.types";
import { TaskCard } from "../TaskCard/TaskCard";
import styles from "./TaskList.module.css";
interface Props {
  tasks: Task[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatus: (id: string, status: TaskStatus) => void;
}
export function TaskList(props: Props) {
  return (
    <div className={styles.list}>
      {props.tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          compact
          onEdit={props.onEdit}
          onDelete={props.onDelete}
          onStatus={props.onStatus}
        />
      ))}
    </div>
  );
}
