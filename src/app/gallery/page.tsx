import { GalleryGrid } from "@/components/GalleryGrid";

export default function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Gallery</h1>
      <GalleryGrid />
    </div>
  );
}
