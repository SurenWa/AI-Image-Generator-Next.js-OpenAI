"use client";

import { toast } from "sonner";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { useImageHistory } from "@/hooks/useImageHistory";
import { PromptInput } from "./PromptInput";
import { SettingsPanel } from "./SettingsPanel";
import { ImageDisplay } from "./ImageDisplay";
import { ImageHistory } from "./ImageHistory";
import type { ImageHistoryItem } from "@/lib/types";

export function ImageGenerator() {
  const {
    prompt,
    size,
    quality,
    style,
    isLoading,
    error,
    result,
    setPrompt,
    setSize,
    setQuality,
    setStyle,
    generate,
  } = useImageGeneration();

  const { items, isLoaded, addItem, removeItem, clearHistory } =
    useImageHistory();

  const handleGenerate = async () => {
    const data = await generate();
    if (data) {
      toast.success("Image generated successfully!");
      addItem({
        prompt,
        revisedPrompt: data.revisedPrompt,
        imageUrl: data.url,
        size,
        quality,
        style,
      });
    } else {
      toast.error("Failed to generate image");
    }
  };

  const handleSelectHistory = (item: ImageHistoryItem) => {
    setPrompt(item.prompt);
    setSize(item.size);
    setQuality(item.quality);
    setStyle(item.style);
  };

  const handleVary = () => {
    if (result?.revisedPrompt) {
      setPrompt(result.revisedPrompt);
      toast("Prompt loaded for variation — edit and regenerate!");
    }
  };

  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="space-y-6">
          <PromptInput
            prompt={prompt}
            onPromptChange={setPrompt}
            onSubmit={handleGenerate}
            isLoading={isLoading}
          />
          <SettingsPanel
            size={size}
            quality={quality}
            style={style}
            onSizeChange={setSize}
            onQualityChange={setQuality}
            onStyleChange={setStyle}
            disabled={isLoading}
          />
        </div>
        <div>
          <ImageDisplay result={result} isLoading={isLoading} error={error} onVary={handleVary} />
        </div>
      </div>
      <ImageHistory
        items={items}
        isLoaded={isLoaded}
        onSelect={handleSelectHistory}
        onRemove={removeItem}
        onClear={clearHistory}
      />
    </div>
  );
}
