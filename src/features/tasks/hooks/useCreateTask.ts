import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../api/taskApi";
import { taskKeys } from "./useTasks";
export function useCreateTask() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: () => client.invalidateQueries({ queryKey: taskKeys.all }),
  });
}
