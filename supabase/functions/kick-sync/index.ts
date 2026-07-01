import { logger } from "../shared/logger.ts";
import { handleError, corsHeaders } from "../shared/error-handler.ts";
import { getSupabaseServiceClient } from "../shared/supabase-client.ts";
import { KickProvider } from "../shared/providers/kick-provider.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const startTime = Date.now();
  const supabase = getSupabaseServiceClient();

  const KICK_CLIENT_ID = Deno.env.get("KICK_CLIENT_ID");
  const KICK_CLIENT_SECRET = Deno.env.get("KICK_CLIENT_SECRET");
  const KICK_CHANNEL_SLUG = Deno.env.get("KICK_CHANNEL_SLUG") || "zehragn";

  logger.info(`Edge function: kick-sync triggered for channel '${KICK_CHANNEL_SLUG}'.`);

  // Pre-load current sync metadata
  let currentSyncMetadata: Record<string, unknown> | null = null;
  try {
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "kick_sync_status")
      .maybeSingle();
    if (data) {
      currentSyncMetadata = data.value as Record<string, unknown>;
    }
  } catch (err) {
    logger.warn("Failed to fetch current sync metadata, continuing...", err);
  }

  try {
    if (!KICK_CLIENT_ID || !KICK_CLIENT_SECRET) {
      throw new Error("Missing Kick Client ID or Client Secret credentials in environment");
    }

    const provider = new KickProvider(KICK_CLIENT_ID, KICK_CLIENT_SECRET);

    // 1. Fetch current channel state from Kick API
    const profile = await provider.getProfile(KICK_CHANNEL_SLUG);
    const streamState = await provider.getStreamState(KICK_CHANNEL_SLUG, profile.id);

    let updatedRecords = 0;
    const uniqueTables = new Set<string>();

    // 2. Read the PREVIOUS stream_state from DB before overwriting
    let previousStreamState: {
      is_live: boolean;
      stream_title: string | null;
      current_game: string | null;
      started_at: string | null;
      thumbnail_url: string | null;
    } | null = null;

    try {
      const { data: prevState } = await supabase
        .from("stream_state")
        .select("is_live, stream_title, current_game, started_at, thumbnail_url")
        .maybeSingle();
      if (prevState) {
        previousStreamState = prevState;
      }
    } catch (e) {
      logger.warn("Failed to read previous stream_state, continuing...", e);
    }

    // 3. Detect live → offline transition and finalize stream history
    const streamJustEnded =
      previousStreamState?.is_live === true && streamState.isLive === false;

    if (streamJustEnded && previousStreamState?.started_at) {
      const endedAt = new Date().toISOString();
      const startedAt = previousStreamState.started_at;
      const kickStreamId = `${KICK_CHANNEL_SLUG}_${new Date(startedAt).getTime()}`;

      logger.info(`Stream transition detected: live → offline. Finalizing stream history (kickStreamId: ${kickStreamId}).`);

      try {
        const { data: activeStream } = await supabase
          .from("stream_history")
          .select("*")
          .eq("kick_stream_id", kickStreamId)
          .maybeSingle();

        const durationSeconds = Math.round((new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000);

        if (activeStream) {
          const { data: viewerRows } = await supabase
            .from("viewer_history")
            .select("viewers")
            .gte("timestamp", startedAt)
            .lte("timestamp", endedAt)
            .eq("stream_history_id", activeStream.id);

          const { data: unlinkedRows } = await supabase
            .from("viewer_history")
            .select("viewers")
            .gte("timestamp", startedAt)
            .lte("timestamp", endedAt)
            .is("stream_history_id", null);

          const allViewerRows = [...(viewerRows || []), ...(unlinkedRows || [])];
          let peakViewers = activeStream.peak_viewers || 0;
          let averageViewers = activeStream.average_viewers || 0;
          if (allViewerRows && allViewerRows.length > 0) {
            const counts = allViewerRows.map((r) => r.viewers);
            peakViewers = Math.max(...counts);
            averageViewers = Math.round(counts.reduce((a, b) => a + b, 0) / counts.length);
          }

          await supabase
            .from("stream_history")
            .update({
              ended_at: endedAt,
              duration_seconds: durationSeconds,
              peak_viewers: peakViewers,
              average_viewers: averageViewers,
              status: "ended",
              ended_reason: "manual",
              stream_snapshot: streamState as any,
              snapshot_created_at: new Date().toISOString(),
            })
            .eq("id", activeStream.id);

          if (unlinkedRows && unlinkedRows.length > 0) {
            await supabase
              .from("viewer_history")
              .update({ stream_history_id: activeStream.id })
              .gte("timestamp", startedAt)
              .lte("timestamp", endedAt)
              .is("stream_history_id", null);
          }
        } else {
          // Fallback insert if record was missed
          const { data: maxRow } = await supabase
            .from("stream_history")
            .select("stream_number")
            .order("stream_number", { ascending: false })
            .limit(1)
            .maybeSingle();
          const nextStreamNumber = (maxRow?.stream_number || 0) + 1;
          const slug = `${KICK_CHANNEL_SLUG}-yayin-${nextStreamNumber}`;

          await supabase
            .from("stream_history")
            .insert({
              kick_stream_id: kickStreamId,
              external_stream_id: streamState.externalId || kickStreamId,
              title: previousStreamState.stream_title || "İsimsiz Yayın",
              slug: slug,
              category: previousStreamState.current_game || "Bilinmiyor",
              started_at: startedAt,
              ended_at: endedAt,
              duration_seconds: durationSeconds,
              peak_viewers: 0,
              average_viewers: 0,
              total_views: 0,
              followers_gained: 0,
              status: "ended",
              ended_reason: "manual",
              stream_snapshot: streamState as any,
              snapshot_created_at: new Date().toISOString(),
              stream_number: nextStreamNumber,
            });
        }
        updatedRecords++;
        uniqueTables.add("stream_history");
      } catch (transitionErr) {
        logger.error("Error during stream transition processing", transitionErr);
      }
    }

    // 4. If currently LIVE, insert or update stream_history record
    let activeStreamDbId: string | null = null;
    if (streamState.isLive && streamState.startedAt) {
      const kickStreamId = `${KICK_CHANNEL_SLUG}_${new Date(streamState.startedAt).getTime()}`;
      try {
        const { data: existingStream } = await supabase
          .from("stream_history")
          .select("id, stream_number, peak_viewers, average_viewers, started_at, total_views")
          .eq("kick_stream_id", kickStreamId)
          .maybeSingle();

        if (!existingStream) {
          const { data: maxRow } = await supabase
            .from("stream_history")
            .select("stream_number")
            .order("stream_number", { ascending: false })
            .limit(1)
            .maybeSingle();
          const nextStreamNumber = (maxRow?.stream_number || 0) + 1;
          const slug = `${KICK_CHANNEL_SLUG}-yayin-${nextStreamNumber}`;

          const { data: insertedStream } = await supabase
            .from("stream_history")
            .insert({
              kick_stream_id: kickStreamId,
              external_stream_id: streamState.externalId || kickStreamId,
              title: streamState.title || "İsimsiz Yayın",
              slug: slug,
              category: streamState.category || "Bilinmiyor",
              language: streamState.language || "tr",
              thumbnail: streamState.thumbnailUrl,
              started_at: streamState.startedAt,
              ended_at: new Date().toISOString(),
              duration_seconds: 0,
              peak_viewers: streamState.viewerCount,
              average_viewers: streamState.viewerCount,
              total_views: streamState.viewerCount,
              status: "live",
              stream_snapshot: streamState as any,
              snapshot_created_at: new Date().toISOString(),
              stream_number: nextStreamNumber,
            })
            .select("id")
            .single();
          if (insertedStream) {
            activeStreamDbId = insertedStream.id;
          }
        } else {
          activeStreamDbId = existingStream.id;
          const durationSeconds = Math.round((Date.now() - new Date(existingStream.started_at).getTime()) / 1000);

          const { data: viewerRows } = await supabase
            .from("viewer_history")
            .select("viewers")
            .gte("timestamp", existingStream.started_at)
            .eq("stream_history_id", existingStream.id);

          const { data: unlinkedRows } = await supabase
            .from("viewer_history")
            .select("viewers")
            .gte("timestamp", existingStream.started_at)
            .is("stream_history_id", null);

          const allViewerRows = [...(viewerRows || []), ...(unlinkedRows || [])];
          let peakViewers = existingStream.peak_viewers || streamState.viewerCount;
          let averageViewers = existingStream.average_viewers || streamState.viewerCount;
          if (allViewerRows.length > 0) {
            const counts = allViewerRows.map((r) => r.viewers);
            peakViewers = Math.max(...counts, streamState.viewerCount);
            averageViewers = Math.round(counts.reduce((a, b) => a + b, 0) / counts.length);
          }

          await supabase
            .from("stream_history")
            .update({
              title: streamState.title || "İsimsiz Yayın",
              category: streamState.category || "Bilinmiyor",
              thumbnail: streamState.thumbnailUrl,
              ended_at: new Date().toISOString(),
              duration_seconds: durationSeconds,
              peak_viewers: peakViewers,
              average_viewers: averageViewers,
              total_views: Math.max(existingStream.total_views || 0, streamState.viewerCount),
              status: "live",
              stream_snapshot: streamState as any,
              snapshot_created_at: new Date().toISOString(),
            })
            .eq("id", existingStream.id);
        }
        updatedRecords++;
        uniqueTables.add("stream_history");
      } catch (liveErr) {
        logger.error("Error updating live stream_history", liveErr);
      }
    }

    // 5. Write current stream_state to DB
    let offlineCoverUrl: string | null = null;
    try {
      const { data: assetData } = await supabase
        .from("site_assets")
        .select("logo_url") // use logo_url or logo as placeholder if needed
        .maybeSingle();
      if (assetData) {
        offlineCoverUrl = null; // default to null or layout fallback
      }
    } catch (e) {
      logger.warn(`Failed to fetch site_assets: ${e instanceof Error ? e.message : String(e)}`);
    }

    const { error: stateError } = await supabase
      .from("stream_state")
      .upsert({
        id: true,
        is_live: streamState.isLive,
        viewer_count: streamState.isLive ? streamState.viewerCount : 0,
        current_game: streamState.isLive ? (streamState.category || null) : null,
        stream_title: streamState.isLive ? (streamState.title || null) : null,
        started_at: streamState.isLive ? streamState.startedAt : null,
        thumbnail_url: streamState.isLive ? streamState.thumbnailUrl : (offlineCoverUrl || null),
        stream_url: streamState.isLive ? `https://kick.com/${KICK_CHANNEL_SLUG}` : null,
        last_checked_at: new Date().toISOString(),
      });
    if (stateError) throw new Error(`Failed to update stream_state: ${stateError.message}`);
    updatedRecords++;
    uniqueTables.add("stream_state");

    // 6. If live, insert a viewer_history snapshot linked to stream_history
    if (streamState.isLive) {
      const { error: viewerError } = await supabase
        .from("viewer_history")
        .insert({
          viewers: streamState.viewerCount,
          timestamp: new Date().toISOString(),
          stream_history_id: activeStreamDbId,
        });
      if (viewerError) {
        logger.warn("Failed to log viewer_history snapshot", viewerError);
      } else {
        updatedRecords++;
        uniqueTables.add("viewer_history");
      }

      // Record a live snapshot metadata for analytics
      try {
        await supabase.from("live_snapshots").insert({
          stream_id: activeStreamDbId,
          viewer_count: streamState.viewerCount,
          bitrate: 0,
          snapshot_time: new Date().toISOString(),
        });
      } catch (_snapshotErr) {
        // optional table
      }
    }

    // 7. Subscriber history
    if (profile.subscriberCount !== null && profile.subscriberCount !== undefined) {
      let lastSubCount = 0;
      try {
        const { data: lastSubs } = await supabase
          .from("subscriber_history")
          .select("active_count")
          .order("timestamp", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (lastSubs) lastSubCount = lastSubs.active_count;
      } catch (_e) { /* ignore */ }

      const netChange = lastSubCount > 0 ? profile.subscriberCount - lastSubCount : 0;
      const { error: subError } = await supabase
        .from("subscriber_history")
        .insert({
          active_count: profile.subscriberCount,
          net_change: netChange,
          timestamp: new Date().toISOString(),
        });
      if (subError) {
        logger.warn(`Failed to insert subscriber_history: ${subError.message}`);
      } else {
        updatedRecords++;
        uniqueTables.add("subscriber_history");
      }
    }

    // 8. Daily analytics aggregation
    const todayStr = new Date().toISOString().split("T")[0];
    try {
      const { data: currentAnalytics } = await supabase
        .from("analytics_daily")
        .select("*")
        .eq("date", todayStr)
        .maybeSingle();

      if (currentAnalytics) {
        const peakViewers = Math.max(currentAnalytics.peak_viewers || 0, streamState.viewerCount);
        const averageViewers = currentAnalytics.average_viewers > 0
          ? Math.round((currentAnalytics.average_viewers + streamState.viewerCount) / 2)
          : streamState.viewerCount;

        await supabase
          .from("analytics_daily")
          .update({ peak_viewers: peakViewers, average_viewers: averageViewers })
          .eq("date", todayStr);
      } else if (streamState.isLive) {
        await supabase
          .from("analytics_daily")
          .insert({
            date: todayStr,
            peak_viewers: streamState.viewerCount,
            average_viewers: streamState.viewerCount,
            followers_gained: 0,
            hours_streamed: 0.00,
          });
      }
      updatedRecords++;
      uniqueTables.add("analytics_daily");
    } catch (e) {
      logger.warn("Failed to aggregate daily analytics", e);
    }

    // 9. Write sync status to settings
    const durationMs = Date.now() - startTime;
    const syncMetadata = {
      status: "success",
      last_success_at: new Date().toISOString(),
      last_failed_at: currentSyncMetadata?.last_failed_at ?? null,
      last_response_time_ms: durationMs,
      duration_ms: durationMs,
      updated_records: updatedRecords,
      updated_tables: uniqueTables.size,
      error: null,
      provider: "kick",
      channel: KICK_CHANNEL_SLUG,
    };

    await supabase
      .from("settings")
      .upsert({ key: "kick_sync_status", value: syncMetadata });

    logger.info(`kick-sync completed in ${durationMs}ms. Updated ${updatedRecords} records.`);

    return new Response(
      JSON.stringify({ success: true, message: "kick-sync executed successfully", data: syncMetadata }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    const durationMs = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`kick-sync failed: ${errorMessage}`, error);

    try {
      const failMetadata = {
        status: "failed",
        last_success_at: currentSyncMetadata?.last_success_at ?? null,
        last_failed_at: new Date().toISOString(),
        last_response_time_ms: durationMs,
        duration_ms: durationMs,
        updated_records: 0,
        updated_tables: 0,
        error: errorMessage,
        provider: "kick",
        channel: KICK_CHANNEL_SLUG,
      };
      await supabase.from("settings").upsert({ key: "kick_sync_status", value: failMetadata });
    } catch (dbErr) {
      logger.error("Failed to write fail status to settings table", dbErr);
    }

    return handleError(error);
  }
});
