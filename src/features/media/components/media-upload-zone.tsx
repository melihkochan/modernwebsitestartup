"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, X, CheckCircle, AlertCircle, Loader2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUploadFiles, formatFileSize } from "../hooks/use-media";
import type { MediaBucket, UploadProgress } from "../types/media-types";
import { ALLOWED_MEDIA_TYPES } from "../types/media-types";
import { useToast } from "@/components/ui/toast";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface MediaUploadZoneProps {
  bucket: MediaBucket;
  folder?: string;
  onUploadComplete?: (results: UploadProgress[]) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// İlerleme Öğesi
// ---------------------------------------------------------------------------

function ProgressItem({ item }: { item: UploadProgress }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-xs font-medium truncate max-w-[200px]"
          style={{ color: "#d4d4d8" }}
        >
          {item.fileName}
        </span>
        <span className="shrink-0">
          {item.status === "tamamlandi" && (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          )}
          {item.status === "hata" && (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          {item.status === "yukleniyor" && (
            <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--accent-primary)" }} />
          )}
          {item.status === "bekliyor" && (
            <span className="text-[10px] font-mono" style={{ color: "#a1a1aa" }}>Bekliyor</span>
          )}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full rounded-full bg-[var(--bg-overlay)] overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            item.status === "tamamlandi" && "bg-emerald-500",
            item.status === "hata" && "bg-rose-500",
            item.status === "yukleniyor" && "bg-[var(--accent-primary)] animate-pulse",
            item.status === "bekliyor" && "bg-[var(--border-strong)]"
          )}
          style={{ width: `${item.progress}%` }}
        />
      </div>

      {item.status === "hata" && item.error && (
        <p className="text-[10px] text-rose-400 leading-tight">{item.error}</p>
      )}

      {item.status === "tamamlandi" && item.result && (
        <p className="text-[10px] text-emerald-400">
          Başarıyla Yüklendi — {formatFileSize(item.result.size)}
          {item.result.width && ` · ${item.result.width}×${item.result.height}px`}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ana Bileşen
// ---------------------------------------------------------------------------

export function MediaUploadZone({
  bucket,
  folder,
  onUploadComplete,
  className,
}: MediaUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  // Sıra (Staging queue) yönetimi
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // Galeri için metadata form state'leri
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("diger");
  const [altText, setAltText] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const { upload, progress, clearProgress } = useUploadFiles(bucket, folder);

  const isUploading = progress.some((p) => p.status === "yukleniyor" || p.status === "bekliyor");
  const hasResults = progress.length > 0;
  const successCount = progress.filter((p) => p.status === "tamamlandi").length;
  const errorCount = progress.filter((p) => p.status === "hata").length;

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      if (bucket === "gallery") {
        // Galeri bucket'ında dosyaları hemen yükleme, sıraya ekle
        setSelectedFiles((prev) => [...prev, ...files]);
        
        // Eğer başlık ve alt metin henüz boşsa, ilk dosya adından türet
        if (files.length > 0 && !title) {
          const clean = files[0].name
            .replace(/\.[^.]+$/, "")
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          setTitle(clean);
          setAltText(clean);
        }
      } else {
        // Diğer bucket'larda (avatars, thumbnails) doğrudan yükle
        const results = await upload(files);
        if (results.some((r) => r.status === "tamamlandi")) {
          toast({
            type: "success",
            title: "Yükleme Başarılı",
            description: `${results.filter((r) => r.status === "tamamlandi").length} dosya başarıyla yüklendi.`,
          });
        }
        onUploadComplete?.(results);
      }
    },
    [bucket, upload, onUploadComplete, title, toast]
  );

  const handleUploadStart = async () => {
    if (selectedFiles.length === 0) return;

    const meta = bucket === "gallery" ? {
      title: title.trim() || undefined,
      description: description.trim() || null,
      category,
      altText: altText.trim() || null,
      isFeatured
    } : undefined;

    const results = await upload(selectedFiles, meta);
    
    const succeeded = results.filter((r) => r.status === "tamamlandi").length;
    
    if (succeeded > 0) {
      toast({
        type: "success",
        title: "Yükleme Başarılı",
        description: `${succeeded} dosya başarıyla yüklenerek galeriye kaydedildi.`,
      });
      
      // Upload kuyruğunu ve form alanlarını temizle
      setSelectedFiles([]);
      setTitle("");
      setDescription("");
      setCategory("diger");
      setAltText("");
      setIsFeatured(false);
    } else {
      toast({
        type: "error",
        title: "Yükleme Başarısız",
        description: "Dosyalar yüklenirken hata oluştu.",
      });
    }

    onUploadComplete?.(results);
  };

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    },
    [handleFiles]
  );

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      handleFiles(files);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [handleFiles]
  );

  const acceptString = ALLOWED_MEDIA_TYPES.join(",");

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      
      {/* Sürükle Bırak Alanı (Kuyruk boşken veya galeri dışı bucket'larda görünür) */}
      {(selectedFiles.length === 0 || bucket !== "gallery") && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Dosya yükle"
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
          }}
          className={cn(
            "relative flex flex-col items-center justify-center gap-3 rounded-[var(--radius-xl)] border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 select-none",
            isDragging
              ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/5 scale-[1.01]"
              : "border-[var(--border-default)] hover:border-[var(--accent-primary)]/50 hover:bg-[var(--bg-overlay)]/50",
            isUploading && "pointer-events-none opacity-70"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptString}
            onChange={onInputChange}
            className="hidden"
            aria-hidden="true"
          />

          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
              isDragging
                ? "bg-[var(--accent-primary)]/20"
                : "bg-[var(--bg-overlay)]"
            )}
          >
            {isUploading ? (
              <Loader2
                className="w-6 h-6 animate-spin"
                style={{ color: "var(--accent-primary)" }}
              />
            ) : (
              <Upload
                className={cn(
                  "w-6 h-6 transition-colors",
                  isDragging ? "text-[var(--accent-primary)]" : ""
                )}
                style={{ color: isDragging ? "var(--accent-primary)" : "#a1a1aa" }}
              />
            )}
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold" style={{ color: "#ededed" }}>
              {isDragging
                ? "Dosyaları buraya bırakın"
                : "Sürükle & Bırak veya Tıklayın"}
            </p>
            {bucket === "gallery" ? (
              <div className="flex flex-col gap-0.5 text-xs" style={{ color: "#a1a1aa" }}>
                <span>PNG, JPG, WEBP, GIF — Maksimum 50 MB</span>
                <span>MP4, WEBM, MOV — Maksimum 250 MB</span>
              </div>
            ) : (
              <p className="text-xs" style={{ color: "#a1a1aa" }}>
                PNG, JPG, WEBP, GIF — Maksimum 5 MB
              </p>
            )}
            <p className="text-[10px]" style={{ color: "#71717a" }}>
              Görseller otomatik olarak WebP formatına sıkıştırılır (videolar dönüştürülmez)
            </p>
          </div>
        </div>
      )}

      {/* Galeri Bucket'ı Staging Formu ve Dosya Kuyruğu */}
      {bucket === "gallery" && selectedFiles.length > 0 && (
        <div className="rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--bg-overlay)]/40 p-5 flex flex-col gap-4">
          
          <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "#ededed" }}>
              Galeri Görsel Bilgileri
            </h3>
            <button
              onClick={() => setSelectedFiles([])}
              className="text-xs flex items-center gap-1 hover:text-white cursor-pointer"
              style={{ color: "#a1a1aa" }}
            >
              <X className="w-3.5 h-3.5" /> Kuyruğu Temizle
            </button>
          </div>

          {/* Form Alanları */}
          <div className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold" style={{ color: "#a1a1aa" }}>Başlık (Zorunlu)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Görsel veya Video başlığı giriniz..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] outline-none focus:border-[var(--accent-primary)] text-[#ededed]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold" style={{ color: "#a1a1aa" }}>Açıklama (Opsiyonel)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Görsel veya Video için detaylı açıklama..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] outline-none focus:border-[var(--accent-primary)] text-[#ededed] resize-none h-16"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold" style={{ color: "#a1a1aa" }}>Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] outline-none focus:border-[var(--accent-primary)] text-[#ededed] cursor-pointer"
                >
                  <option value="yayin">Yayın</option>
                  <option value="hayran-sanati">Hayran Sanatı</option>
                  <option value="irl">IRL</option>
                  <option value="etkinlik">Etkinlik</option>
                  <option value="diger">Diğer</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold" style={{ color: "#a1a1aa" }}>Alt Metin (SEO - Opsiyonel)</label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Ekran okuyucular ve arama motorları için alt metin..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] outline-none focus:border-[var(--accent-primary)] text-[#ededed]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-[var(--border-default)] bg-[var(--bg-surface)] focus:ring-0 text-[var(--accent-primary)] cursor-pointer"
              />
              <label htmlFor="isFeatured" className="text-xs select-none cursor-pointer" style={{ color: "#d4d4d8" }}>
                Bu görseli galeri sayfasında &quot;Öne Çıkar&quot;
              </label>
            </div>
          </div>

          {/* Dosya listesi */}
          <div className="flex flex-col gap-2 p-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl mt-1">
            <p className="text-[11px] font-bold" style={{ color: "#a1a1aa" }}>Kuyruktaki Dosyalar ({selectedFiles.length}):</p>
            <div className="max-h-24 overflow-y-auto flex flex-col gap-1.5">
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 px-2 py-1 rounded bg-[var(--bg-overlay)] text-[11px]">
                  <span className="truncate flex-1 font-mono" style={{ color: "#a1a1aa" }}>{file.name}</span>
                  <span className="text-[10px] shrink-0" style={{ color: "#71717a" }}>{formatFileSize(file.size)}</span>
                  <button
                    disabled={isUploading}
                    onClick={() => setSelectedFiles((prev) => prev.filter((_, i) => i !== idx))}
                    className="text-rose-400 hover:text-rose-300 p-0.5 shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Aksiyon Butonları */}
          <div className="flex gap-2.5 justify-end mt-1">
            <button
              disabled={isUploading}
              onClick={() => setSelectedFiles([])}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-[var(--border-default)] hover:bg-[var(--bg-surface)] cursor-pointer text-[#a1a1aa] transition-colors disabled:opacity-50"
            >
              İptal
            </button>
            <button
              disabled={isUploading || selectedFiles.length === 0}
              onClick={handleUploadStart}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white cursor-pointer transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isUploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isUploading ? "Yükleniyor..." : "Dosyaları Yükle"}
            </button>
          </div>
        </div>
      )}

      {/* İlerleme Listesi */}
      {hasResults && (
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" style={{ color: "#a1a1aa" }} />
              <span className="text-xs font-semibold" style={{ color: "#d4d4d8" }}>
                {progress.length} dosya
                {successCount > 0 && (
                  <span className="text-emerald-400 ml-1">· {successCount} başarılı</span>
                )}
                {errorCount > 0 && (
                  <span className="text-rose-400 ml-1">· {errorCount} hatalı</span>
                )}
              </span>
            </div>

            <button
              disabled={isUploading}
              onClick={clearProgress}
              className="text-[10px] font-semibold hover:text-white cursor-pointer disabled:opacity-50"
              style={{ color: "#71717a" }}
            >
              Temizle
            </button>
          </div>

          <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-1">
            {progress.map((item) => (
              <ProgressItem key={item.fileName} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
