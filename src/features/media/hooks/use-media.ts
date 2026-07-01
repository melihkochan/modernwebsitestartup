import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { listFiles, uploadFile, deleteFile, renameFile, getFileUsageContext } from "../services/media-repository";
import type { MediaBucket, MediaFile, UploadProgress } from "../types/media-types";

// ---------------------------------------------------------------------------
// Query Keys
// ---------------------------------------------------------------------------

export const mediaQueryKeys = {
  list: (bucket: MediaBucket, folder?: string) =>
    ["media", "list", bucket, folder ?? ""] as const,
};

// ---------------------------------------------------------------------------
// useMediaList — Bucket dosyalarını listele
// ---------------------------------------------------------------------------

export function useMediaList(bucket: MediaBucket, folder?: string) {
  return useQuery({
    queryKey: mediaQueryKeys.list(bucket, folder),
    queryFn: () => listFiles(bucket, folder),
    staleTime: 60 * 1000, // 1 dakika
  });
}

// ---------------------------------------------------------------------------
// useDeleteFile — Dosya silme mutation
// ---------------------------------------------------------------------------

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bucket, path }: { bucket: MediaBucket; path: string }) =>
      deleteFile(bucket, path),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["media", "list", variables.bucket],
      });
    },
  });
}

// ---------------------------------------------------------------------------
// useRenameFile — Dosya yeniden adlandırma mutation
// ---------------------------------------------------------------------------

export function useRenameFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bucket,
      oldPath,
      newName,
    }: {
      bucket: MediaBucket;
      oldPath: string;
      newName: string;
    }) => renameFile(bucket, oldPath, newName),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["media", "list", variables.bucket],
      });
    },
  });
}

// ---------------------------------------------------------------------------
// useUploadFiles — Çoklu dosya yükleme + ilerleme takibi
// ---------------------------------------------------------------------------

export function useUploadFiles(bucket: MediaBucket, folder?: string) {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState<UploadProgress[]>([]);

  const upload = useCallback(
    async (
      files: File[],
      metadata?: {
        title?: string;
        description?: string | null;
        category?: string;
        altText?: string | null;
        isFeatured?: boolean;
      }
    ) => {
      // Başlangıç durumu
      const initial: UploadProgress[] = files.map((f) => ({
        fileName: f.name,
        status: "bekliyor",
        progress: 0,
      }));
      setProgress(initial);

      const results: UploadProgress[] = [...initial];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Yükleniyor durumuna al
        results[i] = { ...results[i], status: "yukleniyor", progress: 50 };
        setProgress([...results]);

        try {
          const result = await uploadFile(bucket, file, folder, metadata);

          if (result.success) {
            results[i] = {
              ...results[i],
              status: "tamamlandi",
              progress: 100,
              result,
            };
          } else {
            results[i] = {
              ...results[i],
              status: "hata",
              progress: 0,
              error: result.error,
            };
          }
        } catch (err) {
          results[i] = {
            ...results[i],
            status: "hata",
            progress: 0,
            error: err instanceof Error ? err.message : "Bilinmeyen hata",
          };
        }

        setProgress([...results]);
      }

      // Başarılı yükleme varsa liste cache'ini geçersiz kıl
      if (results.some((r) => r.status === "tamamlandi")) {
        queryClient.invalidateQueries({
          queryKey: ["media", "list", bucket],
        });

        if (bucket === "gallery") {
          queryClient.invalidateQueries({
            queryKey: ["gallery"],
          });
        }
      }

      return results;
    },
    [bucket, folder, queryClient]
  );

  const clearProgress = useCallback(() => setProgress([]), []);

  return { upload, progress, clearProgress };
}

// ---------------------------------------------------------------------------
// Dosya Boyutu Formatlama Yardımcısı
// ---------------------------------------------------------------------------

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// ---------------------------------------------------------------------------
// useMediaFiles — Alias ile birden fazla bucket'tan dosya çekme
// ---------------------------------------------------------------------------

export function useAllMediaFiles() {
  const gallery = useMediaList("gallery");
  const avatars = useMediaList("avatars");
  const thumbnails = useMediaList("thumbnails");

  const allFiles: MediaFile[] = [
    ...(gallery.data ?? []),
    ...(avatars.data ?? []),
    ...(thumbnails.data ?? []),
  ];

  return {
    data: allFiles,
    isLoading: gallery.isLoading || avatars.isLoading || thumbnails.isLoading,
    error: gallery.error ?? avatars.error ?? thumbnails.error,
  };
}

export function useFileUsage(publicUrl: string) {
  return useQuery({
    queryKey: ["media", "usage", publicUrl],
    queryFn: () => getFileUsageContext(publicUrl),
    staleTime: 5000,
  });
}
