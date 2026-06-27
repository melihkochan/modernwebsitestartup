/**
 * Media Validators — Dosya doğrulama ve istemci taraflı görsel işleme
 *
 * - MIME type kontrolü
 * - Dosya boyutu kontrolü
 * - Canvas API ile EXIF temizleme + WebP dönüşümü + sıkıştırma
 * - Görsel boyutları otomatik okuma
 */

import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  FILE_SIZE_LIMITS,
  type AllowedImageType,
  type MediaBucket,
} from "../types/media-types";

// ---------------------------------------------------------------------------
// Doğrulama Sonucu
// ---------------------------------------------------------------------------

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// ---------------------------------------------------------------------------
// MIME Type Doğrulama
// ---------------------------------------------------------------------------

export function validateMimeType(file: File): ValidationResult {
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type as AllowedImageType);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(
    file.type as (typeof ALLOWED_VIDEO_TYPES)[number]
  );

  if (!isImage && !isVideo) {
    return {
      valid: false,
      error: `Geçersiz Dosya Formatı: "${file.type}". Desteklenen formatlar: PNG, JPG, WEBP, GIF, MP4, WEBM, MOV`,
    };
  }
  return { valid: true };
}

// ---------------------------------------------------------------------------
// Dosya Boyutu Doğrulama (bucket'a göre)
// ---------------------------------------------------------------------------

export function validateFileSize(file: File, bucket: MediaBucket): ValidationResult {
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type as AllowedImageType);
  const limit =
    bucket === "thumbnails" || bucket === "avatars"
      ? FILE_SIZE_LIMITS.THUMBNAIL
      : isImage
        ? FILE_SIZE_LIMITS.IMAGE
        : FILE_SIZE_LIMITS.VIDEO;

  if (file.size > limit) {
    const limitMB = Math.round(limit / 1024 / 1024);
    const fileMB = (file.size / 1024 / 1024).toFixed(1);
    return {
      valid: false,
      error: `Dosya Çok Büyük: ${fileMB} MB (maksimum ${limitMB} MB)`,
    };
  }
  return { valid: true };
}

// ---------------------------------------------------------------------------
// Dosya Adı Sanitize
// ---------------------------------------------------------------------------

export function sanitizeFileName(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "bin";
  const base = name
    .replace(/\.[^.]+$/, "")           // extension kaldır
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")         // özel karakterleri çizgiye çevir
    .replace(/-+/g, "-")                // çoklu çizgileri teke indir
    .replace(/^-|-$/g, "")             // baş/sondaki çizgileri sil
    .substring(0, 80);                  // maksimum 80 karakter

  const timestamp = Date.now();
  return `${base || "dosya"}-${timestamp}.${ext}`;
}

// ---------------------------------------------------------------------------
// Görsel Boyutlarını Oku
// ---------------------------------------------------------------------------

export function readImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type as AllowedImageType)) {
      reject(new Error("Boyut yalnızca görseller için okunabilir"));
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Görsel boyutu okunamadı"));
    };

    img.src = url;
  });
}

// ---------------------------------------------------------------------------
// Canvas tabanlı görsel işleme:
//   1. EXIF metadata otomatik temizlenir (canvas redraw ile)
//   2. WebP'ye dönüştürülür (GIF hariç)
//   3. Hedef boyutu aşıyorsa sıkıştırılır
// ---------------------------------------------------------------------------

const COMPRESSION_QUALITY = 0.85;  // WebP kalitesi
const MAX_DIMENSION = 3840;         // 4K üstünü yeniden boyutlandır

export interface ProcessedImage {
  blob: Blob;
  mimeType: string;
  width: number;
  height: number;
  originalSize: number;
  processedSize: number;
  /** Yeni dosya adı (.webp uzantılı olabilir) */
  fileName: string;
}

export async function processImageFile(file: File): Promise<ProcessedImage> {
  // GIF'leri sıkıştırmadan bırak (animasyon korunması için)
  if (file.type === "image/gif") {
    const { width, height } = await readImageDimensions(file).catch(() => ({
      width: 0,
      height: 0,
    }));
    return {
      blob: file,
      mimeType: "image/gif",
      width,
      height,
      originalSize: file.size,
      processedSize: file.size,
      fileName: sanitizeFileName(file.name),
    };
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { naturalWidth: w, naturalHeight: h } = img;

      // 4K üstünü yeniden boyutlandır
      if (w > MAX_DIMENSION || h > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / w, MAX_DIMENSION / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context oluşturulamadı"));
        return;
      }

      // Canvas'a çizmek EXIF metadata'yı otomatik temizler
      ctx.drawImage(img, 0, 0, w, h);

      // WebP'ye dönüştür (EXIF yok, sıkıştırılmış)
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Görsel işlenemedi"));
            return;
          }

          const originalName = file.name.replace(/\.[^.]+$/, "");
          const fileName = sanitizeFileName(`${originalName}.webp`);

          resolve({
            blob,
            mimeType: "image/webp",
            width: w,
            height: h,
            originalSize: file.size,
            processedSize: blob.size,
            fileName,
          });
        },
        "image/webp",
        COMPRESSION_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Görsel yüklenemedi"));
    };

    img.src = objectUrl;
  });
}

// ---------------------------------------------------------------------------
// Tam Doğrulama Pipeline
// ---------------------------------------------------------------------------

export function validateFile(file: File, bucket: MediaBucket): ValidationResult {
  const mimeResult = validateMimeType(file);
  if (!mimeResult.valid) return mimeResult;

  const sizeResult = validateFileSize(file, bucket);
  if (!sizeResult.valid) return sizeResult;

  return { valid: true };
}
