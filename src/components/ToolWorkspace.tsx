import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Copy, Pencil, Eye, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { runAssistant } from "@/lib/ai.functions";
import { DISCLAIMER, type ToolKind } from "@/lib/prompts";

export type FieldDef = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "textarea" | "select";
  options?: string[];
  rows?: number;
  required?: boolean;
};

export function ToolWorkspace({
  kind,
  title,
  description,
  icon,
  fields,
  buildPrompt,
  submitLabel = "Generate",
}: {
  kind: ToolKind;
  title: string;
  description: string;
  icon: ReactNode;
  fields: FieldDef[];
  buildPrompt: (values: Record<string, string>) => string;
  submitLabel?: string;
}) {
  const run = useServerFn(runAssistant);
  const [values, setValues] = useState<Record<string, string>>({});
  const [output, setOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (name: string, value: string) =>
    setValues((v) => ({ ...v, [name]: value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const missing = fields.filter((f) => f.required && !values[f.name]?.trim());
    if (missing.length) {
      toast.error(`Please fill in: ${missing.map((f) => f.label).join(", ")}`);
      return;
    }
    setLoading(true);
    try {
      const res = await run({ data: { kind, prompt: buildPrompt(values) } });
      setOutput(res.text);
      setEditing(false);
    } catch (error) {
      toast.error((error as Error).message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
          {icon}
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Structured prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              {fields.map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={field.name}
                      rows={field.rows ?? 6}
                      placeholder={field.placeholder ?? ""}
                      value={values[field.name] ?? ""}
                      onChange={(e) => set(field.name, e.target.value)}
                    />
                  ) : field.type === "select" ? (
                    <select
                      id={field.name}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={values[field.name] ?? ""}
                      onChange={(e) => set(field.name, e.target.value)}
                    >
                      <option value="">Select…</option>
                      {(field.options ?? []).map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.name}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder={field.placeholder ?? ""}
                      value={values[field.name] ?? ""}
                      onChange={(e) => set(field.name, e.target.value)}
                    />
                  )}
                </div>
              ))}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                {loading ? "Working…" : submitLabel}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle className="text-base">AI output</CardTitle>
            {output ? (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditing((v) => !v)}>
                  {editing ? <Eye className="size-4" /> : <Pencil className="size-4" />}
                  {editing ? "Preview" : "Edit"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    void navigator.clipboard.writeText(output);
                    toast.success("Copied to clipboard");
                  }}
                >
                  <Copy className="size-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setOutput("")}>
                  <RotateCcw className="size-4" />
                </Button>
              </div>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-4">
            {output ? (
              editing ? (
                <Textarea
                  rows={20}
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                  className="font-mono text-xs"
                />
              ) : (
                <div className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-table:text-foreground">
                  <ReactMarkdown>{output}</ReactMarkdown>
                </div>
              )
            ) : (
              <p className="py-16 text-center text-sm text-muted-foreground">
                Your generated draft will appear here — fully editable before you use it.
              </p>
            )}
            <Alert>
              <AlertDescription className="text-xs">{DISCLAIMER}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
