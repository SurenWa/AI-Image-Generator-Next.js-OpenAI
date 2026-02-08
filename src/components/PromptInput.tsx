"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MAX_PROMPT_LENGTH, PROMPT_EXAMPLES } from "@/lib/constants";

interface PromptInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function PromptInput({
  prompt,
  onPromptChange,
  onSubmit,
  isLoading,
}: PromptInputProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (prompt.trim() && !isLoading && !isEnhancing) {
        onSubmit();
      }
    }
  };

  const handleEnhance = async () => {
    if (!prompt.trim() || isEnhancing || isLoading) return;
    setIsEnhancing(true);
    try {
      const response = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to enhance prompt");
      }
      onPromptChange(data.enhanced);
      toast.success("Prompt enhanced!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to enhance prompt";
      toast.error(message);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleExampleClick = (example: string) => {
    onPromptChange(example);
  };

  const busy = isLoading || isEnhancing;

  return (
    <div className="space-y-3">
      <div className="relative">
        <Textarea
          placeholder="Describe the image you want to create..."
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={MAX_PROMPT_LENGTH}
          rows={4}
          className="resize-none pr-4 text-base"
          aria-label="Image prompt"
          disabled={busy}
        />
        <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
          {prompt.length}/{MAX_PROMPT_LENGTH}
        </span>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={onSubmit}
          disabled={!prompt.trim() || busy}
          className="flex-1"
          size="lg"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generating...
            </span>
          ) : (
            "Generate Image"
          )}
        </Button>
        <Button
          onClick={handleEnhance}
          disabled={!prompt.trim() || busy}
          variant="outline"
          size="lg"
          title="Use AI to enhance your prompt with vivid details"
        >
          {isEnhancing ? (
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Enhancing...
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              </svg>
              Enhance
            </span>
          )}
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Try an example:
        </p>
        <div className="flex flex-wrap gap-2">
          {PROMPT_EXAMPLES.slice(0, 3).map((example) => (
            <button
              key={example}
              onClick={() => handleExampleClick(example)}
              disabled={busy}
              className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            >
              {example.length > 60 ? example.slice(0, 60) + "..." : example}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Press Ctrl+Enter to generate
      </p>
    </div>
  );
}
