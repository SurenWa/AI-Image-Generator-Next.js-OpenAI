import type { GenerateImageInput } from "./validations";
import type { GenerateImageResponse } from "./types";

const OPENAI_API_URL = "https://api.openai.com/v1/images/generations";

export async function generateImage(
  input: GenerateImageInput
): Promise<GenerateImageResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey === "your_openai_api_key_here") {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: input.prompt,
      n: 1,
      size: input.size,
      quality: input.quality,
      style: input.style,
      response_format: "url",
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const message =
      error?.error?.message || `OpenAI API error: ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  const image = data.data[0];

  return {
    url: image.url,
    revisedPrompt: image.revised_prompt ?? input.prompt,
  };
}
