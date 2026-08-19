import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Loader2, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { runAssistant } from "@/lib/ai.functions";
import { DISCLAIMER } from "@/lib/prompts";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot Assistant | Workplace AI" },
      {
        name: "description",
        content:
          "Chat with an AI assistant built for workplace tasks: writing, planning, analysis and advice.",
      },
      { property: "og:title", content: "AI Chatbot Assistant | Workplace AI" },
      {
        property: "og:description",
        content: "Chat with an AI assistant built for everyday workplace tasks.",
      },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Help me prepare an agenda for a project kickoff",
  "Rewrite this update so it's clearer for executives",
  "What should I check before approving a vendor contract?",
];

function ChatPage() {
  const run = useServerFn(runAssistant);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await run({ data: { kind: "chat", messages: next } });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (error) {
      toast.error((error as Error).message ?? "The assistant is unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
        <header className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
            <Bot className="size-5" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">AI Chatbot</h1>
            <p className="text-sm text-muted-foreground">
              Your general-purpose assistant for everyday workplace questions.
            </p>
          </div>
        </header>

        <Card className="flex min-h-0 flex-1 flex-col overflow-hidden p-0 shadow-card">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="mx-auto max-w-md space-y-3 py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  Ask anything about your work day. Try one of these:
                </p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => void send(s)}
                    className="block w-full rounded-lg border border-border bg-secondary px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" ? (
                  <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-gradient-primary text-primary-foreground">
                    <Bot className="size-4" />
                  </span>
                ) : null}
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="md-body">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  )}
                </div>
                {m.role === "user" ? (
                  <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
                    <User className="size-4" />
                  </span>
                ) : null}
              </div>
            ))}
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Thinking…
              </div>
            ) : null}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="flex items-end gap-2 border-t border-border p-3"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              rows={1}
              placeholder="Ask the assistant…"
              className="max-h-40 min-h-10 resize-none"
            />
            <Button type="submit" size="icon" disabled={loading} aria-label="Send message">
              <Send className="size-4" />
            </Button>
          </form>
        </Card>

        <p className="text-xs text-muted-foreground">{DISCLAIMER}</p>
      </div>
    </AppShell>
  );
}
