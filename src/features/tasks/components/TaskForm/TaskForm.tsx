import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/shared/components/Button/Button";
import type { Task, TaskInput } from "../../types/task.types";
import styles from "./TaskForm.module.css";
const today = () => new Date().toISOString().slice(0, 10);
interface Props {
  task?: Task;
  pending: boolean;
  onCancel: () => void;
  onSubmit: (input: TaskInput) => void;
}
export function TaskForm({ task, pending, onCancel, onSubmit }: Props) {
  const [form, setForm] = useState<TaskInput>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: today(),
  });
  useEffect(() => {
    if (task)
      setForm({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
      });
  }, [task]);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (form.title.trim())
      onSubmit({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
      });
  };
  return (
    <form className={styles.form} onSubmit={submit}>
      <label>
        Title
        <input
          required
          maxLength={100}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </label>
      <label>
        Description
        <textarea
          rows={4}
          maxLength={500}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </label>
      <div className={styles.row}>
        <label>
          Status
          <select
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value as TaskInput["status"],
              })
            }
          >
            <option value="todo">To do</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </label>
        <label>
          Priority
          <select
            value={form.priority}
            onChange={(e) =>
              setForm({
                ...form,
                priority: e.target.value as TaskInput["priority"],
              })
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>
      <label>
        Due date
        <input
          type="date"
          required
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />
      </label>
      <footer>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : task ? "Save changes" : "Create task"}
        </Button>
      </footer>
    </form>
  );
}
