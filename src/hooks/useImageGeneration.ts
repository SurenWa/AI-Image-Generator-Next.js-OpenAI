"use client";

import { useState, useCallback } from "react";
import type {
  ImageSize,
  ImageQuality,
  ImageStyle,
  GenerateImageResponse,
} from "@/lib/types";

interface ImageGenerationState {
  prompt: string;
  size: ImageSize;
  quality: ImageQuality;
  style: ImageStyle;
  isLoading: boolean;
  error: string | null;
  result: GenerateImageResponse | null;
}

const initialState: ImageGenerationState = {
  prompt: "",
  size: "1024x1024",
  quality: "standard",
  style: "vivid",
  isLoading: false,
  error: null,
  result: null,
};

export function useImageGeneration() {
  const [state, setState] = useState<ImageGenerationState>(initialState);

  const setPrompt = useCallback((prompt: string) => {
    setState((prev) => ({ ...prev, prompt }));
  }, []);

  const setSize = useCallback((size: ImageSize) => {
    setState((prev) => ({ ...prev, size }));
  }, []);

  const setQuality = useCallback((quality: ImageQuality) => {
    setState((prev) => ({ ...prev, quality }));
  }, []);

  const setStyle = useCallback((style: ImageStyle) => {
    setState((prev) => ({ ...prev, style }));
  }, []);

  const generate = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: state.prompt,
          size: state.size,
          quality: state.quality,
          style: state.style,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        result: data,
      }));

      return data as GenerateImageResponse;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate image";
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      return null;
    }
  }, [state.prompt, state.size, state.quality, state.style]);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    setPrompt,
    setSize,
    setQuality,
    setStyle,
    generate,
    reset,
  };
}
