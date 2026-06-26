import { USE_MOCK_DATA } from "@/config/data-source";
import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/errors";
import type { GalleryItem } from "../validators/gallery-schemas";

export interface GalleryRepository {
  getItems(category: string): Promise<GalleryItem[]>;
}

// ---------------------------------------------------------------------------
// Mock Implementation
// ---------------------------------------------------------------------------

const MOCK_GALLERY: GalleryItem[] = [
  {
    id: "gal-1",
    category: "setups",
    aspect: "landscape",
    gradient: "linear-gradient(135deg, #1a0533 0%, #2d0f5e 50%, #0d0d2e 100%)",
    label: "Zehragn Dual PC Setup Reveal",
    date: "June 2026",
    details: "The ultimate streaming powerhouse setup featuring Ryzen 7950X, RTX 4090, and dedicated capture card system.",
  },
  {
    id: "gal-2",
    category: "irl",
    aspect: "portrait",
    gradient: "linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #051022 100%)",
    label: "ZehrArmy Meetup at Gamescom",
    date: "August 2025",
    details: "Incredible turnout at the main hall! It was wonderful meeting so many community members in person.",
  },
  {
    id: "gal-3",
    category: "highlights",
    aspect: "square",
    gradient: "linear-gradient(135deg, #0d1a0d 0%, #1a3d1a 50%, #082008 100%)",
    label: "Radiant Promotion Celebration Screen",
    date: "May 2026",
    details: "After weeks of grinding solo queues, we finally secured the Radiant rank live with 15k active viewers.",
  },
  {
    id: "gal-4",
    category: "fanart",
    aspect: "landscape",
    gradient: "linear-gradient(135deg, #2d0a1a 0%, #5e1f3d 50%, #1a050f 100%)",
    label: "Zehragn Anime Digital Drawing",
    date: "April 2026",
    details: "Beautiful custom digital canvas illustration sent in by community moderator SniperX.",
  },
  {
    id: "gal-5",
    category: "setups",
    aspect: "portrait",
    gradient: "linear-gradient(135deg, #0a1a2d 0%, #1f3d5e 50%, #050f1a 100%)",
    label: "Ambient Setup Glow in Dark",
    date: "March 2026",
    details: "Late night vibes with custom neon green and deep violet lighting bars around the studio deck.",
  },
  {
    id: "gal-6",
    category: "irl",
    aspect: "square",
    gradient: "linear-gradient(135deg, #1a0a2d 0%, #3d1f5e 50%, #0f051a 100%)",
    label: "Signing merch at Kick Finals",
    date: "November 2025",
    details: "Signed over 500 cards and shirts. Huge thanks to everyone who waited in queue!",
  },
  {
    id: "gal-7",
    category: "highlights",
    aspect: "landscape",
    gradient: "linear-gradient(135deg, #1a1a0a 0%, #3d3d1f 50%, #0d0d05 100%)",
    label: "Charity Stream Milestone Chart",
    date: "December 2025",
    details: "Raised over $25,000 for children's hospitals during our annual 24-hour charity broadcast.",
  },
  {
    id: "gal-8",
    category: "fanart",
    aspect: "portrait",
    gradient: "linear-gradient(135deg, #0a1a1a 0%, #1f3d3d 50%, #050d0d 100%)",
    label: "ZehrArmy Logo Fan Concept",
    date: "February 2026",
    details: "Futuristic coat of arms concept made by community designer Ayz_Design.",
  },
  {
    id: "gal-9",
    category: "setups",
    aspect: "landscape",
    gradient: "linear-gradient(135deg, #1a0d00 0%, #3d2000 50%, #0d0600 100%)",
    label: "Custom Custom Keyboard Macros Detail",
    date: "January 2026",
    details: "Visual macro keys mapping close-up. Custom switches lubed for stream quietness.",
  },
];

const mockGalleryRepository: GalleryRepository = {
  async getItems(category) {
    if (category === "all") return MOCK_GALLERY;
    return MOCK_GALLERY.filter((item) => item.category === category);
  },
};

// ---------------------------------------------------------------------------
// Supabase Implementation
// ---------------------------------------------------------------------------

const supabaseGalleryRepository: GalleryRepository = {
  async getItems(category): Promise<GalleryItem[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase.from("gallery").select("*");
      if (error) throw new RepositoryError(error.message, "FETCH_GALLERY_FAILED", error);
      // Fallback structure check
      return mockGalleryRepository.getItems(category);
    } catch (err: any) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError("Failed to fetch gallery items", "FETCH_GALLERY_FAILED", err);
    }
  },
};

// ---------------------------------------------------------------------------
// Unified Export Selector
// ---------------------------------------------------------------------------

export const galleryRepository: GalleryRepository = USE_MOCK_DATA
  ? mockGalleryRepository
  : supabaseGalleryRepository;
