"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Save, Sliders, ShieldAlert, Loader2, AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useSiteSettings, useUpdateSiteSetting, useCreatorSyncStatus, useTriggerCreatorSync } from "../hooks/use-admin";

export function AdminSettingsControls() {
  const { data: settings = {}, isLoading: settingsLoading, refetch } = useSiteSettings();
  const updateSettingMutation = useUpdateSiteSetting();

  const { data: syncStatus, isLoading: syncLoading } = useCreatorSyncStatus();
  const { mutate: triggerSync, isPending: isSyncing } = useTriggerCreatorSync();

  // Active settings tab
  const [activeTab, setActiveTab] = useState<"general" | "hero" | "seo" | "social" | "sync">("general");

  // General Settings state
  const [streamerName, setStreamerName] = useState("");
  const [copyrightText, setCopyrightText] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  // Hero Settings state
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroCtaText, setHeroCtaText] = useState("");

  // SEO Settings state
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  // Social Settings state
  const [kickUrl, setKickUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [discordUrl, setDiscordUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");

  // Sync state variables are already fetched from useCreatorSyncStatus hook!

  useEffect(() => {
    if (settings) {
      // General
      const site = settings.site || {};
      setStreamerName(site.streamerName || "Zehra");
      setCopyrightText(site.copyrightText || "© 2026 Zehra. Tüm Hakları Saklıdır.");
      setContactEmail(site.contactEmail || "zehra@gmail.com");

      // Hero
      const hero = settings.hero || {};
      setHeroTitle(hero.title || "Donanımlı ve Kaliteli Yayın Deneyimi");
      setHeroSubtitle(hero.subtitle || "Türkiye'nin en aktif topluluklarından biri ile her gün canlı yayınlarda buluşuyoruz.");
      setHeroCtaText(hero.ctaText || "Yayınları İzle");

      // SEO
      const seo = settings.seo || {};
      setSeoTitle(seo.title || "Zehra - Streamer Hub");
      setSeoDescription(seo.description || "Zehra'ın resmî web portalı ve yayın arşivi.");
      setSeoKeywords(seo.keywords || "Zehra, Kick, yayın, donanım, setup, topluluk");

      // Social
      const social = settings.social || {};
      setKickUrl(social.kick || "https://kick.com/zehragn");
      setYoutubeUrl(social.youtube || "https://youtube.com");
      setTwitterUrl(social.twitter || "https://x.com");
      setDiscordUrl(social.discord || "https://discord.gg");
      setInstagramUrl(social.instagram || "https://instagram.com");
    }
  }, [settings]);

  const handleSave = async (key: string, value: any) => {
    try {
      await updateSettingMutation.mutateAsync({ key, value });
      alert("Ayarlar başarıyla güncellendi.");
      refetch();
    } catch (err) {
      console.error(err);
      alert("Ayarlar kaydedilirken hata oluştu.");
    }
  };

  const saveGeneral = () => {
    handleSave("site", { streamerName, copyrightText, contactEmail });
  };

  const saveHero = () => {
    handleSave("hero", { title: heroTitle, subtitle: heroSubtitle, ctaText: heroCtaText });
  };

  const saveSeo = () => {
    handleSave("seo", { title: seoTitle, description: seoDescription, keywords: seoKeywords });
  };

  const saveSocial = () => {
    handleSave("social", {
      kick: kickUrl,
      youtube: youtubeUrl,
      twitter: twitterUrl,
      discord: discordUrl,
      instagram: instagramUrl,
    });
  };

  if (settingsLoading || syncLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <GlassCard className="p-6 border border-[var(--border-default)] bg-[rgba(10,10,10,0.45)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
            Site Ayarları
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Site başlıklarını, sosyal medya adreslerini, SEO etiketlerini ve arka plan senkronizasyon motorunu yönetin.
          </p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Menu/Sidebar */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("general")}
            className={cn(
              "text-left px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer",
              activeTab === "general"
                ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-overlay)]"
            )}
          >
            Genel Ayarlar
          </button>
          <button
            onClick={() => setActiveTab("hero")}
            className={cn(
              "text-left px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer",
              activeTab === "hero"
                ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-overlay)]"
            )}
          >
            Hero Bölümü
          </button>
          <button
            onClick={() => setActiveTab("seo")}
            className={cn(
              "text-left px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer",
              activeTab === "seo"
                ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-overlay)]"
            )}
          >
            SEO & Meta
          </button>
          <button
            onClick={() => setActiveTab("social")}
            className={cn(
              "text-left px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer",
              activeTab === "social"
                ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-overlay)]"
            )}
          >
            Sosyal Medya Linkleri
          </button>
          <button
            onClick={() => setActiveTab("sync")}
            className={cn(
              "text-left px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer",
              activeTab === "sync"
                ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-overlay)]"
            )}
          >
            Senkronizasyon Motoru
          </button>
        </div>

        {/* Content Pane */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          {activeTab === "general" && (
            <GlassCard className="p-6 border border-[var(--border-default)] flex flex-col gap-4">
              <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Genel Ayarlar</h2>
              <Input
                label="Yayıncı / Marka İsmi"
                value={streamerName}
                onChange={(e) => setStreamerName(e.target.value)}
                className="text-xs"
              />
              <Input
                label="İletişim E-posta Adresi"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="text-xs"
              />
              <Textarea
                label="Footer Alt Telif Metni"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                className="text-xs min-h-[60px] resize-none"
              />
              <Button
                onClick={saveGeneral}
                className="h-9 px-4 text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] border-none flex items-center gap-1.5 cursor-pointer w-fit mt-2"
              >
                <Save className="w-3.5 h-3.5" />
                Ayarları Kaydet
              </Button>
            </GlassCard>
          )}

          {activeTab === "hero" && (
            <GlassCard className="p-6 border border-[var(--border-default)] flex flex-col gap-4">
              <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Hero Giriş Bölümü Ayarları</h2>
              <Input
                label="Ana Başlık (Title)"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="text-xs"
              />
              <Textarea
                label="Alt Başlık / Slogan (Subtitle)"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="text-xs min-h-[80px] resize-none"
              />
              <Input
                label="CTA Buton Metni"
                value={heroCtaText}
                onChange={(e) => setHeroCtaText(e.target.value)}
                className="text-xs"
              />
              <Button
                onClick={saveHero}
                className="h-9 px-4 text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] border-none flex items-center gap-1.5 cursor-pointer w-fit mt-2"
              >
                <Save className="w-3.5 h-3.5" />
                Hero Ayarlarını Kaydet
              </Button>
            </GlassCard>
          )}

          {activeTab === "seo" && (
            <GlassCard className="p-6 border border-[var(--border-default)] flex flex-col gap-4">
              <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">SEO & Meta Arama Motoru Ayarları</h2>
              <Input
                label="Varsayılan Sayfa Başlığı (Title Tag)"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="text-xs"
              />
              <Textarea
                label="Meta Açıklaması (Meta Description)"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="text-xs min-h-[80px] resize-none"
              />
              <Input
                label="Anahtar Kelimeler (Keywords - virgülle ayrılmış)"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                className="text-xs"
              />
              <Button
                onClick={saveSeo}
                className="h-9 px-4 text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] border-none flex items-center gap-1.5 cursor-pointer w-fit mt-2"
              >
                <Save className="w-3.5 h-3.5" />
                SEO Ayarlarını Kaydet
              </Button>
            </GlassCard>
          )}

          {activeTab === "social" && (
            <GlassCard className="p-6 border border-[var(--border-default)] flex flex-col gap-4">
              <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Sosyal Medya Adresleri</h2>
              <Input
                label="Kick Kanal Linki"
                value={kickUrl}
                onChange={(e) => setKickUrl(e.target.value)}
                className="text-xs"
              />
              <Input
                label="YouTube Kanal Linki"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="text-xs"
              />
              <Input
                label="Twitter / X Profili"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                className="text-xs"
              />
              <Input
                label="Discord Sunucu Daveti"
                value={discordUrl}
                onChange={(e) => setDiscordUrl(e.target.value)}
                className="text-xs"
              />
              <Input
                label="Instagram Profili"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="text-xs"
              />
              <Button
                onClick={saveSocial}
                className="h-9 px-4 text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] border-none flex items-center gap-1.5 cursor-pointer w-fit mt-2"
              >
                <Save className="w-3.5 h-3.5" />
                Linkleri Kaydet
              </Button>
            </GlassCard>
          )}

          {activeTab === "sync" && (
            <GlassCard className="p-6 border border-[var(--border-default)] flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RefreshCw className={cn("w-5 h-5 text-[var(--accent-primary)]", isSyncing && "animate-spin")} />
                  <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    Kick Senkronizasyon Ayarları
                  </h2>
                </div>
                {syncStatus && (
                  <Badge className={cn(
                    "border-none text-white text-[10px] font-bold px-2 py-0.5 rounded-full",
                    isSyncing ? "bg-amber-500 animate-pulse" :
                      syncStatus.status === "success" ? "bg-emerald-500" :
                        syncStatus.status === "failed" ? "bg-rose-500" : "bg-zinc-700"
                  )}>
                    {isSyncing ? "Senkronize Ediliyor" :
                      syncStatus.status === "success" ? "Aktif / Başarılı" :
                        syncStatus.status === "failed" ? "Hata Oluştu" : "Boşta"}
                  </Badge>
                )}
              </div>

              {syncStatus ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex flex-col gap-1 p-3 bg-zinc-950/20 border border-[var(--border-subtle)] rounded-lg">
                    <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Senkronize Edilen Kanal</span>
                    <span className="font-mono font-bold text-[var(--text-primary)]">@{syncStatus.channel}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-3 bg-zinc-950/20 border border-[var(--border-subtle)] rounded-lg">
                    <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Sağlayıcı</span>
                    <span className="font-mono font-bold text-[var(--text-primary)] uppercase">{syncStatus.provider}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-3 bg-zinc-950/20 border border-[var(--border-subtle)] rounded-lg">
                    <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Son Başarılı Senkronizasyon</span>
                    <span className="font-mono font-bold text-[var(--text-primary)]">
                      {syncStatus.last_success_at ? new Date(syncStatus.last_success_at).toLocaleString("tr-TR") : "Senkronizasyon yapılmadı"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 p-3 bg-zinc-950/20 border border-[var(--border-subtle)] rounded-lg">
                    <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Toplam Güncellenen Sütun / Tablo</span>
                    <span className="font-mono font-bold text-[var(--text-primary)]">
                      {syncStatus.updated_records} kayıt ({syncStatus.updated_tables} tablo)
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                  <p className="text-xs text-rose-300 leading-relaxed">
                    Kick Sync status veritabanında henüz tanımlanmamış. Edge Function ilk çalıştığında bu durum otomatik kaydedilir.
                  </p>
                </div>
              )}

              <div className="border-t border-[var(--border-subtle)] pt-4 flex flex-col gap-3">
                <span className="text-[10px] text-[var(--text-tertiary)] leading-relaxed">
                  Kick Sync Edge Function'ı normal şartlarda web-hook entegrasyonu ile Kick canlı yayın sinyalleri doğrultusunda arka planda çalışır. Dilerseniz hemen şimdi manuel olarak tetikleyebilirsiniz:
                </span>
                <Button
                  onClick={() => triggerSync()}
                  disabled={isSyncing}
                  className="h-9 px-4 text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] border-none flex items-center gap-1.5 cursor-pointer w-fit disabled:opacity-50"
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Senkronizasyon Başlatılıyor...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      Şimdi Senkronize Et (Manuel)
                    </>
                  )}
                </Button>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
