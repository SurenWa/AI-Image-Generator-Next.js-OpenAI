export type ImageSize = "1024x1024" | "1024x1792" | "1792x1024";
export type ImageQuality = "standard" | "hd";
export type ImageStyle = "vivid" | "natural";

export interface GenerateImageRequest {
  prompt: string;
  size: ImageSize;
  quality: ImageQuality;
  style: ImageStyle;
}

export interface GenerateImageResponse {
  url: string;
  revisedPrompt: string;
}

export interface GenerationError {
  error: string;
}

export interface ImageHistoryItem {
  id: string;
  prompt: string;
  revisedPrompt: string;
  imageUrl: string;
  size: ImageSize;
  quality: ImageQuality;
  style: ImageStyle;
  createdAt: string;
}
