"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useImageHistory } from "@/hooks/useImageHistory";
import type { ImageHistoryItem } from "@/lib/types";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function GalleryGrid() {
  const { items, isLoaded, removeItem, clearHistory } = useImageHistory();
  const [selected, setSelected] = useState<ImageHistoryItem | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (item: ImageHistoryItem) => {
    setIsDownloading(true);
    try {
      const response = await fetch(item.imageUrl);
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

  const handleShare = async (item: ImageHistoryItem) => {
    try {
      await navigator.clipboard.writeText(item.imageUrl);
      toast.success("Image URL copied to clipboard!");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const handleDelete = (id: string) => {
    removeItem(id);
    if (selected?.id === id) setSelected(null);
    toast.success("Image removed from history");
  };

  if (!isLoaded) return null;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-4 h-16 w-16 text-muted-foreground/50"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
        <h2 className="mb-2 text-xl font-semibold">No images yet</h2>
        <p className="mb-4 text-muted-foreground">
          Generate your first image to start building your gallery.
        </p>
        <Button asChild>
          <Link href="/">Start Creating</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {items.length} image{items.length !== 1 ? "s" : ""}
        </p>
        <Button variant="ghost" size="sm" onClick={clearHistory}>
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item) => (
          <Card
            key={item.id}
            className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
            onClick={() => setSelected(item)}
          >
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <Image
                  src={item.imageUrl}
                  alt={item.prompt}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  unoptimized
                />
              </div>
              <div className="p-2.5">
                <p className="line-clamp-2 text-xs leading-snug">
                  {item.prompt}
                </p>
                <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>{item.size}</span>
                  <span>&middot;</span>
                  <span className="capitalize">{item.quality}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-3xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">Image Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                  <Image
                    src={selected.imageUrl}
                    alt={selected.prompt}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Prompt
                    </p>
                    <p className="mt-0.5 text-sm">{selected.prompt}</p>
                  </div>
                  {selected.revisedPrompt &&
                    selected.revisedPrompt !== selected.prompt && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          DALL-E Revised Prompt
                        </p>
                        <p className="mt-0.5 text-sm">
                          {selected.revisedPrompt}
                        </p>
                      </div>
                    )}
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>{selected.size}</span>
                    <span>&middot;</span>
                    <span className="capitalize">{selected.quality}</span>
                    <span>&middot;</span>
                    <span className="capitalize">{selected.style}</span>
                    <span>&middot;</span>
                    <span>{formatDate(selected.createdAt)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(selected)}
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
                    size="sm"
                    variant="outline"
                    onClick={() => handleShare(selected)}
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
                  <Button asChild size="sm" variant="outline">
                    <Link href="/" onClick={() => setSelected(null)}>
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
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(selected.id)}
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
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
