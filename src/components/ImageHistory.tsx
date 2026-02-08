"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ImageHistoryItem } from "@/lib/types";

interface ImageHistoryProps {
  items: ImageHistoryItem[];
  isLoaded: boolean;
  onSelect: (item: ImageHistoryItem) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ImageHistory({
  items,
  isLoaded,
  onSelect,
  onRemove,
  onClear,
}: ImageHistoryProps) {
  if (!isLoaded) return null;

  if (items.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No images generated yet. Your history will appear here.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">
          Recent Generations
        </h2>
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear All
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item) => (
          <Card
            key={item.id}
            className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-md"
            onClick={() => onSelect(item)}
          >
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <Image
                  src={item.imageUrl}
                  alt={item.prompt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  unoptimized
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item.id);
                  }}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
                  aria-label="Remove from history"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                  >
                    <line x1="18" x2="6" y1="6" y2="18" />
                    <line x1="6" x2="18" y1="6" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="p-2">
                <p className="line-clamp-2 text-xs leading-snug">
                  {item.prompt}
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {timeAgo(item.createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
