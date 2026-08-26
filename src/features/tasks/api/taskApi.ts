import { http } from "@/shared/lib/http";
import type { Task, TaskInput } from "../types/task.types";

const STORAGE_KEY = "taskflow.tasks.v1";
const remote = import.meta.env.VITE_API_MODE === "remote";
const wait = () => new Promise((resolve) => setTimeout(resolve, 250));

function read() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    return [] as Task[];
  }

  return JSON.parse(raw) as Task[];
}

function write(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
export const taskApi = {
  async getTasks() {
    if (remote) return (await http.get<Task[]>("/tasks")).data;
    await wait();
    return read();
  },
  async createTask(input: TaskInput) {
    if (remote) return (await http.post<Task>("/tasks", input)).data;
    await wait();
    const now = new Date().toISOString();
    const task: Task = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    write([task, ...read()]);
    return task;
  },
  async updateTask(id: string, input: Partial<TaskInput>) {
    if (remote) return (await http.patch<Task>(`/tasks/${id}`, input)).data;
    await wait();
    let updated: Task | undefined;
    const tasks = read().map((t) => {
      if (t.id !== id) return t;
      updated = { ...t, ...input, updatedAt: new Date().toISOString() };
      return updated;
    });
    if (!updated) throw new Error("Task not found");
    write(tasks);
    return updated;
  },
  async deleteTask(id: string) {
    if (remote) {
      await http.delete(`/tasks/${id}`);
      return id;
    }
    await wait();
    write(read().filter((t) => t.id !== id));
    return id;
  },
};
