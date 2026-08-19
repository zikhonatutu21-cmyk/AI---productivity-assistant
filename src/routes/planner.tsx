import { createFileRoute } from "@tanstack/react-router";
import { ListChecks } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | Workplace AI" },
      {
        name: "description",
        content:
          "Break big goals into prioritised, realistic task plans with effort estimates and risks.",
      },
      { property: "og:title", content: "AI Task Planner | Workplace AI" },
      {
        property: "og:description",
        content: "Break big goals into prioritised task plans with effort estimates and risks.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  return (
    <AppShell>
      <ToolWorkspace
        kind="planner"
        title="AI Task Planner"
        description="Turn a goal and a deadline into a prioritised, realistic plan of work."
        icon={<ListChecks className="size-5" />}
        submitLabel="Build my plan"
        fields={[
          {
            name: "goal",
            label: "Goal or project",
            type: "textarea",
            rows: 3,
            placeholder: "Launch the new onboarding flow",
            required: true,
          },
          { name: "deadline", label: "Deadline", placeholder: "In 3 weeks / 14 Sept" },
          { name: "capacity", label: "Time available", placeholder: "About 6 hours per week" },
          { name: "constraints", label: "Constraints & dependencies", type: "textarea", rows: 4 },
        ]}
        buildPrompt={(v) =>
          [
            `Goal: ${v["goal"]}`,
            `Deadline: ${v["deadline"] || "Not specified"}`,
            `Capacity: ${v["capacity"] || "Not specified"}`,
            `Constraints: ${v["constraints"] || "None provided"}`,
          ].join("\n")
        }
      />
    </AppShell>
  );
}
