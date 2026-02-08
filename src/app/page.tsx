import { ImageGenerator } from "@/components/ImageGenerator";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight">
            AI Image Studio
          </h1>
          <p className="text-lg text-muted-foreground">
            Describe any image you can imagine and bring it to life with
            DALL-E 3.
          </p>
        </div>
        <ImageGenerator />
      </div>
    </div>
  );
}
