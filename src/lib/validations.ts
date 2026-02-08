import { z } from "zod";
import { MAX_PROMPT_LENGTH } from "./constants";

export const generateImageSchema = z.object({
  prompt: z
    .string()
    .min(1, "Prompt is required")
    .max(MAX_PROMPT_LENGTH, `Prompt must be ${MAX_PROMPT_LENGTH} characters or less`),
  size: z.enum(["1024x1024", "1024x1792", "1792x1024"]),
  quality: z.enum(["standard", "hd"]),
  style: z.enum(["vivid", "natural"]),
});

export type GenerateImageInput = z.infer<typeof generateImageSchema>;
