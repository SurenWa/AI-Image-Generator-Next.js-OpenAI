import { NextRequest, NextResponse } from "next/server";
import { generateImageSchema } from "@/lib/validations";
import { generateImage } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = generateImageSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join(", ");
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const result = await generateImage(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate image";
    console.error("Image generation error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
