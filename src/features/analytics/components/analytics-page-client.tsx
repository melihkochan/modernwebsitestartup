"use client";

import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Flame,
  Award,
  ArrowUpRight,
  Tv,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Container } from "@/components/layout/container";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";
import Image from "next/image";
import { useSiteAssets } from "@/features/media/hooks/use-site-assets";
import { cn } from "@/lib/utils";
import { useAnalyticsMetrics, useAnalyticsTrends } from "../hooks/use-analytics";

const METRIC_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Peak Viewers": Users,
  "Followers Gained": Flame,
  "Hours Streamed": Clock,
  "Estimated Views": Tv,
};

interface TooltipPayloadItem {
  value: number;
  name?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  activeMetric: "viewers" | "followers" | "hours";
}

const CustomTooltip = ({ active, payload, label, activeMetric }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const getMetricLabel = () => {
      switch (activeMetric) {
        case "followers":
          return "New Followers";
        case "hours":
          return "Hours Streamed";
        default:
          return "Avg Viewers";
      }
    };

    const getMetricColor = () => {
      switch (activeMetric) {
        case "followers":
          return "#a855f7"; // purple-500
        case "hours":
          return "#3b82f6"; // blue-500
        default:
          return "#00f29a"; // neon-green / accent-primary
      }
    };

    return (
      <GlassCard className="p-3 border border-[var(--border-default)] shadow-[var(--shadow-md)] bg-[rgba(10,10,10,0.9)] flex flex-col gap-1 text-xs">
        <span className="font-bold text-[var(--text-primary)]">{label}</span>
        <span className="text-[var(--text-secondary)] font-medium">
          {getMetricLabel()}:{" "}
          <span className="font-extrabold text-[var(--text-primary)]" style={{ color: getMetricColor() }}>
            {formatNumber(payload[0].value)}
          </span>
        </span>
      </GlassCard>
    );
  }
  return null;
};


export function AnalyticsPageClient() {
  const { data: siteAssets } = useSiteAssets();
  const [mounted, setMounted] = useState(false);
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("daily");
  const [activeMetric, setActiveMetric] = useState<"viewers" | "followers" | "hours">("viewers");

  const { data: metrics = [], isLoading: isMetricsLoading } = useAnalyticsMetrics();
  const { data: trendData = [], isLoading: isTrendsLoading } = useAnalyticsTrends(timeframe);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const getMetricColor = () => {
    switch (activeMetric) {
      case "followers":
        return "#a855f7"; // purple-500
      case "hours":
        return "#3b82f6"; // blue-500
      default:
        return "#00f29a"; // neon-green / accent-primary
    }
  };





  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-hidden bg-[var(--bg-base)]">
      {/* Visual background glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_top,rgba(0,242,154,0.04),transparent_60%)] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-15%] w-[800px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.03),transparent_60%)] pointer-events-none z-0" />

      <Container className="relative z-10 flex flex-col gap-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-xl">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-[var(--accent-primary)]/20 text-[var(--accent-primary)] bg-[var(--accent-primary)]/5 font-bold uppercase tracking-wider">
                CHANNEL STATS
              </Badge>
              <span className="text-xs text-[var(--text-tertiary)] font-semibold">
                Updated hourly
              </span>
            </div>
            <div className="flex items-center gap-4">
              {siteAssets?.avatarUrl && (
                <Image
                  src={siteAssets.avatarUrl}
                  alt="Avatar"
                  width={48}
                  height={48}
                  className="rounded-full object-cover border border-[var(--border-default)]"
                  unoptimized={process.env.NODE_ENV === "development"}
                />
              )}
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)] leading-tight" style={{ fontFamily: "var(--font-outfit)" }}>
                The Story Told in Numbers
              </h1>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Explore the growth metrics, average viewership patterns, streaming times, and community milestones over time.
            </p>
          </div>

          {/* Timeframe selector tabs */}
          <div className="flex bg-[var(--bg-overlay)] p-1 rounded-full border border-[var(--border-default)] shadow-[var(--shadow-sm)] self-start md:self-auto">
            {(["daily", "weekly", "monthly"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={cn(
                  "px-5 py-1.5 text-xs font-semibold rounded-full capitalize transition-all cursor-pointer",
                  timeframe === t
                    ? "bg-[var(--bg-base)] text-[var(--text-primary)] shadow-[var(--shadow-sm)] border border-[var(--border-subtle)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 4 KPI Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isMetricsLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <GlassCard key={idx} className="p-6 border border-[var(--border-default)] animate-pulse h-[140px]" />
            ))
          ) : (
            metrics.map((metric, idx) => {
              const IconComp = METRIC_ICONS[metric.label] || Users;
              const hasValue = metric.value !== null && metric.value !== undefined;
              const displayValue = hasValue
                ? typeof metric.value === "number"
                  ? metric.value % 1 === 0
                    ? formatNumber(metric.value)
                    : metric.value
                  : metric.value
                : "Not available";
              const showTrend = metric.change !== null && metric.change !== undefined && metric.change !== "" && metric.isPositive !== null && metric.isPositive !== undefined;

              return (
                <GlassCard
                  key={idx}
                  className="relative p-6 border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-all duration-300 group"
                >
                  {/* Radial Glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[var(--radius-lg)]"
                    style={{
                      background: `radial-gradient(circle at 10% 10%, ${metric.glowColor || "rgba(139,92,246,0.1)"}, transparent 60%)`,
                    }}
                  />

                  <div className="flex items-center justify-between gap-4 relative z-10">
                    <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-bold">
                      {metric.label}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-overlay)] border border-[var(--border-default)] flex items-center justify-center">
                      <IconComp className="w-4 h-4 text-[var(--text-secondary)]" />
                    </div>
                  </div>

                  <div className="mt-4 flex items-baseline gap-2.5 relative z-10">
                    <span className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
                      {displayValue}
                    </span>
                    {showTrend && (
                      <span
                        className={cn(
                          "text-xs font-bold flex items-center gap-0.5",
                          metric.isPositive ? "text-[var(--live-red)]" : "text-amber-500"
                        )}
                      >
                        {metric.isPositive ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5" />
                        )}
                        {metric.change}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 text-[10px] text-[var(--text-tertiary)] relative z-10">
                    Compared to previous period
                  </div>
                </GlassCard>
              );
            })
          )}
        </div>

        {/* Central Visualization Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Chart Card (8 cols) */}
          <GlassCard className="lg:col-span-8 p-6 border border-[var(--border-default)] flex flex-col gap-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
                  Activity Trends Visualization
                </h2>
                <span className="text-xs text-[var(--text-tertiary)]">
                  Click on metric filters below to swap data view
                </span>
              </div>

              {/* Chart Metric Selector */}
              <div className="flex bg-[var(--bg-overlay)] p-1 rounded-lg border border-[var(--border-default)]">
                {(["viewers", "followers", "hours"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setActiveMetric(m)}
                    className={cn(
                      "px-3 py-1 text-xs font-semibold rounded transition-all capitalize cursor-pointer",
                      activeMetric === m
                        ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    {m === "viewers" ? "Viewers" : m === "followers" ? "Followers" : "Hours"}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Area Container with mounted guard */}
            <div className="h-[320px] w-full flex items-center justify-center relative bg-[rgba(10,10,10,0.1)] rounded-lg">
              {!mounted || isTrendsLoading ? (
                /* Static placeholder skeleton to prevent Hydration layout shift */
                <div className="absolute inset-0 flex flex-col gap-4 p-4 animate-pulse">
                  <div className="flex-1 border-b border-l border-white/5 flex items-end justify-between px-6">
                    <div className="w-[10%] h-[35%] bg-white/5 rounded-t" />
                    <div className="w-[10%] h-[60%] bg-white/5 rounded-t" />
                    <div className="w-[10%] h-[45%] bg-white/5 rounded-t" />
                    <div className="w-[10%] h-[75%] bg-white/5 rounded-t" />
                    <div className="w-[10%] h-[90%] bg-white/5 rounded-t" />
                    <div className="w-[10%] h-[55%] bg-white/5 rounded-t" />
                    <div className="w-[10%] h-[70%] bg-white/5 rounded-t" />
                  </div>
                  <div className="flex justify-between px-6 text-[10px] text-white/10">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              ) : trendData.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 text-center p-6 text-[var(--text-tertiary)] z-10">
                  <Tv className="w-8 h-8 text-zinc-600 animate-pulse" />
                  <span className="text-xs font-semibold text-[var(--text-secondary)]">Grafik verisi bulunmamaktadır</span>
                  <span className="text-[10px] text-[var(--text-tertiary)]">Yeterli veri biriktiğinde yayın istatistikleri burada listelenecektir.</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={getMetricColor()} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={getMetricColor()} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="var(--text-tertiary)"
                      fontSize={10}
                      fontFamily="var(--font-inter)"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="var(--text-tertiary)"
                      fontSize={10}
                      fontFamily="var(--font-inter)"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
                    />
                    <Tooltip content={<CustomTooltip activeMetric={activeMetric} />} cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }} />
                    <Area
                      type="monotone"
                      dataKey={activeMetric}
                      stroke={getMetricColor()}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#chartGlow)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </GlassCard>

          {/* Right Sidebar: Peak stats and Distribution (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <GlassCard className="p-6 border border-[var(--border-default)] flex flex-col gap-6">
              <h3 className="text-md font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-outfit)" }}>
                Audience Distribution
              </h3>

              {/* Progress bars representing mock distribution */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[var(--text-secondary)]">Turkey (TR)</span>
                    <span className="text-[var(--text-primary)]">64%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--bg-overlay)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--accent-primary)] rounded-full" style={{ width: "64%" }} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[var(--text-secondary)]">Germany (DE)</span>
                    <span className="text-[var(--text-primary)]">18%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--bg-overlay)] rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: "18%" }} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[var(--text-secondary)]">USA (US)</span>
                    <span className="text-[var(--text-primary)]">10%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--bg-overlay)] rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "10%" }} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[var(--text-secondary)]">Others</span>
                    <span className="text-[var(--text-primary)]">8%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--bg-overlay)] rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "8%" }} />
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 border border-[var(--border-default)] bg-[rgba(10,10,10,0.3)] relative overflow-hidden flex flex-col gap-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_90%,rgba(0,242,154,0.05),transparent_60%)] pointer-events-none" />

              <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center">
                <Award className="w-4.5 h-4.5 text-[var(--accent-primary)]" />
              </div>

              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  Esports Grid Performance
                </h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Consistently trending in the Top 10 Kick gaming categories. Average stream duration exceeded 5.5 hours in Q2 2026.
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-primary)] cursor-pointer hover:underline self-start">
                Download Sponsor Media Kit
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </GlassCard>
          </div>
        </div>
      </Container>
    </div>
  );
}
