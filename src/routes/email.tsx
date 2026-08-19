import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | Workplace AI" },
      {
        name: "description",
        content:
          "Draft professional workplace emails in seconds with structured AI prompts and fully editable output.",
      },
      { property: "og:title", content: "Smart Email Generator | Workplace AI" },
      {
        property: "og:description",
        content: "Draft professional workplace emails in seconds with structured AI prompts.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  return (
    <AppShell>
      <ToolWorkspace
        kind="email"
        title="Smart Email Generator"
        description="Turn a few details into a polished, on-tone business email."
        icon={<Mail className="size-5" />}
        submitLabel="Generate email"
        fields={[
          { name: "recipient", label: "Recipient & role", placeholder: "Priya, Head of Finance", required: true },
          {
            name: "purpose",
            label: "Purpose of the email",
            type: "textarea",
            rows: 4,
            placeholder: "Request approval for the Q3 software budget increase…",
            required: true,
          },
          {
            name: "tone",
            label: "Tone",
            type: "select",
            options: ["Formal", "Friendly professional", "Direct", "Apologetic", "Persuasive"],
          },
          { name: "length", label: "Length", type: "select", options: ["Short", "Medium", "Detailed"] },
          { name: "points", label: "Key points to include", type: "textarea", rows: 4 },
        ]}
        buildPrompt={(v) =>
          [
            `Recipient: ${v.recipient}`,
            `Purpose: ${v.purpose}`,
            `Tone: ${v.tone || "Friendly professional"}`,
            `Length: ${v.length || "Medium"}`,
            `Key points: ${v.points || "None provided"}`,
            "Write the email now.",
          ].join("\n")
        }
      />
    </AppShell>
  );
}
