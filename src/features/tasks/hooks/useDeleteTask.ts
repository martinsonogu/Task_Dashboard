import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../api/taskApi";
import { taskKeys } from "./useTasks";
export function useDeleteTask() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: taskApi.deleteTask,
    onSuccess: () => client.invalidateQueries({ queryKey: taskKeys.all }),
  });
}
