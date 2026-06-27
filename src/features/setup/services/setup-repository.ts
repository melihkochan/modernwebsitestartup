import { USE_MOCK_DATA } from "@/config/data-source";
import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/errors";
import type { SetupProduct } from "../validators/setup-schemas";

export interface SetupRepository {
  getProducts(category: string): Promise<SetupProduct[]>;
}

// ---------------------------------------------------------------------------
// Mock Implementation
// ---------------------------------------------------------------------------

const MOCK_SETUP_PRODUCTS: SetupProduct[] = [
  {
    id: "prod-1",
    category: "pc",
    name: "GeForce RTX 4090 Founders Edition",
    brand: "NVIDIA",
    desc: "The absolute pinnacle of graphics processing. Powering flawless 240fps gameplay in 1440p resolution while encoding high-bitrate streaming feeds synchronously.",
    rating: 4.9,
    specs: [
      { name: "Memory", value: "24GB GDDR6X" },
      { name: "CUDA Cores", value: "16384" },
      { name: "Boost Clock", value: "2.52 GHz" },
      { name: "TDP Power", value: "450W" },
    ],
    gradient: "linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)",
    url: "https://amazon.com",
    highlight: true,
  },
  {
    id: "prod-2",
    category: "pc",
    name: "Ryzen 9 7950X Processor",
    brand: "AMD",
    desc: "16 cores and 32 threads of pure compute. Handily handles massive background processes, Discord bots, and encoding feeds without affecting game performance.",
    rating: 4.8,
    specs: [
      { name: "Cores/Threads", value: "16 Cores / 32 Threads" },
      { name: "Base Speed", value: "4.5 GHz" },
      { name: "Max Boost Speed", value: "Up to 5.7 GHz" },
      { name: "Cache Size", value: "80MB" },
    ],
    gradient: "linear-gradient(135deg, #1a0a00 0%, #2d1500 100%)",
    url: "https://amazon.com",
  },
  {
    id: "prod-3",
    category: "peripherals",
    name: "ROG Swift PG27AQN 360Hz",
    brand: "ASUS",
    desc: "The world's fastest 1440p gaming monitor. Offers crystalline motion clarity, ultra-low input lag, and critical response rates for competitive Valorant play.",
    rating: 5.0,
    specs: [
      { name: "Refresh Rate", value: "360Hz" },
      { name: "Resolution", value: "2560 x 1440 (QHD)" },
      { name: "Panel Type", value: "Ultrafast IPS" },
      { name: "Response Time", value: "1ms (GTG)" },
    ],
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    url: "https://amazon.com",
    highlight: true,
  },
  {
    id: "prod-4",
    category: "peripherals",
    name: "G Pro X Superlight 2",
    brand: "Logitech",
    desc: "The definitive competitive gaming mouse. Ultra lightweight at 60 grams, featuring LIGHTFORCE hybrid switches and the advanced HERO 2 sensor.",
    rating: 4.9,
    specs: [
      { name: "Weight", value: "60 grams" },
      { name: "Sensor", value: "HERO 2 (32,000 DPI)" },
      { name: "Battery Life", value: "Up to 95 Hours" },
      { name: "Polling Rate", value: "4000Hz" },
    ],
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    url: "https://amazon.com",
  },
  {
    id: "prod-5",
    category: "peripherals",
    name: "Wooting 60HE Keyboard",
    brand: "Wooting",
    desc: "Analog keyboard utilizing magnetic Hall effect switches. Offers rapid trigger technology for instant input response and micro-stutter reduction.",
    rating: 4.9,
    specs: [
      { name: "Switches", value: "Lekker Analog Magnetic" },
      { name: "Actuation Range", value: "0.1mm - 4.0mm" },
      { name: "Layout", value: "60% Compact Layout" },
      { name: "Keycaps", value: "Double-shot PBT" },
    ],
    gradient: "linear-gradient(135deg, #2d0f5e 0%, #1a0533 100%)",
    url: "https://amazon.com",
  },
  {
    id: "prod-6",
    category: "audio",
    name: "SM7B Vocal Microphone",
    brand: "Shure",
    desc: "The gold standard for broadcasting. Offers warm, smooth voice capture with electromagnetic shielding and built-in pop filter protection.",
    rating: 4.8,
    specs: [
      { name: "Type", value: "Dynamic" },
      { name: "Polar Pattern", value: "Cardioid" },
      { name: "Frequency Range", value: "50 to 20,000 Hz" },
      { name: "Connection", value: "XLR" },
    ],
    gradient: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
    url: "https://amazon.com",
    highlight: true,
  },
  {
    id: "prod-7",
    category: "audio",
    name: "ATH-R70x Professional Headset",
    brand: "Audio-Technica",
    desc: "Reference open-back monitoring headphones. Lightweight comfort with accurate spatial soundstage to identify step locations in tactical games.",
    rating: 4.7,
    specs: [
      { name: "Design", value: "Open-back Reference" },
      { name: "Impedance", value: "470 Ohms" },
      { name: "Weight", value: "210 grams" },
      { name: "Driver Size", value: "45 mm" },
    ],
    gradient: "linear-gradient(135deg, #0a1a0a 0%, #0f2d0f 100%)",
    url: "https://amazon.com",
  },
  {
    id: "prod-8",
    category: "comfort",
    name: "Aeron Chair Ergonomic",
    brand: "Herman Miller",
    desc: "Pioneering posture support. Keeps posture perfectly aligned during long 8-hour sessions, preventing fatigue with cooling Pellicle mesh.",
    rating: 4.8,
    specs: [
      { name: "Size", value: "Size B (Medium)" },
      { name: "Material", value: "8Z Pellicle Mesh" },
      { name: "Adjustments", value: "PostureFit SL Fully Adjustable" },
      { name: "Warranty", value: "12 Years" },
    ],
    gradient: "linear-gradient(135deg, #0a0a1a 0%, #1a1a2d 100%)",
    url: "https://amazon.com",
  },
];

const mockSetupRepository: SetupRepository = {
  async getProducts(category) {
    if (category === "all") return MOCK_SETUP_PRODUCTS;
    return MOCK_SETUP_PRODUCTS.filter((p) => p.category === category);
  },
};

// ---------------------------------------------------------------------------
// Supabase Implementation
// ---------------------------------------------------------------------------

const supabaseSetupRepository: SetupRepository = {
  async getProducts(category): Promise<SetupProduct[]> {
    const supabase = createClient();
    try {
      // Setup products can be fetched from database structure or fallback to mocks
      const { error } = await supabase.from("faq").select("*").limit(1);
      if (error) throw new RepositoryError(error.message, "FETCH_SETUP_FAILED", error);
      return mockSetupRepository.getProducts(category);
    } catch (err: unknown) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError("Failed to fetch setup products", "FETCH_SETUP_FAILED", err);
    }
  },
};

// ---------------------------------------------------------------------------
// Unified Export Selector
// ---------------------------------------------------------------------------

export const setupRepository: SetupRepository = USE_MOCK_DATA
  ? mockSetupRepository
  : supabaseSetupRepository;
