"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { GenerateImageResponse } from "@/lib/types";

interface ImageDisplayProps {
  result: GenerateImageResponse | null;
  isLoading: boolean;
  error: string | null;
  onVary?: () => void;
}

export function ImageDisplay({ result, isLoading, error, onVary }: ImageDisplayProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!result) return;
    setIsDownloading(true);
    try {
      const response = await fetch(result.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Image downloaded!");
    } catch {
      toast.error("Failed to download image");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyPrompt = async () => {
    if (!result?.revisedPrompt) return;
    try {
      await navigator.clipboard.writeText(result.revisedPrompt);
      toast.success("Prompt copied to clipboard!");
    } catch {
      toast.error("Failed to copy prompt");
    }
  };

  const handleShare = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.url);
      toast.success("Image URL copied to clipboard!");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <p className="font-medium text-destructive">Generation failed</p>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-center p-12">
          <div className="text-center text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto mb-3 h-12 w-12 opacity-50"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <p className="font-medium">No image yet</p>
            <p className="mt-1 text-sm">
              Enter a prompt and click Generate to create an image
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-square w-full">
          <Image
            src={result.url}
            alt={result.revisedPrompt}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1.5 h-4 w-4"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              {isDownloading ? "Downloading..." : "Download"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyPrompt}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1.5 h-4 w-4"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              Copy Prompt
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1.5 h-4 w-4"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" x2="12" y1="2" y2="15" />
              </svg>
              Share URL
            </Button>
            {onVary && (
              <Button
                variant="outline"
                size="sm"
                onClick={onVary}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1.5 h-4 w-4"
                >
                  <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                </svg>
                Vary
              </Button>
            )}
          </div>
          {result.revisedPrompt && (
            <div className="mt-3">
              <p className="text-xs font-medium text-muted-foreground">
                DALL-E interpreted your prompt as:
              </p>
              <p className="mt-1 text-sm">{result.revisedPrompt}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
