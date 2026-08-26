import type { Task, TaskFilters, TaskStatus } from "../types/task.types";
export const statusLabels: Record<TaskStatus, string> = {
  todo: "To do",
  "in-progress": "In progress",
  done: "Done",
};
export function filterTasks(tasks: Task[], filters: TaskFilters) {
  const q = filters.search.trim().toLowerCase();
  return [...tasks]
    .filter(
      (t) =>
        (!q || `${t.title} ${t.description}`.toLowerCase().includes(q)) &&
        (filters.status === "all" || t.status === filters.status) &&
        (filters.priority === "all" || t.priority === filters.priority),
    )
    .sort((a, b) =>
      filters.sort === "oldest"
        ? a.createdAt.localeCompare(b.createdAt)
        : filters.sort === "due-date"
          ? a.dueDate.localeCompare(b.dueDate)
          : b.createdAt.localeCompare(a.createdAt),
    );
}
export function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value + "T00:00:00"));
}
