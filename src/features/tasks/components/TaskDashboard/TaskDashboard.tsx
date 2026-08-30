import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useTasks } from "../../hooks/useTasks";
import { useCreateTask } from "../../hooks/useCreateTask";
import { useUpdateTask } from "../../hooks/useUpdateTask";
import { useDeleteTask } from "../../hooks/useDeleteTask";
import {
  closeModal,
  openCreateModal,
  openEditModal,
  setViewMode,
} from "../../store/taskUiSlice";
import type {
  TaskFilters as Filters,
  TaskInput,
  TaskStatus,
} from "../../types/task.types";
import { filterTasks } from "../../utils/taskHelpers";
import { EmptyState } from "../EmptyState/EmptyState";
import { TaskBoard } from "../TaskBoard/TaskBoard";
import { TaskFilters } from "../TaskFilters/TaskFilters";
import { TaskHeader } from "../TaskHeader/TaskHeader";
import { TaskList } from "../TaskList/TaskList";
import { TaskSkeleton } from "../Loading/TaskSkeleton";
import { TaskModal } from "../TaskModal/TaskModal";
import styles from "./TaskDashboard.module.css";

const initialFilters: Filters = {
  search: "",
  status: "all",
  priority: "all",
  sort: "newest",
};

export function TaskDashboard() {
  const dispatch = useAppDispatch();
  const ui = useAppSelector((s) => s.taskUi);
  const [filters, setFilters] = useState(initialFilters);
  const tasksQuery = useTasks();
  const create = useCreateTask();
  const update = useUpdateTask();
  const remove = useDeleteTask();

  const tasks = useMemo(() => tasksQuery.data ?? [], [tasksQuery.data]);
  const visible = useMemo(() => filterTasks(tasks, filters), [tasks, filters]);
  const selected = tasks.find((t) => t.id === ui.selectedTaskId);

  const status = (id: string, statusValue: TaskStatus) =>
    update.mutate({ id, input: { status: statusValue } });
  const submit = (input: TaskInput) => {
    if (selected) {
      update.mutate(
        { id: selected.id, input },
        { onSuccess: () => dispatch(closeModal()) },
      );
    } else {
      create.mutate(input, { onSuccess: () => dispatch(closeModal()) });
    }
  };
  const del = (id: string) => {
    if (window.confirm("Delete this task?")) remove.mutate(id);
  };

  const showEmptyState = visible.length === 0 && !tasksQuery.isLoading;

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <TaskHeader
          total={tasks.length}
          completed={tasks.filter((t) => t.status === "done").length}
          viewMode={ui.viewMode}
          onViewChange={(value) => dispatch(setViewMode(value))}
          onCreate={() => dispatch(openCreateModal())}
        />
        <TaskFilters filters={filters} onChange={setFilters} />
        {tasksQuery.isLoading ? (
          <TaskSkeleton />
        ) : tasksQuery.isError ? (
          <section className={styles.error}>
            <h2>Unable to load tasks</h2>
            <p>
              {tasksQuery.error instanceof Error
                ? tasksQuery.error.message
                : "Unknown error"}
            </p>
            <button onClick={() => tasksQuery.refetch()}>Try again</button>
          </section>
        ) : showEmptyState ? (
          <EmptyState onCreate={() => dispatch(openCreateModal())} />
        ) : ui.viewMode === "board" ? (
          <TaskBoard
            tasks={visible}
            onEdit={(id) => dispatch(openEditModal(id))}
            onDelete={del}
            onStatus={status}
          />
        ) : (
          <TaskList
            tasks={visible}
            onEdit={(id) => dispatch(openEditModal(id))}
            onDelete={del}
            onStatus={status}
          />
        )}
        {ui.isModalOpen && (
          <TaskModal
            task={selected}
            pending={create.isPending || update.isPending}
            onClose={() => dispatch(closeModal())}
            onSubmit={submit}
          />
        )}
      </div>
    </main>
  );
}
