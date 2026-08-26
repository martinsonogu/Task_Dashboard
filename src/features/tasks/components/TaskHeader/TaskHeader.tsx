import { Button } from "@/shared/components/Button/Button";
import type { ViewMode } from "../../store/taskUiSlice";
import styles from "./TaskHeader.module.css";
interface Props {
  total: number;
  completed: number;
  viewMode: ViewMode;
  onViewChange: (v: ViewMode) => void;
  onCreate: () => void;
}
export function TaskHeader({
  total,
  completed,
  viewMode,
  onViewChange,
  onCreate,
}: Props) {
  return (
    <header className={styles.header}>
      <div>
        <p className={styles.eyebrow}>Workspace</p>
        <h1>Task dashboard</h1>
        <p>
          {completed} of {total} tasks completed
        </p>
      </div>
      <div className={styles.actions}>
        <div className={styles.toggle} aria-label="View mode">
          <button
            className={viewMode === "board" ? styles.active : ""}
            onClick={() => onViewChange("board")}
          >
            Board
          </button>
          <button
            className={viewMode === "list" ? styles.active : ""}
            onClick={() => onViewChange("list")}
          >
            List
          </button>
        </div>
        <Button onClick={onCreate}>+ New task</Button>
      </div>
    </header>
  );
}
