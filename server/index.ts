import "dotenv/config";
import express, { type NextFunction, type Request, type Response } from "express";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";

const app = express();
const port = Number(process.env.PORT || 3000);
const storageMode = process.env.STORAGE_MODE || "postgres";
const useMemory = storageMode === "memory";
const pool = useMemory
  ? undefined
  : new Pool({
      connectionString:
        process.env.DATABASE_URL || "postgresql:///task_dashboard",
    });
let requestCount = 0;

type TaskStatus = "todo" | "in-progress" | "done";
type TaskPriority = "low" | "medium" | "high";

interface TaskInput {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

interface TaskRow {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  created_at: string;
  updated_at: string;
}

type Task = ReturnType<typeof toTask>;
const memoryTasks: Task[] = [];

function database() {
  if (!pool) throw new Error("PostgreSQL storage is not enabled");
  return pool;
}

const taskFields = `
  id, title, description, status, priority,
  due_date::text AS "dueDate", created_at, updated_at
`;

function toTask(row: TaskRow) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    dueDate: row.dueDate,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function validInput(body: Partial<TaskInput>): body is TaskInput {
  return (
    typeof body.title === "string" &&
    body.title.trim().length > 0 &&
    body.title.length <= 100 &&
    typeof body.description === "string" &&
    typeof body.dueDate === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(body.dueDate) &&
    (body.status === "todo" ||
      body.status === "in-progress" ||
      body.status === "done") &&
    (body.priority === "low" ||
      body.priority === "medium" ||
      body.priority === "high")
  );
}

app.use(express.json());
app.use((_request, response, next) => {
  requestCount += 1;
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/health", async (_request, response, next) => {
  try {
    if (useMemory) {
      response.json({ status: "ok", storage: "memory" });
      return;
    }
    await database().query("SELECT 1");
    response.json({ status: "ok", storage: "postgres", database: "connected" });
  } catch (error) {
    next(error);
  }
});

app.get("/metrics", (_request, response) => {
  response.type("text/plain").send(
    `# HELP api_requests_total Total API requests\n# TYPE api_requests_total counter\napi_requests_total ${requestCount}\n`,
  );
});

app.get("/api/tasks", async (_request, response, next) => {
  try {
    if (useMemory) {
      response.json(memoryTasks);
      return;
    }
    const result = await database().query<TaskRow>(
      `SELECT ${taskFields} FROM tasks ORDER BY created_at DESC`,
    );
    response.json(result.rows.map(toTask));
  } catch (error) {
    next(error);
  }
});

app.post("/api/tasks", async (request, response, next) => {
  try {
    if (!validInput(request.body)) {
      response.status(400).json({ error: "Invalid task input" });
      return;
    }
    if (useMemory) {
      const now = new Date().toISOString();
      const task: Task = {
        id: randomUUID(),
        title: request.body.title.trim(),
        description: request.body.description.trim(),
        status: request.body.status,
        priority: request.body.priority,
        dueDate: request.body.dueDate,
        createdAt: now,
        updatedAt: now,
      };
      memoryTasks.unshift(task);
      response.status(201).json(task);
      return;
    }
    const result = await database().query<TaskRow>(
      `INSERT INTO tasks (title, description, status, priority, due_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${taskFields}`,
      [
        request.body.title.trim(),
        request.body.description.trim(),
        request.body.status,
        request.body.priority,
        request.body.dueDate,
      ],
    );
    response.status(201).json(toTask(result.rows[0]));
  } catch (error) {
    next(error);
  }
});

app.patch("/api/tasks/:id", async (request, response, next) => {
  try {
    const { title, description, status, priority, dueDate } =
      request.body as Partial<TaskInput>;
    if (
      title !== undefined &&
      (typeof title !== "string" || !title.trim() || title.length > 100)
    ) {
      response.status(400).json({ error: "Invalid title" });
      return;
    }
    if (useMemory) {
      const index = memoryTasks.findIndex((task) => task.id === request.params.id);
      if (index === -1) {
        response.status(404).json({ error: "Task not found" });
        return;
      }
      const current = memoryTasks[index];
      const updated: Task = {
        ...current,
        ...(title === undefined ? {} : { title: title.trim() }),
        ...(description === undefined ? {} : { description: description.trim() }),
        ...(status === undefined ? {} : { status }),
        ...(priority === undefined ? {} : { priority }),
        ...(dueDate === undefined ? {} : { dueDate }),
        updatedAt: new Date().toISOString(),
      };
      memoryTasks[index] = updated;
      response.json(updated);
      return;
    }
    const result = await database().query<TaskRow>(
      `UPDATE tasks
       SET title = COALESCE($2, title), description = COALESCE($3, description),
           status = COALESCE($4, status), priority = COALESCE($5, priority),
           due_date = COALESCE($6, due_date), updated_at = NOW()
       WHERE id = $1
       RETURNING ${taskFields}`,
      [request.params.id, title?.trim(), description?.trim(), status, priority, dueDate],
    );
    if (!result.rows[0]) {
      response.status(404).json({ error: "Task not found" });
      return;
    }
    response.json(toTask(result.rows[0]));
  } catch (error) {
    next(error);
  }
});

app.delete("/api/tasks/:id", async (request, response, next) => {
  try {
    if (useMemory) {
      const index = memoryTasks.findIndex((task) => task.id === request.params.id);
      if (index === -1) {
        response.status(404).json({ error: "Task not found" });
        return;
      }
      memoryTasks.splice(index, 1);
      response.status(204).send();
      return;
    }
    const result = await database().query("DELETE FROM tasks WHERE id = $1", [
      request.params.id,
    ]);
    if (result.rowCount === 0) {
      response.status(404).json({ error: "Task not found" });
      return;
    }
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  void _next;
  console.error(error);
  response.status(500).json({ error: "Internal server error" });
});

const currentDir = path.dirname(fileURLToPath(import.meta.url));
if (!useMemory) {
  const schema = await readFile(path.join(currentDir, "schema.sql"), "utf8");
  await database().query(schema);
}
app.listen(port, () =>
  console.log(`Task API listening on http://localhost:${port} (${storageMode} storage)`),
);
