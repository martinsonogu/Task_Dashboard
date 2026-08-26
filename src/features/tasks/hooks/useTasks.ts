import { useQuery } from "@tanstack/react-query";
import { taskApi } from "../api/taskApi";
export const taskKeys = { all: ["tasks"] as const };
export function useTasks() {
  return useQuery({ queryKey: taskKeys.all, queryFn: taskApi.getTasks });
}
