import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TaskDashboard } from "./TaskDashboard";
import { AppProviders } from "@/app/providers";

describe("TaskDashboard", () => {
  it("renders the dashboard heading and empty state when no tasks exist", async () => {
    window.localStorage.clear();

    render(
      <AppProviders>
        <TaskDashboard />
      </AppProviders>,
    );

    expect(await screen.findByText(/task dashboard/i)).toBeInTheDocument();
    expect(await screen.findByText(/no tasks yet/i)).toBeInTheDocument();
  });
});
