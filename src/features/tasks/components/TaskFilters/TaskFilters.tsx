import type { TaskFilters as Filters } from "../../types/task.types";
import styles from "./TaskFilters.module.css";
interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}
export function TaskFilters({ filters, onChange }: Props) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value });
  return (
    <section className={styles.filters} aria-label="Task filters">
      <input
        aria-label="Search tasks"
        placeholder="Search tasks…"
        value={filters.search}
        onChange={(e) => set("search", e.target.value)}
      />
      <select
        aria-label="Filter by status"
        value={filters.status}
        onChange={(e) => set("status", e.target.value as Filters["status"])}
      >
        <option value="all">All statuses</option>
        <option value="todo">To do</option>
        <option value="in-progress">In progress</option>
        <option value="done">Done</option>
      </select>
      <select
        aria-label="Filter by priority"
        value={filters.priority}
        onChange={(e) => set("priority", e.target.value as Filters["priority"])}
      >
        <option value="all">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select
        aria-label="Sort tasks"
        value={filters.sort}
        onChange={(e) => set("sort", e.target.value as Filters["sort"])}
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="due-date">Due date</option>
      </select>
    </section>
  );
}
