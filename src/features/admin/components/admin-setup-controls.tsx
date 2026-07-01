"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff, Check, X, Upload, Loader2, Star, Sparkles, Package } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { getStorageUrl } from "@/lib/supabase/storage";
import { cn } from "@/lib/utils";
import {
  useAdminSetupItems,
  useCreateSetupItem,
  useUpdateSetupItem,
  useDeleteSetupItem,
} from "../hooks/use-admin";

interface SpecPair {
  key: string;
  value: string;
}

export function AdminSetupControls() {
  const { data: items = [], isLoading } = useAdminSetupItems();
  const createMutation = useCreateSetupItem();
  const updateMutation = useUpdateSetupItem();
  const deleteMutation = useDeleteSetupItem();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  
  // Form fields
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("pc");
  const [description, setDescription] = useState("");
  const [purchaseUrl, setPurchaseUrl] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("TRY");
  const [availability, setAvailability] = useState("stokta");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [storagePath, setStoragePath] = useState("");
  const [specPairs, setSpecPairs] = useState<SpecPair[]>([{ key: "", value: "" }]);

  // Uploading state
  const [uploading, setUploading] = useState(false);

  const handleOpenNew = () => {
    setEditingItem(null);
    setTitle("");
    setBrand("");
    setCategory("pc");
    setDescription("");
    setPurchaseUrl("");
    setAffiliateUrl("");
    setPrice("");
    setCurrency("TRY");
    setAvailability("stokta");
    setIsFeatured(false);
    setIsVisible(true);
    setStoragePath("");
    setSpecPairs([{ key: "", value: "" }]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setTitle(item.title || "");
    setBrand(item.brand || "");
    setCategory(item.category || "pc");
    setDescription(item.description || "");
    setPurchaseUrl(item.purchase_url || "");
    setAffiliateUrl(item.affiliate_url || "");
    setPrice(item.price ? item.price.toString() : "");
    setCurrency(item.currency || "TRY");
    setAvailability(item.availability || "stokta");
    setIsFeatured(item.is_featured || false);
    setIsVisible(item.is_visible || false);
    setStoragePath(item.storage_path || "");

    // specs
    const specs = item.specifications && typeof item.specifications === "object"
      ? Object.entries(item.specifications).map(([key, val]) => ({ key, value: String(val) }))
      : [];
    setSpecPairs(specs.length > 0 ? specs : [{ key: "", value: "" }]);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const supabase = createClient();
    try {
      const ext = file.name.split(".").pop() || "webp";
      const path = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
      
      const { error } = await supabase.storage
        .from("setup")
        .upload(path, file, { contentType: file.type });

      if (error) throw error;
      setStoragePath(`setup/${path}`);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Resim yüklenirken hata oluştu.");
    } finally {
      setUploading(false);
    }
  };

  const handleAddSpec = () => {
    setSpecPairs((prev) => [...prev, { key: "", value: "" }]);
  };

  const handleRemoveSpec = (idx: number) => {
    setSpecPairs((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSpecChange = (idx: number, field: "key" | "value", val: string) => {
    setSpecPairs((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Map specPairs to object
    const specifications: Record<string, string> = {};
    specPairs.forEach((pair) => {
      if (pair.key.trim() && pair.value.trim()) {
        specifications[pair.key.trim()] = pair.value.trim();
      }
    });

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const payload = {
      title,
      brand,
      category,
      description,
      purchase_url: purchaseUrl || null,
      affiliate_url: affiliateUrl || null,
      price: price ? parseFloat(price) : null,
      currency,
      availability,
      is_featured: isFeatured,
      is_visible: isVisible,
      storage_path: storagePath || null,
      specifications,
      slug,
    };

    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, item: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("İşlem gerçekleştirilemedi.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <GlassCard className="p-6 border border-[var(--border-default)] bg-[rgba(10,10,10,0.45)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
            Setup Ekipman Yönetimi
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Setup sayfasında sergilenecek PC donanımları, çevre birimleri, ses ve konfor ekipmanlarını yönetin.
          </p>
        </div>
        <Button
          onClick={handleOpenNew}
          className="h-9 px-4 text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] border-none flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Yeni Ürün Ekle
        </Button>
      </GlassCard>

      {/* Grid Table items */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <GlassCard className="p-12 text-center text-xs text-[var(--text-tertiary)] border border-dashed border-[var(--border-default)] rounded-xl">
          Donanım veya ekipman kaydı bulunmamaktadır.
        </GlassCard>
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/50 text-[10px] uppercase font-bold tracking-wider text-[var(--text-tertiary)]">
                <th className="py-4 px-6">Görsel</th>
                <th className="py-4 px-6">Ürün Adı</th>
                <th className="py-4 px-6">Marka</th>
                <th className="py-4 px-6">Kategori</th>
                <th className="py-4 px-6">Stok Durumu</th>
                <th className="py-4 px-6 text-center">Öne Çıkar</th>
                <th className="py-4 px-6 text-center">Görünür</th>
                <th className="py-4 px-6 text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] text-sm text-[var(--text-secondary)]">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--bg-elevated)]/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="w-12 h-12 relative rounded bg-black/40 overflow-hidden border border-[var(--border-subtle)]">
                      {item.storage_path ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getStorageUrl(item.storage_path)}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--text-tertiary)]">
                          <Plus className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold text-[var(--text-primary)]">
                    {item.title}
                  </td>
                  <td className="py-4 px-6">{item.brand}</td>
                  <td className="py-4 px-6">
                    <Badge variant="outline" className="border-zinc-800 text-[10px]">
                      {item.category}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded font-bold capitalize",
                      item.availability === "stokta" ? "text-emerald-400" :
                      item.availability === "stokta_yok" ? "text-rose-400" :
                      "text-amber-400"
                    )}>
                      {item.availability === "stokta" ? "Stokta" :
                       item.availability === "stokta_yok" ? "Stokta Yok" : "Yakında"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {item.is_featured ? (
                      <Check className="w-4.5 h-4.5 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4.5 h-4.5 text-zinc-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {item.is_visible ? (
                      <Eye className="w-4.5 h-4.5 text-emerald-400 mx-auto" />
                    ) : (
                      <EyeOff className="w-4.5 h-4.5 text-rose-400 mx-auto" />
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                        title="Düzenle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Editor Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4 max-h-[75vh] overflow-y-auto px-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Ürün Başlığı"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-xs"
            />
            <Input
              label="Marka"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] py-2 px-3 text-xs text-[var(--text-primary)] focus:border-[var(--violet)] focus:outline-none"
              >
                <option value="pc">PC Donanım</option>
                <option value="peripherals">Ekipmanlar</option>
                <option value="audio">Ses & Yayın</option>
                <option value="comfort">Konfor</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">Stok Durumu</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] py-2 px-3 text-xs text-[var(--text-primary)] focus:border-[var(--violet)] focus:outline-none"
              >
                <option value="stokta">Stokta</option>
                <option value="stokta_yok">Stokta Yok</option>
                <option value="yakinda">Yakında</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">Para Birimi</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] py-2 px-3 text-xs text-[var(--text-primary)] focus:border-[var(--violet)] focus:outline-none"
              >
                <option value="TRY">TRY (₺)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Fiyat (Opsiyonel)"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="text-xs col-span-1"
            />
            <Input
              label="Satın Alma Bağlantısı"
              value={purchaseUrl}
              onChange={(e) => setPurchaseUrl(e.target.value)}
              className="text-xs col-span-1"
            />
            <Input
              label="Affiliate (Ortaklık) Bağlantısı"
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
              className="text-xs col-span-1"
            />
          </div>

          <Textarea
            label="Ürün Açıklaması"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[70px] text-xs resize-none"
          />

          {/* Image Upload Area */}
          <div className="flex flex-col gap-2 p-4 bg-zinc-950/20 border border-[var(--border-subtle)] rounded-xl">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Ürün Görseli</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded bg-black/40 border border-[var(--border-subtle)] flex items-center justify-center overflow-hidden shrink-0">
                {storagePath ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getStorageUrl(storagePath)}
                    alt="Upload preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-6 h-6 text-zinc-600" />
                )}
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  id="image-upload-input"
                  className="hidden"
                  disabled={uploading}
                />
                <label
                  htmlFor="image-upload-input"
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-[var(--border-default)] px-4 text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer w-fit gap-1.5"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Yükleniyor...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      Görsel Yükle (WebP tercih edilir)
                    </>
                  )}
                </label>
                <span className="text-[9px] text-[var(--text-tertiary)]">
                  Yüklendiğinde, setup/ klasörüne kaydedilir.
                </span>
              </div>
            </div>
          </div>

          {/* Specifications key-value editor */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Ürün Özellikleri (Specs)</label>
              <button
                type="button"
                onClick={handleAddSpec}
                className="text-[10px] text-[var(--violet-light)] font-bold hover:underline cursor-pointer flex items-center gap-0.5"
              >
                + Özellik Ekle
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {specPairs.map((pair, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input
                    placeholder="Örn: Switch"
                    value={pair.key}
                    onChange={(e) => handleSpecChange(idx, "key", e.target.value)}
                    className="text-xs flex-1"
                  />
                  <Input
                    placeholder="Örn: GX Brown"
                    value={pair.value}
                    onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                    className="text-xs flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    className="p-1 text-rose-400 hover:text-rose-300 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6 mt-2 border-t border-[var(--border-subtle)] pt-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--violet)] focus:ring-[var(--violet)] h-4 w-4"
              />
              Öne Çıkar (Stream Favorite)
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                className="rounded border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--violet)] focus:ring-[var(--violet)] h-4 w-4"
              />
              Sitede Görünür
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 border-t border-[var(--border-subtle)] pt-4 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="h-9 px-4 text-xs font-semibold cursor-pointer"
            >
              İptal
            </Button>
            <Button
              type="submit"
              className="h-9 px-4 text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] border-none cursor-pointer"
            >
              Kaydet
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
