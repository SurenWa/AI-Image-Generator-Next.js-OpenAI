"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IMAGE_SIZES, IMAGE_QUALITIES, IMAGE_STYLES } from "@/lib/constants";
import type { ImageSize, ImageQuality, ImageStyle } from "@/lib/types";

interface SettingsPanelProps {
  size: ImageSize;
  quality: ImageQuality;
  style: ImageStyle;
  onSizeChange: (size: ImageSize) => void;
  onQualityChange: (quality: ImageQuality) => void;
  onStyleChange: (style: ImageStyle) => void;
  disabled: boolean;
}

export function SettingsPanel({
  size,
  quality,
  style,
  onSizeChange,
  onQualityChange,
  onStyleChange,
  disabled,
}: SettingsPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Size
        </label>
        <Select
          value={size}
          onValueChange={(v) => onSizeChange(v as ImageSize)}
          disabled={disabled}
        >
          <SelectTrigger className="w-full" aria-label="Image size">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {IMAGE_SIZES.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Quality
        </label>
        <Select
          value={quality}
          onValueChange={(v) => onQualityChange(v as ImageQuality)}
          disabled={disabled}
        >
          <SelectTrigger className="w-full" aria-label="Image quality">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {IMAGE_QUALITIES.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Style
        </label>
        <Select
          value={style}
          onValueChange={(v) => onStyleChange(v as ImageStyle)}
          disabled={disabled}
        >
          <SelectTrigger className="w-full" aria-label="Image style">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {IMAGE_STYLES.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
