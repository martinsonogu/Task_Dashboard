import type { Task, TaskStatus } from "../../types/task.types";
import { statusLabels } from "../../utils/taskHelpers";
import { TaskCard } from "../TaskCard/TaskCard";
import styles from "./TaskBoard.module.css";
interface Props {
  tasks: Task[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatus: (id: string, status: TaskStatus) => void;
}
const statuses: TaskStatus[] = ["todo", "in-progress", "done"];
export function TaskBoard(props: Props) {
  return (
    <div className={styles.board}>
      {statuses.map((status) => {
        const tasks = props.tasks.filter((t) => t.status === status);
        return (
          <section className={styles.column} key={status}>
            <header>
              <h2>{statusLabels[status]}</h2>
              <span>{tasks.length}</span>
            </header>
            <div className={styles.cards}>
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={props.onEdit}
                  onDelete={props.onDelete}
                  onStatus={props.onStatus}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
