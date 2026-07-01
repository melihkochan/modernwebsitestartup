import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaceholderImageProps {
  className?: string;
  alt?: string;
}

export function PlaceholderImage({ className, alt }: PlaceholderImageProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-zinc-900/60 border border-zinc-800/40 rounded-xl gap-2 text-zinc-500 w-full h-full p-4 text-center select-none",
        className
      )}
    >
      <ImageOff className="w-6 h-6 text-zinc-600" />
      <span className="text-[10px] uppercase font-bold tracking-wider truncate max-w-[90%] text-zinc-400">
        {alt || "Görsel Yüklenemedi"}
      </span>
    </div>
  );
}
