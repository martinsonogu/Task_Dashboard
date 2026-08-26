import { Modal } from "@/shared/components/Modal/Modal";
import type { Task, TaskInput } from "../../types/task.types";
import { TaskForm } from "../TaskForm/TaskForm";
interface Props {
  task?: Task;
  pending: boolean;
  onClose: () => void;
  onSubmit: (input: TaskInput) => void;
}
export function TaskModal({ task, pending, onClose, onSubmit }: Props) {
  return (
    <Modal title={task ? "Edit task" : "Create task"} onClose={onClose}>
      <TaskForm
        task={task}
        pending={pending}
        onCancel={onClose}
        onSubmit={onSubmit}
      />
    </Modal>
  );
}
