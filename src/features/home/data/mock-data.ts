/**
 * Homepage mock data — Sprint 3
 * Replaces all real API data for the visual build.
 * All values are plausible and realistic.
 */

// ---------------------------------------------------------------------------
// Stream State
// ---------------------------------------------------------------------------

export const MOCK_STREAM = {
  isLive: true,
  title: "Solo Ranked Grind — Let's hit Radiant before season ends!",
  game: "Valorant",
  category: "FPS",
  viewerCount: 12_438,
  duration: "3h 24m",
  startedAt: "3 hours ago",
  thumbnailGradient: "linear-gradient(135deg, #1a0533 0%, #0d1117 40%, #0f0a2e 100%)",
} as const;

// ---------------------------------------------------------------------------
// Analytics Stats
// ---------------------------------------------------------------------------

export const MOCK_STATS = [
  {
    id: "followers",
    label: "Followers",
    value: 285_400,
    description: "Across all platforms",
    trend: { value: 12.4, label: "vs last month" },
  },
  {
    id: "peak-viewers",
    label: "Peak Viewers",
    value: 18_240,
    description: "All-time record",
    trend: { value: 8.1, label: "vs last month" },
  },
  {
    id: "hours-streamed",
    label: "Hours Streamed",
    value: 1_847,
    description: "This year",
    trend: { value: 22.7, label: "vs last year" },
  },
  {
    id: "total-streams",
    label: "Total Streams",
    value: 342,
    description: "Since launch",
    trend: { value: 5.3, label: "vs last month" },
  },
] as const;

// Community
// ---------------------------------------------------------------------------

export const MOCK_TOP_SUGGESTION = {
  game: "Counter-Strike 2",
  votes: 2_847,
  totalVotes: 4_120,
  submittedBy: "SnipezGG",
  category: "FPS",
} as const;

export const MOCK_ACTIVE_POLL = {
  question: "What time slot do you prefer for streams?",
  options: [
    { label: "Evening (20:00–24:00)", votes: 1_842, percentage: 58 },
    { label: "Night (00:00–04:00)", votes: 891, percentage: 28 },
    { label: "Afternoon (16:00–20:00)", votes: 447, percentage: 14 },
  ],
  totalVotes: 3_180,
  endsIn: "2 days",
} as const;



// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------

export const MOCK_TIMELINE = [
  {
    id: "t1",
    year: "2021",
    title: "The First Stream",
    description:
      "Started streaming on Twitch with a borrowed PC and zero viewers. The chat had three people — all friends.",
    highlight: false,
  },
  {
    id: "t2",
    year: "2022",
    title: "10,000 Followers",
    description:
      "Crossed 10K in eight months. The community named itself the 'ZehrArmy' — a name that stuck forever.",
    highlight: false,
  },
  {
    id: "t3",
    year: "2023",
    title: "Moved to Kick",
    description:
      "Joined Kick during its early creator wave. The move tripled the average viewer count within weeks.",
    highlight: true,
  },
  {
    id: "t4",
    year: "2024",
    title: "100K Milestone",
    description:
      "Hit 100,000 followers live on stream. The celebration lasted six hours and became the most celebrated moment of the year.",
    highlight: true,
  },
  {
    id: "t5",
    year: "2025",
    title: "Peak Season — 18K Average",
    description:
      "Ranked season saw average viewership climb to 18,000. Three consecutive top-10 finishes on the Kick trending chart.",
    highlight: false,
  },
  {
    id: "t6",
    year: "2026",
    title: "285K Strong & Growing",
    description:
      "The journey continues. New goals, new records, same community. The best chapter is still being written.",
    highlight: true,
  },
] as const;

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

export const MOCK_SETUP_ITEMS = [
  {
    id: "monitor",
    category: "Display",
    name: "ASUS ROG Swift",
    spec: "360Hz · 1440p · 27\"",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
  },
  {
    id: "gpu",
    category: "Graphics",
    name: "NVIDIA RTX 4090",
    spec: "24GB GDDR6X",
    gradient: "linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)",
  },
  {
    id: "cpu",
    category: "Processor",
    name: "AMD Ryzen 9 7950X",
    spec: "16 Cores · 5.7GHz",
    gradient: "linear-gradient(135deg, #1a0a00 0%, #2d1500 100%)",
  },
  {
    id: "headset",
    category: "Audio",
    name: "Audio-Technica ATH",
    spec: "Open-Back · Studio Grade",
    gradient: "linear-gradient(135deg, #0a1a0a 0%, #0f2d0f 100%)",
  },
  {
    id: "mic",
    category: "Microphone",
    name: "Shure SM7B",
    spec: "Dynamic · Broadcast",
    gradient: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
  },
  {
    id: "chair",
    category: "Seating",
    name: "Herman Miller Aeron",
    spec: "Ergonomic · Size B",
    gradient: "linear-gradient(135deg, #0a0a1a 0%, #1a1a2d 100%)",
  },
] as const;

// ---------------------------------------------------------------------------
// Gallery (mock images as gradient descriptors)
// ---------------------------------------------------------------------------

export const MOCK_GALLERY_ITEMS = [
  { id: "g1", aspect: "landscape", gradient: "linear-gradient(135deg, #1a0533 0%, #2d0f5e 50%, #0d0d2e 100%)", label: "Valorant Championship Watch Party" },
  { id: "g2", aspect: "portrait", gradient: "linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #051022 100%)", label: "100K Follower Milestone" },
  { id: "g3", aspect: "square", gradient: "linear-gradient(135deg, #0d1a0d 0%, #1a3d1a 50%, #082008 100%)", label: "IRL Stream at Gamescom" },
  { id: "g4", aspect: "landscape", gradient: "linear-gradient(135deg, #2d0a1a 0%, #5e1f3d 50%, #1a050f 100%)", label: "Community Event Night" },
  { id: "g5", aspect: "portrait", gradient: "linear-gradient(135deg, #0a1a2d 0%, #1f3d5e 50%, #050f1a 100%)", label: "ZehrArmy Discord Meetup" },
  { id: "g6", aspect: "square", gradient: "linear-gradient(135deg, #1a0a2d 0%, #3d1f5e 50%, #0f051a 100%)", label: "Peak Viewers — 18K Record" },
  { id: "g7", aspect: "landscape", gradient: "linear-gradient(135deg, #1a1a0a 0%, #3d3d1f 50%, #0d0d05 100%)", label: "Charity Stream 2024" },
  { id: "g8", aspect: "portrait", gradient: "linear-gradient(135deg, #0a1a1a 0%, #1f3d3d 50%, #050d0d 100%)", label: "New Setup Reveal" },
  { id: "g9", aspect: "landscape", gradient: "linear-gradient(135deg, #1a0d00 0%, #3d2000 50%, #0d0600 100%)", label: "Ranked Season Finale" },
] as const;

export type MockGalleryItem = typeof MOCK_GALLERY_ITEMS[number];

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

export const MOCK_FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "When does Zehragn stream?",
    answer:
      "Streams typically go live on Tuesday, Thursday, and Friday evenings starting at 20:00 (UTC+3). Weekend streams are more spontaneous — follow on Kick and enable notifications so you never miss a live.",
  },
  {
    id: "faq-2",
    question: "What games does Zehragn play?",
    answer:
      "The main game is Valorant at a Radiant level. Occasionally switches to CS2, Apex Legends, and single-player narrative games for variety weeks. The community votes on game suggestions every two weeks.",
  },
  {
    id: "faq-3",
    question: "Is there a community Discord server?",
    answer:
      "Yes — the ZehrArmy Discord is home to over 40,000 members. You'll find stream alerts, highlight channels, game-looking-for-group channels, and a direct line to the moderator team.",
  },
  {
    id: "faq-4",
    question: "How can I support the channel?",
    answer:
      "The best support is simply being present in streams and sharing highlights you enjoy. Kick subscriptions and channel points are also available. Every subscription directly supports the content quality and stream hours.",
  },
  {
    id: "faq-5",
    question: "Can I suggest games or stream ideas?",
    answer:
      "Absolutely. The Game Suggestions section on this site lets you submit and vote on game ideas. The most-voted game each month gets added to the next stream schedule. Your voice shapes the content.",
  },
] as const;
