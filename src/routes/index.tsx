import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, FileText, ListChecks, Mail, Search, ShieldCheck, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DISCLAIMER } from "@/lib/prompts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate everyday work: generate emails, summarize meetings, plan tasks and research topics with AI.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Generate emails, summarize meetings, plan tasks and research topics with AI — all in one workspace.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    description: "Draft on-tone business emails from a few structured inputs.",
  },
  {
    to: "/notes",
    icon: FileText,
    title: "Meeting Notes Summarizer",
    description: "Convert messy notes into decisions, owners and action items.",
  },
  {
    to: "/planner",
    icon: ListChecks,
    title: "AI Task Planner",
    description: "Turn goals into prioritised plans with effort and risks.",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    description: "Balanced briefings with key points and next steps.",
  },
  {
    to: "/chat",
    icon: Bot,
    title: "AI Chatbot",
    description: "Ask anything about your work day, in conversation.",
  },
] as const;

function Dashboard() {
  return (
    <AppShell>
      <div className="space-y-8">
        <section className="overflow-hidden rounded-2xl bg-gradient-primary p-8 text-primary-foreground shadow-card">
          <p className="text-xs font-medium uppercase tracking-widest opacity-80">
            Workplace AI
          </p>
          <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Automate the busywork, keep the judgement
          </h1>
          <p className="mt-3 max-w-xl text-sm opacity-90">
            Five focused AI assistants for the tasks that eat your week — writing, summarizing,
            planning and researching. Every output is editable before you use it.
          </p>
          <Link
            to="/email"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-background/15 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:bg-background/25"
          >
            Start with an email <ArrowRight className="size-4" />
          </Link>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {TOOLS.map(({ to, icon: Icon, title, description }) => (
            <Link key={to} to={to} className="group">
              <Card className="h-full shadow-card transition-transform group-hover:-translate-y-0.5">
                <CardHeader>
                  <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <Icon className="size-5" />
                  </span>
                  <CardTitle className="mt-3 text-base">{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>

        <Alert>
          <ShieldCheck className="size-4" />
          <AlertTitle>Responsible AI</AlertTitle>
          <AlertDescription className="text-xs">{DISCLAIMER}</AlertDescription>
        </Alert>
      </div>
    </AppShell>
  );
}
