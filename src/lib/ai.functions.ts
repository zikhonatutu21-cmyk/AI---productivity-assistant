import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { SYSTEM_PROMPTS, type ToolKind } from "./prompts";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const Input = z.object({
  kind: z.enum(["email", "summary", "planner", "research", "chat"]),
  prompt: z.string().min(1).optional(),
  messages: z.array(MessageSchema).optional(),
});

export const runAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured (missing API key).");

    const gateway = createLovableAiGatewayProvider(key);
    const kind = data.kind as ToolKind;

    const messages = data.messages?.length
      ? data.messages
      : [{ role: "user" as const, content: data.prompt ?? "" }];

    try {
      const result = streamText({
        model: gateway("google/gemini-3.7-flash"),
        system: SYSTEM_PROMPTS[kind],
        messages,
      });
      return { text: await result.text };
    } catch (error) {
      const status = (error as { statusCode?: number; status?: number })?.statusCode ?? (error as { status?: number })?.status;
      if (status === 429) throw new Error("Too many requests right now — please try again in a moment.");
      if (status === 402) throw new Error("AI credits are exhausted. Add credits in Lovable to continue.");
      if (status === 403) throw new Error("AI access is blocked for this workspace.");
      throw new Error((error as Error)?.message || "The AI request failed.");
    }
  });
