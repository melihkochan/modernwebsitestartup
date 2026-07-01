import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/errors";
import type { MediaFile, MediaBucket, UploadResult } from "../types/media-types";
import { sanitizeFileName, validateFile, processImageFile, readImageDimensions } from "../validators/media-validators";
import { ALLOWED_IMAGE_TYPES } from "../types/media-types";
import type { AllowedImageType } from "../types/media-types";

// ---------------------------------------------------------------------------
// Dosya Listeleme
// ---------------------------------------------------------------------------

/**
 * Verilen bucket ve opsiyonel klasördeki tüm dosyaları listeler.
 * Storage metadata'dan public URL otomatik üretilir.
 */
export async function listFiles(
  bucket: MediaBucket,
  folder?: string
): Promise<MediaFile[]> {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder ?? "", {
      limit: 200,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (error) {
    throw new RepositoryError(error.message, "LIST_FILES_FAILED", error);
  }

  if (!data) return [];

  // Klasörleri (metadata null olanları) filtrele — yalnızca gerçek dosyalar
  const files = data.filter((item) => item.metadata !== null);

  return files.map((item) => {
    const path = folder ? `${folder}/${item.name}` : item.name;
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);

    return {
      path,
      name: item.name,
      size: item.metadata?.size ?? 0,
      mimeType: item.metadata?.mimetype ?? "application/octet-stream",
      publicUrl: urlData.publicUrl,
      createdAt: item.created_at ?? new Date().toISOString(),
      updatedAt: item.updated_at ?? new Date().toISOString(),
      bucket,
    } satisfies MediaFile;
  });
}

// ---------------------------------------------------------------------------
// Dosya Yükleme
// ---------------------------------------------------------------------------

/**
 * Dosyayı doğrular, görseli sıkıştırır (EXIF temizler), Storage'a yükler.
 *
 * @param bucket   Hedef bucket (avatars | gallery | thumbnails)
 * @param file     Yüklenecek File nesnesi
 * @param folder   Opsiyonel alt klasör (örn. "2024/06")
 */
export async function uploadFile(
  bucket: MediaBucket,
  file: File,
  folder?: string,
  metadata?: {
    title?: string;
    description?: string | null;
    category?: string;
    altText?: string | null;
    isFeatured?: boolean;
  }
): Promise<UploadResult> {
  // 1. Doğrulama
  const validation = validateFile(file, bucket);
  if (!validation.valid) {
    return {
      success: false,
      path: "",
      publicUrl: "",
      fileName: file.name,
      size: file.size,
      error: validation.error,
    };
  }

  const supabase = createClient();
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type as AllowedImageType);

  let uploadBlob: Blob = file;
  let uploadMimeType: string = file.type;
  let uploadFileName: string = sanitizeFileName(file.name);
  let width: number | undefined;
  let height: number | undefined;

  // 2. Görsel işleme: EXIF temizle, WebP'ye dönüştür, sıkıştır
  if (isImage) {
    try {
      const processed = await processImageFile(file);
      uploadBlob = processed.blob;
      uploadMimeType = processed.mimeType;
      uploadFileName = processed.fileName;
      width = processed.width;
      height = processed.height;
    } catch {
      // İşleme başarısız olursa orijinal dosyayı yükle, sadece boyutları oku
      try {
        const dims = await readImageDimensions(file);
        width = dims.width;
        height = dims.height;
      } catch {
        // Boyutlar okunamadıysa devam et
      }
      uploadFileName = sanitizeFileName(file.name);
    }
  }

  // 3. Yol oluştur
  const path = folder ? `${folder}/${uploadFileName}` : uploadFileName;

  // 4. Storage'a yükle
  const { error } = await supabase.storage.from(bucket).upload(path, uploadBlob, {
    contentType: uploadMimeType,
    upsert: false, // Duplicate engellemek için false
  });

  if (error) {
    // Duplicate dosya hatası
    if (error.message.includes("already exists") || error.message.includes("Duplicate")) {
      return {
        success: false,
        path,
        publicUrl: "",
        fileName: uploadFileName,
        size: uploadBlob.size,
        error: `Bu isimde bir dosya zaten mevcut: "${uploadFileName}"`,
      };
    }
    return {
      success: false,
      path,
      publicUrl: "",
      fileName: uploadFileName,
      size: uploadBlob.size,
      error: `Yükleme başarısız: ${error.message}`,
    };
  }

  // 5. Public URL al
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);

  // If the bucket is "gallery", save it to the "gallery" table
  if (bucket === "gallery") {
    // Generate a user-friendly default title from original filename
    const cleanTitle = file.name
      .replace(/\.[^.]+$/, "") // remove extension
      .replace(/[-_]/g, " ")   // replace dashes/underscores with space
      .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize words

    const insertTitle = metadata?.title ?? cleanTitle;
    const insertDescription = metadata?.description ?? null;
    const insertCategory = metadata?.category ?? "diger";
    const insertAltText = metadata?.altText ?? cleanTitle;
    const insertIsFeatured = metadata?.isFeatured ?? false;

    const { error: dbError } = await supabase
      .from("gallery")
      .insert({
        title: insertTitle,
        description: insertDescription,
        image_url: urlData.publicUrl,
        thumbnail_url: null,
        category: insertCategory,
        alt_text: insertAltText,
        width: width ?? null,
        height: height ?? null,
        file_size: uploadBlob.size,
        is_featured: insertIsFeatured,
        order_index: 0,
        usage_context: "galeri"
      });

    if (dbError) {
      // Clean up uploaded file from storage if DB insert fails to maintain consistency
      await supabase.storage.from(bucket).remove([path]);
      
      return {
        success: false,
        path,
        publicUrl: "",
        fileName: uploadFileName,
        size: uploadBlob.size,
        error: `Storage yüklemesi başarılı ancak galeri kaydı oluşturulamadı. Hata: ${dbError.message}`,
      };
    }
  }

  return {
    success: true,
    path,
    publicUrl: urlData.publicUrl,
    fileName: uploadFileName,
    size: uploadBlob.size,
    width,
    height,
  };
}

// ---------------------------------------------------------------------------
// Dosya Silme
// ---------------------------------------------------------------------------

export async function deleteFile(bucket: MediaBucket, path: string): Promise<void> {
  const supabase = createClient();

  // 1. Get public URL to match in gallery table
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
  const publicUrl = urlData.publicUrl;

  // 2. Remove file from storage
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new RepositoryError(error.message, "DELETE_FILE_FAILED", error);
  }

  // 3. Remove metadata from gallery table if bucket is gallery
  if (bucket === "gallery") {
    const { error: dbError } = await supabase
      .from("gallery")
      .delete()
      .eq("image_url", publicUrl);

    if (dbError) {
      throw new RepositoryError(`Galeri kaydı silinemedi: ${dbError.message}`, "DELETE_GALLERY_RECORD_FAILED", dbError);
    }
  }
}

// ---------------------------------------------------------------------------
// Yeniden Adlandırma (kopyala + sil)
// ---------------------------------------------------------------------------

export async function renameFile(
  bucket: MediaBucket,
  oldPath: string,
  newName: string
): Promise<string> {
  const supabase = createClient();

  const folder = oldPath.includes("/") ? oldPath.split("/").slice(0, -1).join("/") : undefined;
  const newPath = folder ? `${folder}/${sanitizeFileName(newName)}` : sanitizeFileName(newName);

  // 1. Get old and new public URLs
  const { data: oldUrlData } = supabase.storage.from(bucket).getPublicUrl(oldPath);
  const oldPublicUrl = oldUrlData.publicUrl;

  // 2. Move file in Storage
  const { error } = await supabase.storage.from(bucket).move(oldPath, newPath);

  if (error) {
    throw new RepositoryError(error.message, "RENAME_FILE_FAILED", error);
  }

  const { data: newUrlData } = supabase.storage.from(bucket).getPublicUrl(newPath);
  const newPublicUrl = newUrlData.publicUrl;

  // 3. Update gallery metadata if bucket is gallery
  if (bucket === "gallery") {
    const cleanTitle = newName
      .replace(/\.[^.]+$/, "")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const { error: dbError } = await supabase
      .from("gallery")
      .update({
        title: cleanTitle,
        image_url: newPublicUrl,
        alt_text: cleanTitle
      })
      .eq("image_url", oldPublicUrl);

    if (dbError) {
      throw new RepositoryError(`Galeri kaydı güncellenemedi: ${dbError.message}`, "UPDATE_GALLERY_RECORD_FAILED", dbError);
    }
  }

  return newPath;
}

// ---------------------------------------------------------------------------
// Public URL Üretme
// ---------------------------------------------------------------------------

export function getPublicUrl(bucket: MediaBucket, path: string): string {
  const supabase = createClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// ---------------------------------------------------------------------------
// Geliştirici Kopyalama Formatları
// ---------------------------------------------------------------------------

export function buildCopyContent(
  format: "url" | "markdown" | "html" | "nextimage",
  publicUrl: string,
  altText?: string,
  width?: number,
  height?: number
): string {
  const alt = altText ?? "görsel";

  switch (format) {
    case "url":
      return publicUrl;

    case "markdown":
      return `![${alt}](${publicUrl})`;

    case "html":
      return width && height
        ? `<img src="${publicUrl}" alt="${alt}" width="${width}" height="${height}" loading="lazy" />`
        : `<img src="${publicUrl}" alt="${alt}" loading="lazy" />`;

    case "nextimage":
      return width && height
        ? `<Image\n  src="${publicUrl}"\n  alt="${alt}"\n  width={${width}}\n  height={${height}}\n  loading="lazy"\n/>`
        : `<Image\n  src="${publicUrl}"\n  alt="${alt}"\n  fill\n  loading="lazy"\n/>`;

    default:
      return publicUrl;
  }
}

export async function getFileUsageContext(publicUrl: string): Promise<string[]> {
  const supabase = createClient();
  const contexts: string[] = [];

  try {
    const { data: assets } = await supabase
      .from("site_assets")
      .select("logo_url, favicon_url, avatar_placeholder_url, image_placeholder_url, og_image_url, avatar_url, hero_banner_url, white_logo_url, dark_logo_url, offline_cover_url, default_thumbnail_url, illustration_404_url")
      .limit(1)
      .maybeSingle();

    if (assets) {
      if (assets.avatar_url === publicUrl) contexts.push("Avatar");
      if (assets.logo_url === publicUrl) contexts.push("Navbar Logo");
      if (assets.white_logo_url === publicUrl) contexts.push("White Logo");
      if (assets.dark_logo_url === publicUrl) contexts.push("Dark Logo");
      if (assets.offline_cover_url === publicUrl) contexts.push("Offline Cover");
      if (assets.default_thumbnail_url === publicUrl) contexts.push("Default Thumbnail");
      if (assets.illustration_404_url === publicUrl) contexts.push("404 Illustration");
      if (assets.hero_banner_url === publicUrl) contexts.push("Hero Banner");
      if (assets.og_image_url === publicUrl) contexts.push("Open Graph Image");
    }



    const { data: galleryItems } = await supabase
      .from("gallery")
      .select("is_featured")
      .eq("image_url", publicUrl);

    if (galleryItems && galleryItems.length > 0) {
      galleryItems.forEach((g) => {
        if (g.is_featured) {
          contexts.push("Featured Gallery");
        } else {
          contexts.push("Gallery");
        }
      });
    }

    const { data: setupItems } = await supabase
      .from("setup_items")
      .select("id")
      .eq("image_url", publicUrl);

    if (setupItems && setupItems.length > 0) {
      contexts.push("Setup Item Image");
    }

    const { data: timelineItems } = await supabase
      .from("timeline")
      .select("id")
      .eq("media_url", publicUrl);

    if (timelineItems && timelineItems.length > 0) {
      contexts.push("Timeline Event Media");
    }
  } catch (err) {
    console.error("Failed to check file usage:", err);
  }

  return Array.from(new Set(contexts));
}
