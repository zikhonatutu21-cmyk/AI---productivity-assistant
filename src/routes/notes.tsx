import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | Workplace AI" },
      {
        name: "description",
        content:
          "Turn raw meeting notes or transcripts into clear summaries, decisions and action items.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | Workplace AI" },
      {
        property: "og:description",
        content: "Turn raw meeting notes into summaries, decisions and action items.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  return (
    <AppShell>
      <ToolWorkspace
        kind="summary"
        title="Meeting Notes Summarizer"
        description="Paste messy notes or a transcript and get a structured recap your team can act on."
        icon={<FileText className="size-5" />}
        submitLabel="Summarize notes"
        fields={[
          { name: "meeting", label: "Meeting title", placeholder: "Weekly product sync" },
          { name: "attendees", label: "Attendees", placeholder: "Sam, Priya, Devon" },
          {
            name: "notes",
            label: "Raw notes or transcript",
            type: "textarea",
            rows: 12,
            placeholder: "Paste your notes here…",
            required: true,
          },
        ]}
        buildPrompt={(v) =>
          [
            `Meeting: ${v["meeting"] || "Not specified"}`,
            `Attendees: ${v["attendees"] || "Not specified"}`,
            "Notes:",
            v["notes"] ?? "",
          ].join("\n")
        }
      />
    </AppShell>
  );
}
