"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { RefreshCw, Activity, Users, CheckCircle2, AlertCircle, ShieldAlert, Image as ImageIcon, Check, Search, Save } from "lucide-react";
import { useCreatorSyncStatus, useTriggerCreatorSync } from "../hooks/use-admin";
import { useSiteAssets, useUpdateSiteAssets } from "@/features/media/hooks/use-site-assets";
import { useMediaList } from "@/features/media/hooks/use-media";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { MediaBucket } from "@/features/media/types/media-types";

export function AdminSettingsControls() {
  const { data: syncStatus, isLoading: isSyncLoading, isError: isSyncError } = useCreatorSyncStatus();
  const { mutate: triggerSync, isPending: isSyncing } = useTriggerCreatorSync();
  const { data: siteAssets, isLoading: isAssetsLoading } = useSiteAssets();
  const updateAssetsMutation = useUpdateSiteAssets();

  const [prevAssets, setPrevAssets] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [whiteLogoUrl, setWhiteLogoUrl] = useState("");
  const [darkLogoUrl, setDarkLogoUrl] = useState("");
  const [offlineCoverUrl, setOfflineCoverUrl] = useState("");
  const [defaultThumbnailUrl, setDefaultThumbnailUrl] = useState("");
  const [illustration404Url, setIllustration404Url] = useState("");

  if (siteAssets && siteAssets !== prevAssets) {
    setPrevAssets(siteAssets);
    setAvatarUrl(siteAssets.avatarUrl || "");
    setWhiteLogoUrl(siteAssets.whiteLogoUrl || "");
    setDarkLogoUrl(siteAssets.darkLogoUrl || "");
    setOfflineCoverUrl(siteAssets.offlineCoverUrl || "");
    setDefaultThumbnailUrl(siteAssets.defaultThumbnailUrl || "");
    setIllustration404Url(siteAssets.illustration404Url || "");
  }

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<string | null>(null);
  const [pickerBucket, setPickerBucket] = useState<MediaBucket>("gallery");
  const { data: mediaFiles } = useMediaList(pickerBucket);
  const [mediaSearch, setMediaSearch] = useState("");

  if (isSyncLoading || isAssetsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <RefreshCw className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
        <span className="text-sm font-semibold text-[var(--text-secondary)]">Ayarlar yükleniyor...</span>
      </div>
    );
  }

  if (isSyncError || !syncStatus) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <AlertCircle className="w-8 h-8 text-rose-500" />
        <span className="text-sm font-semibold text-[var(--text-secondary)]">Ayarlar yüklenirken hata oluştu.</span>
      </div>
    );
  }

  const handleSaveAssets = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAssetsMutation.mutateAsync({
        avatarUrl: avatarUrl.trim() || null,
        whiteLogoUrl: whiteLogoUrl.trim() || null,
        darkLogoUrl: darkLogoUrl.trim() || null,
        offlineCoverUrl: offlineCoverUrl.trim() || null,
        defaultThumbnailUrl: defaultThumbnailUrl.trim() || null,
        illustration404Url: illustration404Url.trim() || null,
      });
      alert("Site varlıkları başarıyla güncellendi.");
    } catch (err) {
      console.error(err);
      alert("Site varlıkları güncellenirken hata oluştu.");
    }
  };

  const handleSelectMedia = (url: string) => {
    if (pickerTarget === "avatarUrl") setAvatarUrl(url);
    if (pickerTarget === "whiteLogoUrl") setWhiteLogoUrl(url);
    if (pickerTarget === "darkLogoUrl") setDarkLogoUrl(url);
    if (pickerTarget === "offlineCoverUrl") setOfflineCoverUrl(url);
    if (pickerTarget === "defaultThumbnailUrl") setDefaultThumbnailUrl(url);
    if (pickerTarget === "illustration404Url") setIllustration404Url(url);
    setIsMediaPickerOpen(false);
    setPickerTarget(null);
  };

  const filteredMedia = (mediaFiles ?? []).filter((f) =>
    f.name.toLowerCase().includes(mediaSearch.toLowerCase())
  );

  const assetFields = [
    { key: "avatarUrl", label: "Yayıncı Avatarı (Avatar)", val: avatarUrl, set: setAvatarUrl },
    { key: "whiteLogoUrl", label: "Beyaz Logo (Light Theme/Navbar)", val: whiteLogoUrl, set: setWhiteLogoUrl },
    { key: "darkLogoUrl", label: "Koyu Logo (Dark Theme/Navbar)", val: darkLogoUrl, set: setDarkLogoUrl },
    { key: "offlineCoverUrl", label: "Çevrimdışı Kapak Görseli (Offline Cover)", val: offlineCoverUrl, set: setOfflineCoverUrl },
    { key: "defaultThumbnailUrl", label: "Varsayılan Yayın Görseli (Default Thumbnail)", val: defaultThumbnailUrl, set: setDefaultThumbnailUrl },
    { key: "illustration404Url", label: "404 Sayfa İllüstrasyonu (404 Illustration)", val: illustration404Url, set: setIllustration404Url },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      <GlassCard className="p-6 border border-[var(--border-default)] bg-[rgba(10,10,10,0.45)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Badge className="border-none text-white text-[10px] font-bold px-2 py-0.5 bg-[var(--accent-primary)]">
              SİSTEM AYARLARI
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
            Ayarlar
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Veritabanı senkronizasyon motorunu yönetin ve site genelindeki marka varlıklarını özelleştirin.
          </p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <GlassCard className="lg:col-span-8 p-6 border border-[var(--border-default)] flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className={cn("w-5 h-5 text-[var(--accent-primary)]", isSyncing && "animate-spin")} />
              <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Kick Senkronizasyon Ayarları
              </h2>
            </div>
            <Badge className={cn(
              "border-none text-white text-[10px] font-bold px-2 py-0.5 rounded-full",
              isSyncing ? "bg-amber-500 animate-pulse" :
              syncStatus.status === "success" ? "bg-emerald-500" :
              syncStatus.status === "failed" ? "bg-[var(--live-red)]" : "bg-zinc-700"
            )}>
              {isSyncing ? "EŞİTLENİYOR..." :
               syncStatus.status === "success" ? "BAŞARILI" :
               syncStatus.status === "failed" ? "HATA" : "BOŞTA"}
            </Badge>
          </div>

          <div className="flex flex-col gap-3.5 font-mono text-[11px] text-[var(--text-secondary)]">
            <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2.5">
              <span className="text-[var(--text-tertiary)] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-zinc-500" /> Platform
              </span>
              <span className="font-bold text-[var(--text-primary)] capitalize">
                {syncStatus.provider || "kick"}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2.5">
              <span className="text-[var(--text-tertiary)] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-zinc-500" /> Kanal İsmi (Slug)
              </span>
              <span className="font-bold text-zinc-400">
                @{syncStatus.channel || "zehragn"}
              </span>
            </div>

            <div className="flex flex-col gap-1 border-b border-[var(--border-subtle)] pb-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-tertiary)] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Son Başarılı Eşitleme
                </span>
                <span className="text-[10px] text-[var(--text-primary)]">
                  {syncStatus.last_success_at
                    ? new Date(syncStatus.last_success_at).toLocaleTimeString()
                    : "Hiçbir zaman"}
                </span>
              </div>
              {syncStatus.last_success_at && (
                <span className="text-[9px] text-[var(--text-tertiary)] text-right">
                  {new Date(syncStatus.last_success_at).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1 border-b border-[var(--border-subtle)] pb-1">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-tertiary)] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500" /> Son Başarısız Eşitleme
                </span>
                <span className="text-[10px] text-[var(--text-primary)]">
                  {syncStatus.last_failed_at
                    ? new Date(syncStatus.last_failed_at).toLocaleTimeString()
                    : "Yok"}
                </span>
              </div>
              {syncStatus.last_failed_at && (
                <span className="text-[9px] text-[var(--text-tertiary)] text-right">
                  {new Date(syncStatus.last_failed_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {syncStatus.error && (
            <div className="p-2.5 rounded-lg border border-red-500/20 bg-red-500/5 text-[10px] text-red-400 font-mono break-all max-h-[80px] overflow-y-auto">
              Hata Mesajı: {syncStatus.error}
            </div>
          )}

          <Button
            onClick={() => triggerSync()}
            disabled={isSyncing}
            className="w-full h-9 bg-gradient-to-r from-[var(--accent-primary)] to-indigo-600 hover:from-[var(--accent-primary)]/90 hover:to-indigo-600/90 text-white font-bold text-[10px] tracking-wider uppercase rounded-lg shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Senkronize ediliyor...
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                Şimdi Eşitle
              </>
            )}
          </Button>
        </GlassCard>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <GlassCard className="p-5 border border-[var(--border-default)] bg-[rgba(10,10,10,0.25)] relative overflow-hidden flex flex-col gap-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_90%,rgba(168,85,247,0.05),transparent_60%)] pointer-events-none" />
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wide">
                Senkronizasyon Motoru Bilgileri
              </h4>
              <ul className="text-[10px] text-[var(--text-secondary)] leading-relaxed list-disc pl-4 flex flex-col gap-1.5">
                <li>
                  <strong className="text-[var(--text-primary)]">Takipçi Sayısı:</strong> Kick API takipçi sayısını doğrudan sunmadığından bu değer senkronize edilemez.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Abone Sayısı:</strong> Kick API üzerinden gerçek zamanlı aktif aboneler çekilir.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Yayın Geçmişi:</strong> Canlı durumdan çevrimdışı duruma geçişler sistem tarafından tespit edilerek otomatik kayıt oluşturulur.
                </li>
              </ul>
            </div>
          </GlassCard>
        </div>
      </div>

      <GlassCard className="p-6 border border-[var(--border-default)] bg-[rgba(10,10,10,0.45)] rounded-2xl flex flex-col gap-6 shadow-[var(--shadow-sm)]">
        <div>
          <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
            Site Görsel ve Marka Varlıkları Yönetimi (Site Assets)
          </h2>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1">
            Site genelinde kullanılan tüm logoları, kapakları, avatarı ve boş durum illüstrasyonlarını güncelleyin.
          </p>
        </div>

        <form onSubmit={handleSaveAssets} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assetFields.map((field) => (
              <div key={field.key} className="flex flex-col gap-2 p-4 rounded-xl border border-[var(--border-subtle)] bg-[rgba(10,10,10,0.15)] justify-between">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[var(--text-primary)]">{field.label}</label>
                  <div className="flex gap-2 mt-1.5">
                    <Input
                      value={field.val}
                      onChange={(e) => field.set(e.target.value)}
                      placeholder="Medya kütüphanesinden seçin..."
                      className="h-9 text-xs flex-1 bg-[var(--bg-base)] border-[var(--border-default)]"
                      disabled
                    />
                    <Button
                      type="button"
                      onClick={() => { setPickerTarget(field.key); setIsMediaPickerOpen(true); }}
                      className="h-9 px-3 text-xs bg-zinc-800 border-none hover:bg-zinc-700 text-white cursor-pointer"
                    >
                      Seç
                    </Button>
                    {field.val && (
                      <Button
                        type="button"
                        onClick={() => field.set("")}
                        className="h-9 px-3 text-xs bg-rose-950 border border-rose-900/50 hover:bg-rose-900 text-rose-300 cursor-pointer"
                      >
                        Temizle
                      </Button>
                    )}
                  </div>
                </div>

                {field.val && (
                  <div className="relative w-full h-24 mt-3 rounded-lg overflow-hidden border border-[var(--border-default)] bg-black">
                    <Image
                      src={field.val}
                      alt={field.label}
                      fill
                      className="object-contain"
                      unoptimized={process.env.NODE_ENV === "development"}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button
            type="submit"
            disabled={updateAssetsMutation.isPending}
            className="h-10 px-5 text-xs bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white border-none cursor-pointer self-end flex items-center gap-2 font-bold uppercase tracking-wider rounded-lg shadow-lg"
          >
            {updateAssetsMutation.isPending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Ayarları Kaydet
              </>
            )}
          </Button>
        </form>
      </GlassCard>

      {isMediaPickerOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GlassCard className="w-full max-w-2xl border border-[var(--border-default)] rounded-xl p-6 bg-[rgba(10,10,10,0.98)] max-h-[85vh] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
                Medya Kütüphanesinden Dosya Seç
              </h3>
              <button onClick={() => { setIsMediaPickerOpen(false); setPickerTarget(null); }} className="text-zinc-400 hover:text-zinc-200 text-xs font-semibold cursor-pointer">Kapat</button>
            </div>

            <div className="flex gap-2 p-0.5 bg-[var(--bg-overlay)] border border-[var(--border-default)] rounded-lg self-start">
              {(["gallery", "thumbnails", "avatars"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setPickerBucket(b)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors cursor-pointer ${pickerBucket === b ? "bg-[var(--accent-primary)] text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
                >
                  {b === "gallery" ? "Galeri" : b === "thumbnails" ? "Küçük Resimler" : "Avatarlar"}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
              <Input
                value={mediaSearch}
                onChange={(e) => setMediaSearch(e.target.value)}
                placeholder="Dosya adına göre ara..."
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 gap-4 p-1 min-h-[250px]">
              {filteredMedia.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center text-zinc-500 text-xs py-8">
                  Dosya bulunamadı.
                </div>
              ) : (
                filteredMedia.map((file) => (
                  <div
                    key={file.path}
                    onClick={() => handleSelectMedia(file.publicUrl)}
                    className="group relative aspect-video bg-zinc-950 border border-[var(--border-default)] hover:border-[var(--accent-primary)] rounded-lg overflow-hidden cursor-pointer transition-all flex items-center justify-center"
                  >
                    <Image
                      src={file.publicUrl}
                      alt={file.name}
                      fill
                      className="object-cover"
                      unoptimized={process.env.NODE_ENV === "development"}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
