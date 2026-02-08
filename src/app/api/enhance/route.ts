import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const enhanceSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(4000),
});

const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = enhanceSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join(", ");
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === "your_openai_api_key_here") {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(OPENAI_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert at writing prompts for DALL-E 3 image generation. Given a user's basic prompt, enhance it with vivid details, artistic style, lighting, composition, and mood to produce a more compelling image. Keep the enhanced prompt under 500 characters. Return ONLY the enhanced prompt text, nothing else.",
          },
          {
            role: "user",
            content: parsed.data.prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const message =
        error?.error?.message || `OpenAI API error: ${response.status}`;
      return NextResponse.json({ error: message }, { status: 500 });
    }

    const data = await response.json();
    const enhanced = data.choices[0]?.message?.content?.trim();

    if (!enhanced) {
      return NextResponse.json(
        { error: "Failed to enhance prompt" },
        { status: 500 }
      );
    }

    return NextResponse.json({ enhanced });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to enhance prompt";
    console.error("Prompt enhancement error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
