import { USE_MOCK_DATA } from "@/config/data-source";
import { createClient } from "@/lib/supabase/client";
import { RepositoryError } from "@/lib/errors";
import type { TimelineEvent } from "../validators/timeline-schemas";

export interface TimelineRepository {
  getMilestones(year: string): Promise<TimelineEvent[]>;
}

// ---------------------------------------------------------------------------
// Mock Implementation
// ---------------------------------------------------------------------------

const MOCK_EVENTS: TimelineEvent[] = [
  {
    id: "evt-1",
    year: "2026",
    date: "June 2026",
    title: "285K Followers & Brand New Space",
    category: "milestone",
    description: "Celebrating five years of streaming! We launched our official custom web experience Zehragn.com and upgraded the physical studio space.",
    extendedDetails: "A brand new dual-PC build was integrated with professional acoustic treatments. Viewership reached new heights, with active chatters exceeding 4,000 per hour on avg.",
    stats: [
      { label: "Followers", value: "285,400" },
      { label: "Average Viewers", value: "12,438" },
      { label: "Stream Count", value: "85 streams" },
    ],
    highlight: true,
  },
  {
    id: "evt-2",
    year: "2025",
    date: "November 2025",
    title: "Kick Esports Championship Partner",
    category: "esports",
    description: "Invited as the official co-host for the Valorant Challengers Kick Finals, presenting live analysis from the arena stage.",
    extendedDetails: "Co-streamed the grand finals with peak concurrent viewership topping 18,240 concurrent viewers. Conducted stage interviews with pro players.",
    stats: [
      { label: "Peak Viewers", value: "18,240" },
      { label: "Arena Interviews", value: "8 players" },
      { label: "Co-stream Hours", value: "32 hours" },
    ],
  },
  {
    id: "evt-3",
    year: "2025",
    date: "July 2025",
    title: "Annual Charity Marathon — $25,000 Raised",
    category: "charity",
    description: "Hosted a 24-hour non-stop gaming marathon to support Hope Children's Hospital, rallying the ZehrArmy to crush our initial goal.",
    extendedDetails: "Initially set a target of $10,000, which was met in the first 4 hours of the broadcast. Zehragn completed 12 consecutive wins in Valorant to wrap the stream.",
    stats: [
      { label: "Total Raised", value: "$25,480" },
      { label: "Duration", value: "24 hours" },
      { label: "Individual Donors", value: "1,420 fans" },
    ],
    highlight: true,
  },
  {
    id: "evt-4",
    year: "2024",
    date: "October 2024",
    title: "The 100,000 Followers Milestone",
    category: "milestone",
    description: "Hit 100k followers live on broadcast. Celebrated with special sub matches, fan call-ins, and a custom cake smash on stream.",
    extendedDetails: "Follower growth accelerated after adding variety horror slots on Thursdays. Celebrated with our biggest emote pack update in channel history.",
    stats: [
      { label: "Followers Count", value: "100,000" },
      { label: "Hype Trains", value: "Level 15" },
      { label: "Subscriptions Gained", value: "2,400" },
    ],
  },
  {
    id: "evt-5",
    year: "2023",
    date: "March 2023",
    title: "Official Migration to Kick.com",
    category: "career",
    description: "Made the strategic decision to transition our primary broadcast channel to Kick, signing a creator support agreement.",
    extendedDetails: "The transition proved highly successful, with the channel ranking in the Top 10 trending streamers list in Turkey within the first month.",
    stats: [
      { label: "Initial Stream Viewers", value: "4,500" },
      { label: "Growth Rate", value: "+300% monthly" },
      { label: "Subscriber Count", value: "1,200" },
    ],
    highlight: true,
  },
  {
    id: "evt-6",
    year: "2022",
    date: "May 2022",
    title: "The ZehrArmy Community Birth",
    category: "career",
    description: "Surpassed 10,000 followers! The community officially voted to name themselves 'ZehrArmy' and launched our Discord server.",
    extendedDetails: "Our Discord server reached 5,000 members in the first week. We established the weekly community custom match nights on Fridays.",
    stats: [
      { label: "Followers", value: "10,000" },
      { label: "Discord Members", value: "5,800" },
      { label: "Friday Custom Lobby", value: "10 players avg" },
    ],
  },
  {
    id: "evt-7",
    year: "2021",
    date: "June 2021",
    title: "The Very First Stream",
    category: "career",
    description: "Fired up the broadcast for the first time using a borrowed PC and a basic web camera. Peak viewer count was 3, all close friends.",
    extendedDetails: "Began streaming Valorant beta with low-graphics settings. Despite technical limitations, we laid the foundation of interactive chat engagement.",
    stats: [
      { label: "Peak Viewers", value: "3" },
      { label: "Stream Duration", value: "2.5 hours" },
      { label: "Equipment Cost", value: "$450" },
    ],
  },
];

const mockTimelineRepository: TimelineRepository = {
  async getMilestones(year) {
    if (year === "all") return MOCK_EVENTS;
    return MOCK_EVENTS.filter((e) => e.year === year);
  },
};

// ---------------------------------------------------------------------------
// Supabase Implementation
// ---------------------------------------------------------------------------

const supabaseTimelineRepository: TimelineRepository = {
  async getMilestones(year): Promise<TimelineEvent[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase.from("timeline").select("*");
      if (error) throw new RepositoryError(error.message, "FETCH_TIMELINE_FAILED", error);
      return mockTimelineRepository.getMilestones(year);
    } catch (err: any) {
      if (err instanceof RepositoryError) throw err;
      throw new RepositoryError("Failed to fetch timeline milestones", "FETCH_TIMELINE_FAILED", err);
    }
  },
};

// ---------------------------------------------------------------------------
// Unified Export Selector
// ---------------------------------------------------------------------------

export const timelineRepository: TimelineRepository = USE_MOCK_DATA
  ? mockTimelineRepository
  : supabaseTimelineRepository;
