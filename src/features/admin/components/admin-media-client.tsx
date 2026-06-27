"use client";

import { useState, useCallback } from "react";
import {
  Grid,
  List,
  Search,
  Copy,
  Trash2,
  ExternalLink,
  ImageIcon,
  RefreshCw,
  ChevronDown,
  Check,
  Pencil,
  X,
  Play,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useMediaList, useDeleteFile, useRenameFile, formatFileSize } from "@/features/media/hooks/use-media";
import { MediaUploadZone } from "@/features/media/components/media-upload-zone";
import { buildCopyContent } from "@/features/media/services/media-repository";
import type { MediaBucket, MediaFile, MediaViewMode, CopyFormat } from "@/features/media/types/media-types";


// ---------------------------------------------------------------------------
// Sabitler
// ---------------------------------------------------------------------------

const BUCKET_LABELS: Record<MediaBucket, string> = {
  avatars: "Avatarlar",
  gallery: "Galeri",
  thumbnails: "Küçük Resimler",
};

const COPY_FORMAT_LABELS: Record<CopyFormat, string> = {
  url: "URL Kopyala",
  markdown: "Markdown Kopyala",
  html: "HTML Kopyala",
  nextimage: "Next/Image Kopyala",
};

// ---------------------------------------------------------------------------
// Onay Dialog
// ---------------------------------------------------------------------------

function ConfirmDialog({
  fileName,
  onConfirm,
  onCancel,
}: {
  fileName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-xl)] p-6 max-w-sm w-full mx-4 shadow-[var(--shadow-lg)]">
        <h3 className="text-base font-bold mb-2" style={{ color: "#ededed" }}>
          Dosyayı Sil
        </h3>
        <p className="text-sm mb-5" style={{ color: "#a1a1aa" }}>
          <span className="font-mono text-rose-400">{fileName}</span> dosyasını kalıcı olarak silmek istediğinize emin misiniz?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-[var(--border-default)] transition-colors cursor-pointer"
            style={{ color: "#a1a1aa" }}
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-500 hover:bg-rose-600 text-white transition-colors cursor-pointer"
          >
            Dosyayı Sil
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dosya Kartı — Grid Görünümü
// ---------------------------------------------------------------------------

function FileCardGrid({
  file,
  onDelete,
  onCopy: _onCopy,
  onRename,
  onPreview,
}: {
  file: MediaFile;
  onDelete: (file: MediaFile) => void;
  onCopy?: (file: MediaFile, format: CopyFormat) => void;
  onRename: (file: MediaFile) => void;
  onPreview: (file: MediaFile) => void;
}) {
  const [showCopyMenu, setShowCopyMenu] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<CopyFormat | null>(null);
  
  const isImage = file.mimeType.startsWith("image/");
  const isVideo = file.mimeType.startsWith("video/") || file.name.toLowerCase().endsWith(".mov");
  const fileType = file.mimeType.split("/")[1]?.toUpperCase() || "DOSYA";
  const dateStr = new Date(file.createdAt).toLocaleDateString("tr-TR");

  const handleCopy = async (format: CopyFormat) => {
    const content = buildCopyContent(format, file.publicUrl, file.name, file.width, file.height);
    await navigator.clipboard.writeText(content);
    setCopiedFormat(format);
    setShowCopyMenu(false);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="group relative rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] overflow-hidden hover:border-[var(--border-strong)] transition-all flex flex-col h-full">
      {/* Görsel önizleme */}
      <div 
        onClick={() => onPreview(file)}
        className="relative aspect-square bg-[var(--bg-overlay)] cursor-pointer overflow-hidden"
      >
        {isImage ? (
          <Image
            src={file.publicUrl}
            alt={file.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            unoptimized={process.env.NODE_ENV === "development"}
          />
        ) : isVideo ? (
          <div className="w-full h-full relative">
            <video
              src={file.publicUrl}
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
              <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white border border-white/25 shadow-md transition-transform group-hover:scale-110">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="w-10 h-10" style={{ color: "#71717a" }} />
          </div>
        )}

        {/* Hover aksiyon katmanı */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10"
        >
          <button
            onClick={() => onRename(file)}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            title="Yeniden Adlandır"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onPreview(file)}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            title="Önizle ve Detaylar"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(file)}
            className="w-8 h-8 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 flex items-center justify-center text-rose-400 transition-colors cursor-pointer"
            title="Dosyayı Sil"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dosya bilgisi */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <p
            className="text-xs font-semibold truncate mb-1"
            style={{ color: "#ededed" }}
            title={file.name}
          >
            {file.name}
          </p>
          <p className="text-[10px]" style={{ color: "#a1a1aa" }}>
            {formatFileSize(file.size)}
            {file.width && file.height && ` · ${file.width}×${file.height}`}
          </p>
          <p className="text-[9px] mt-1" style={{ color: "#71717a" }}>
            {dateStr} · {fileType}
          </p>
        </div>

        {/* Kopyalama menüsü */}
        <div className="relative mt-2">
          <button
            onClick={() => setShowCopyMenu((v) => !v)}
            className="flex items-center gap-1 text-[10px] font-semibold cursor-pointer transition-colors"
            style={{ color: copiedFormat ? "#34c759" : "#8b5cf6" }}
          >
            {copiedFormat ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copiedFormat ? "Kopyalandı!" : "Kopyala"}
            <ChevronDown className={cn("w-3 h-3 transition-transform", showCopyMenu && "rotate-180")} />
          </button>

          {showCopyMenu && (
            <div className="absolute bottom-full left-0 mb-1 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg shadow-[var(--shadow-md)] z-20 py-1 min-w-[160px]">
              {(Object.entries(COPY_FORMAT_LABELS) as [CopyFormat, string][]).map(
                ([format, label]) => (
                  <button
                    key={format}
                    onClick={() => handleCopy(format)}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-[var(--bg-overlay)] cursor-pointer transition-colors"
                    style={{ color: "#d4d4d8" }}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dosya Satırı — Liste Görünümü
// ---------------------------------------------------------------------------

function FileRowList({
  file,
  onDelete,
  onCopy,
  onRename,
  onPreview,
}: {
  file: MediaFile;
  onDelete: (file: MediaFile) => void;
  onCopy: (file: MediaFile, format: CopyFormat) => void;
  onRename: (file: MediaFile) => void;
  onPreview: (file: MediaFile) => void;
}) {
  const [copiedFormat, setCopiedFormat] = useState<CopyFormat | null>(null);
  
  const isImage = file.mimeType.startsWith("image/");
  const isVideo = file.mimeType.startsWith("video/") || file.name.toLowerCase().endsWith(".mov");
  const fileType = file.mimeType.split("/")[1]?.toUpperCase() || "DOSYA";

  const handleCopy = async (format: CopyFormat) => {
    const content = buildCopyContent(format, file.publicUrl, file.name, file.width, file.height);
    await navigator.clipboard.writeText(content);
    setCopiedFormat(format);
    onCopy(file, format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div 
      onClick={() => onPreview(file)}
      className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] cursor-pointer transition-all group select-none"
    >
      {/* Küçük önizleme */}
      <div className="w-10 h-10 rounded-lg bg-[var(--bg-overlay)] flex-shrink-0 relative overflow-hidden">
        {isImage ? (
          <Image
            src={file.publicUrl}
            alt={file.name}
            fill
            sizes="40px"
            className="object-cover"
            loading="lazy"
            unoptimized={process.env.NODE_ENV === "development"}
          />
        ) : isVideo ? (
          <div className="w-full h-full relative">
            <video
              src={file.publicUrl}
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Play className="w-4 h-4 fill-current text-white" />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="w-4 h-4" style={{ color: "#71717a" }} />
          </div>
        )}
      </div>

      {/* Dosya adı */}
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-semibold truncate"
          style={{ color: "#ededed" }}
          title={file.name}
        >
          {file.name}
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: "#a1a1aa" }}>
          {formatFileSize(file.size)}
          {file.width && file.height && ` · ${file.width}×${file.height}px`}
          {" · "}
          {fileType}
          {" · "}
          {new Date(file.createdAt).toLocaleDateString("tr-TR")}
        </p>
      </div>

      {/* Aksiyon butonları */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <button
          onClick={() => handleCopy("url")}
          className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded cursor-pointer transition-colors"
          style={{ color: copiedFormat === "url" ? "#34c759" : "#8b5cf6" }}
          title="URL Kopyala"
        >
          {copiedFormat === "url" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copiedFormat === "url" ? "Kopyalandı" : "URL"}
        </button>
        <button
          onClick={() => handleCopy("markdown")}
          className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded cursor-pointer transition-colors"
          style={{ color: copiedFormat === "markdown" ? "#34c759" : "#a1a1aa" }}
          title="Markdown Kopyala"
        >
          {copiedFormat === "markdown" ? <Check className="w-3 h-3" /> : null}
          MD
        </button>
        <button
          onClick={() => handleCopy("html")}
          className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded cursor-pointer transition-colors"
          style={{ color: copiedFormat === "html" ? "#34c759" : "#a1a1aa" }}
          title="HTML Kopyala"
        >
          {copiedFormat === "html" ? <Check className="w-3 h-3" /> : null}
          HTML
        </button>
        <button
          onClick={() => handleCopy("nextimage")}
          className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded cursor-pointer transition-colors"
          style={{ color: copiedFormat === "nextimage" ? "#34c759" : "#a1a1aa" }}
          title="Next/Image Kopyala"
        >
          {copiedFormat === "nextimage" ? <Check className="w-3 h-3" /> : null}
          JSX
        </button>
        <button
          onClick={() => onRename(file)}
          className="w-7 h-7 rounded flex items-center justify-center transition-colors cursor-pointer hover:bg-white/5"
          style={{ color: "#a1a1aa" }}
          title="Yeniden Adlandır"
        >
          <Pencil className="w-3 h-3" />
        </button>
        <button
          onClick={() => onDelete(file)}
          className="w-7 h-7 rounded flex items-center justify-center text-rose-400 transition-colors cursor-pointer hover:bg-rose-500/10"
          title="Dosyayı Sil"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Yeniden Adlandırma Modalı
// ---------------------------------------------------------------------------

function RenameModal({
  file,
  onConfirm,
  onCancel,
}: {
  file: MediaFile;
  onConfirm: (newName: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(file.name);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-xl)] p-6 max-w-sm w-full mx-4 shadow-[var(--shadow-lg)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold" style={{ color: "#ededed" }}>
            Yeniden Adlandır
          </h3>
          <button onClick={onCancel} className="cursor-pointer" style={{ color: "#71717a" }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border-default)] bg-[var(--bg-overlay)] outline-none focus:border-[var(--accent-primary)] transition-colors mb-4"
          style={{ color: "#ededed" }}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) onConfirm(value.trim());
            if (e.key === "Escape") onCancel();
          }}
        />
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-[var(--border-default)] cursor-pointer"
            style={{ color: "#a1a1aa" }}
          >
            İptal
          </button>
          <button
            onClick={() => value.trim() && onConfirm(value.trim())}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white cursor-pointer transition-colors"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Önizleme Modalı (Resim & Video Desteği)
// ---------------------------------------------------------------------------

function PreviewModal({
  file,
  onClose,
}: {
  file: MediaFile;
  onClose: () => void;
}) {
  const isVideo = file.mimeType.startsWith("video/") || file.name.toLowerCase().endsWith(".mov");
  const [copiedFormat, setCopiedFormat] = useState<CopyFormat | null>(null);

  const handleCopy = async (format: CopyFormat) => {
    const content = buildCopyContent(format, file.publicUrl, file.name, file.width, file.height);
    await navigator.clipboard.writeText(content);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const fileType = file.mimeType.split("/")[1]?.toUpperCase() || "DOSYA";

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-xl)] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-[var(--shadow-xl)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)]">
          <div className="min-w-0">
            <h3 className="text-sm font-bold truncate" style={{ color: "#ededed" }}>
              {file.name}
            </h3>
            <p className="text-[11px]" style={{ color: "#a1a1aa" }}>
              {formatFileSize(file.size)} · {fileType} · {file.width && file.height ? `${file.width}×${file.height}px` : "Çözünürlük yok"}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Önizleme İçeriği */}
        <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-black/40 min-h-[300px] relative">
          {isVideo ? (
            <video
              src={file.publicUrl}
              controls
              autoPlay
              className="max-w-full max-h-[50vh] rounded-lg shadow-lg"
              onError={(e) => {
                console.error("Video önizleme hatası:", e);
              }}
            />
          ) : (
            <div className="relative w-full h-[50vh]">
              <Image
                src={file.publicUrl}
                alt={file.name}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          )}
        </div>

        {/* Footer ve Kopyalama Butonları */}
        <div className="p-4 border-t border-[var(--border-default)] bg-[var(--bg-surface)] flex flex-col sm:flex-row gap-3 items-center justify-between">
          <p className="text-[10px]" style={{ color: "#71717a" }}>
            Yükleme Tarihi: {new Date(file.createdAt).toLocaleDateString("tr-TR")}
          </p>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {(Object.entries(COPY_FORMAT_LABELS) as [CopyFormat, string][]).map(([format, label]) => (
              <button
                key={format}
                onClick={() => handleCopy(format)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--border-default)] bg-[var(--bg-overlay)] hover:border-[var(--border-strong)] transition-all flex items-center gap-1.5 cursor-pointer text-left"
                style={{ color: copiedFormat === format ? "#34c759" : "#d4d4d8" }}
              >
                {copiedFormat === format ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ana Bileşen
// ---------------------------------------------------------------------------

export function AdminMediaClient() {
  const [activeBucket, setActiveBucket] = useState<MediaBucket>("gallery");
  const [viewMode, setViewMode] = useState<MediaViewMode>("grid");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);
  const [renameTarget, setRenameTarget] = useState<MediaFile | null>(null);
  const [previewTarget, setPreviewTarget] = useState<MediaFile | null>(null);

  const { data: files = [], isLoading, refetch } = useMediaList(activeBucket);
  const { mutate: deleteFile } = useDeleteFile();
  const { mutate: renameFile } = useRenameFile();

  // Arama filtresi
  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = useCallback(
    (file: MediaFile) => {
      deleteFile(
        { bucket: activeBucket, path: file.path },
        { onSuccess: () => setDeleteTarget(null) }
      );
    },
    [activeBucket, deleteFile]
  );

  const handleRename = useCallback(
    (file: MediaFile, newName: string) => {
      renameFile(
        { bucket: activeBucket, oldPath: file.path, newName },
        { onSuccess: () => setRenameTarget(null) }
      );
    },
    [activeBucket, renameFile]
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Başlık */}
      <div className="flex flex-col gap-1">
        <h1
          className="text-2xl font-extrabold tracking-tight"
          style={{ fontFamily: "var(--font-outfit)", color: "#ededed" }}
        >
          Medya Kütüphanesi
        </h1>
        <p className="text-sm" style={{ color: "#a1a1aa" }}>
          Supabase Storage üzerindeki tüm görseller ve dosyalar buradan yönetilir.
        </p>
      </div>

      {/* Yükleme Bölgesi */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-6">
        <h2 className="text-sm font-bold mb-4" style={{ color: "#d4d4d8" }}>
          Yeni Dosya Yükle —{" "}
          <span style={{ color: "var(--accent-primary)" }}>
            {BUCKET_LABELS[activeBucket]}
          </span>
        </h2>
        <MediaUploadZone bucket={activeBucket} />
      </div>

      {/* Bucket Sekmeleri + Kontroller */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div className="flex gap-1 bg-[var(--bg-overlay)] p-1 rounded-xl border border-[var(--border-default)]">
          {(Object.entries(BUCKET_LABELS) as [MediaBucket, string][]).map(([bucket, label]) => (
            <button
              key={bucket}
              onClick={() => setActiveBucket(bucket)}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer",
                activeBucket === bucket
                  ? "bg-[var(--bg-base)] border border-[var(--border-subtle)] shadow-[var(--shadow-sm)]"
                  : "hover:bg-[var(--bg-base)]/50"
              )}
              style={{ color: activeBucket === bucket ? "#ededed" : "#a1a1aa" }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Arama */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#71717a" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Dosya ara..."
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[var(--border-default)] bg-[var(--bg-overlay)] outline-none focus:border-[var(--accent-primary)] transition-colors w-full sm:w-48"
              style={{ color: "#d4d4d8" }}
            />
          </div>

          {/* Yenile */}
          <button
            onClick={() => refetch()}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-overlay)] cursor-pointer transition-colors hover:border-[var(--border-strong)]"
            title="Yenile"
          >
            <RefreshCw className="w-3.5 h-3.5" style={{ color: "#a1a1aa" }} />
          </button>

          {/* Görünüm Toggle */}
          <div className="flex bg-[var(--bg-overlay)] rounded-lg border border-[var(--border-default)] overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "w-8 h-8 flex items-center justify-center transition-colors cursor-pointer",
                viewMode === "grid" ? "bg-[var(--accent-primary)]/20" : "hover:bg-[var(--bg-base)]"
              )}
              title="Grid Görünümü"
            >
              <Grid className="w-3.5 h-3.5" style={{ color: viewMode === "grid" ? "var(--accent-primary)" : "#a1a1aa" }} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "w-8 h-8 flex items-center justify-center transition-colors cursor-pointer",
                viewMode === "list" ? "bg-[var(--accent-primary)]/20" : "hover:bg-[var(--bg-base)]"
              )}
              title="Liste Görünümü"
            >
              <List className="w-3.5 h-3.5" style={{ color: viewMode === "list" ? "var(--accent-primary)" : "#a1a1aa" }} />
            </button>
          </div>
        </div>
      </div>

      {/* Dosya Sayısı Bilgisi */}
      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: "#71717a" }}>
          {filteredFiles.length} dosya
          {search && ` · "${search}" araması`}
        </span>
      </div>

      {/* Yükleniyor */}
      {isLoading && (
        <div className="flex items-center justify-center py-16 gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" style={{ color: "var(--accent-primary)" }} />
          <span className="text-sm" style={{ color: "#a1a1aa" }}>Yükleniyor...</span>
        </div>
      )}

      {/* Boş durum */}
      {!isLoading && filteredFiles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-[var(--radius-xl)] border border-dashed border-[var(--border-default)]">
          <ImageIcon className="w-10 h-10" style={{ color: "#71717a" }} />
          <p className="text-sm font-medium" style={{ color: "#a1a1aa" }}>
            {search ? `"${search}" aramasına ait dosya bulunamadı.` : "Bu bucket'ta henüz dosya bulunmuyor."}
          </p>
          {!search && (
            <p className="text-xs" style={{ color: "#71717a" }}>
              Yukarıdaki yükleme alanını kullanarak dosya ekleyebilirsiniz.
            </p>
          )}
        </div>
      )}

      {/* Grid Görünümü */}
      {!isLoading && filteredFiles.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredFiles.map((file) => (
            <FileCardGrid
              key={file.path}
              file={file}
              onDelete={setDeleteTarget}
              onCopy={() => {}}
              onRename={setRenameTarget}
              onPreview={setPreviewTarget}
            />
          ))}
        </div>
      )}

      {/* Liste Görünümü */}
      {!isLoading && filteredFiles.length > 0 && viewMode === "list" && (
        <div className="flex flex-col gap-2">
          {filteredFiles.map((file) => (
            <FileRowList
              key={file.path}
              file={file}
              onDelete={setDeleteTarget}
              onCopy={() => {}}
              onRename={setRenameTarget}
              onPreview={setPreviewTarget}
            />
          ))}
        </div>
      )}

      {/* Silme Onay Dialog */}
      {deleteTarget && (
        <ConfirmDialog
          fileName={deleteTarget.name}
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Yeniden Adlandırma Modalı */}
      {renameTarget && (
        <RenameModal
          file={renameTarget}
          onConfirm={(newName) => handleRename(renameTarget, newName)}
          onCancel={() => setRenameTarget(null)}
        />
      )}

      {/* Önizleme Modalı */}
      {previewTarget && (
        <PreviewModal
          file={previewTarget}
          onClose={() => setPreviewTarget(null)}
        />
      )}
    </div>
  );
}
