import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../api/taskApi";
import { taskKeys } from "./useTasks";
import type { TaskInput } from "../types/task.types";
export function useUpdateTask() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<TaskInput> }) =>
      taskApi.updateTask(id, input),
    onSuccess: () => client.invalidateQueries({ queryKey: taskKeys.all }),
  });
}
