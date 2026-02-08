"use client";

import { useState, useEffect, useCallback } from "react";
import type { ImageHistoryItem } from "@/lib/types";

const STORAGE_KEY = "ai-image-studio-history";
const MAX_HISTORY_ITEMS = 50;

function loadHistory(): ImageHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(items: ImageHistoryItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

export function useImageHistory() {
  const [items, setItems] = useState<ImageHistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setItems(loadHistory());
    setIsLoaded(true);
  }, []);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setItems(loadHistory());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const addItem = useCallback(
    (item: Omit<ImageHistoryItem, "id" | "createdAt">) => {
      setItems((prev) => {
        const newItem: ImageHistoryItem = {
          ...item,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        const updated = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
        saveHistory(updated);
        return updated;
      });
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveHistory(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setItems([]);
    saveHistory([]);
  }, []);

  return { items, isLoaded, addItem, removeItem, clearHistory };
}
