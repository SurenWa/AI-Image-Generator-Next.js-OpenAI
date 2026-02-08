import type { ImageSize, ImageQuality, ImageStyle } from "./types";

export const IMAGE_SIZES: { value: ImageSize; label: string }[] = [
  { value: "1024x1024", label: "Square (1024x1024)" },
  { value: "1024x1792", label: "Portrait (1024x1792)" },
  { value: "1792x1024", label: "Landscape (1792x1024)" },
];

export const IMAGE_QUALITIES: { value: ImageQuality; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "hd", label: "HD" },
];

export const IMAGE_STYLES: { value: ImageStyle; label: string }[] = [
  { value: "vivid", label: "Vivid" },
  { value: "natural", label: "Natural" },
];

export const PROMPT_EXAMPLES: string[] = [
  "A serene Japanese garden with cherry blossoms falling into a koi pond at sunset",
  "A futuristic cityscape with flying cars and neon lights reflecting off glass buildings",
  "A cozy cabin in the mountains during winter with smoke rising from the chimney",
  "An underwater coral reef teeming with colorful tropical fish and sea turtles",
  "A steampunk-inspired clockwork owl perched on a stack of leather-bound books",
  "A watercolor painting of a Parisian café on a rainy autumn evening",
];

export const MAX_PROMPT_LENGTH = 4000;
