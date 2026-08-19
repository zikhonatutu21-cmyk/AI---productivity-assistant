import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | Workplace AI" },
      {
        name: "description",
        content:
          "Get balanced briefings on any work topic, with key points, trade-offs and next steps.",
      },
      { property: "og:title", content: "AI Research Assistant | Workplace AI" },
      {
        property: "og:description",
        content: "Balanced briefings with key points, trade-offs and next steps.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <AppShell>
      <ToolWorkspace
        kind="research"
        title="AI Research Assistant"
        description="Get a structured briefing you can skim before a decision or a meeting."
        icon={<Search className="size-5" />}
        submitLabel="Research topic"
        fields={[
          {
            name: "topic",
            label: "Topic or question",
            type: "textarea",
            rows: 3,
            placeholder: "How should a 50-person team approach AI usage policy?",
            required: true,
          },
          {
            name: "audience",
            label: "Audience",
            type: "select",
            options: ["Executive", "Manager", "Technical team", "Client"],
          },
          {
            name: "depth",
            label: "Depth",
            type: "select",
            options: ["Quick brief", "Standard", "In-depth"],
          },
          { name: "context", label: "Context we already know", type: "textarea", rows: 4 },
        ]}
        buildPrompt={(v) =>
          [
            `Topic: ${v["topic"]}`,
            `Audience: ${v["audience"] || "Manager"}`,
            `Depth: ${v["depth"] || "Standard"}`,
            `Known context: ${v["context"] || "None provided"}`,
          ].join("\n")
        }
      />
    </AppShell>
  );
}
