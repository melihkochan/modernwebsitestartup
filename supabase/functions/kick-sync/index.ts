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

  // Pre-load current sync metadata to preserve previous timestamps
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

    // -------------------------------------------------------------------------
    // 1. Fetch current channel state from Kick API
    // -------------------------------------------------------------------------
    const profile = await provider.getProfile(KICK_CHANNEL_SLUG);
    const streamState = await provider.getStreamState(KICK_CHANNEL_SLUG, profile.id);

    let updatedRecords = 0;
    const uniqueTables = new Set<string>();

    // -------------------------------------------------------------------------
    // 2. Read the PREVIOUS stream_state from DB before overwriting it.
    //    This is critical for transition detection.
    // -------------------------------------------------------------------------
    let previousStreamState: {
      is_live: boolean;
      stream_title: string | null;
      current_game: string | null;
      started_at: string | null;
    } | null = null;

    try {
      const { data: prevState } = await supabase
        .from("stream_state")
        .select("is_live, stream_title, current_game, started_at")
        .maybeSingle();
      if (prevState) {
        previousStreamState = prevState;
      }
    } catch (e) {
      logger.warn("Failed to read previous stream_state for transition detection, continuing...", e);
    }

    // -------------------------------------------------------------------------
    // 3. Detect live → offline transition and create a stream_history record
    // -------------------------------------------------------------------------
    const streamJustEnded =
      previousStreamState?.is_live === true && streamState.isLive === false;

    if (streamJustEnded && previousStreamState?.started_at) {
      const endedAt = new Date().toISOString();
      const startedAt = previousStreamState.started_at;
      const kickStreamId = `${KICK_CHANNEL_SLUG}_${new Date(startedAt).getTime()}`;

      logger.info(`Stream transition detected: live → offline. Recording stream history (kickStreamId: ${kickStreamId}).`);

      try {
        // Aggregate peak and average viewers from viewer_history snapshots in this session
        const { data: viewerRows } = await supabase
          .from("viewer_history")
          .select("viewers")
          .gte("timestamp", startedAt)
          .lte("timestamp", endedAt)
          .is("stream_history_id", null); // Only unlinked rows from this session

        let peakViewers = 0;
        let averageViewers = 0;
        if (viewerRows && viewerRows.length > 0) {
          const counts = viewerRows.map((r) => r.viewers);
          peakViewers = Math.max(...counts);
          averageViewers = Math.round(counts.reduce((a, b) => a + b, 0) / counts.length);
        }

        // Insert the completed stream record (ignore conflict if already exists)
        const { data: newStream, error: historyError } = await supabase
          .from("stream_history")
          .insert({
            kick_stream_id: kickStreamId,
            title: previousStreamState.stream_title || "İsimsiz Yayın",
            game_played: previousStreamState.current_game || "Bilinmiyor",
            started_at: startedAt,
            ended_at: endedAt,
            peak_viewers: peakViewers,
            average_viewers: averageViewers,
          })
          .select("id")
          .single();

        if (historyError) {
          logger.warn(`Failed to insert stream_history record: ${historyError.message}`);
        } else if (newStream?.id) {
          updatedRecords++;
          uniqueTables.add("stream_history");

          // Backfill viewer_history rows to link them to the completed stream
          const { error: backfillError } = await supabase
            .from("viewer_history")
            .update({ stream_history_id: newStream.id })
            .gte("timestamp", startedAt)
            .lte("timestamp", endedAt)
            .is("stream_history_id", null);

          if (backfillError) {
            logger.warn(`Failed to backfill viewer_history.stream_history_id: ${backfillError.message}`);
          } else {
            logger.info(`Backfilled viewer_history rows with stream_history_id: ${newStream.id}`);
          }
        }
      } catch (transitionErr) {
        logger.error("Error during stream transition processing, continuing...", transitionErr);
      }
    }

    // -------------------------------------------------------------------------
    // 4. Write current stream_state to DB (Offline fallbacks)
    // -------------------------------------------------------------------------
    let offlineCoverUrl: string | null = null;
    try {
      const { data: assetData } = await supabase
        .from("site_assets")
        .select("offline_cover_url")
        .maybeSingle();
      if (assetData) {
        offlineCoverUrl = assetData.offline_cover_url;
      }
    } catch (e) {
      logger.warn(`Failed to fetch offline_cover_url: ${e instanceof Error ? e.message : String(e)}`);
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

    // -------------------------------------------------------------------------
    // 5. If live, insert a viewer_history snapshot (real data only, no fake bitrate)
    // -------------------------------------------------------------------------
    if (streamState.isLive) {
      const { error: viewerError } = await supabase
        .from("viewer_history")
        .insert({
          viewers: streamState.viewerCount,
          timestamp: new Date().toISOString(),
          // stream_history_id is intentionally null here — it will be backfilled on stream end
        });
      if (viewerError) {
        logger.warn("Failed to log viewer_history snapshot, continuing...", viewerError);
      } else {
        updatedRecords++;
        uniqueTables.add("viewer_history");
      }
    }

    // -------------------------------------------------------------------------
    // 6. Subscriber history: write official subscriber count if available
    // -------------------------------------------------------------------------
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
    } else {
      logger.info("Kick API did not return subscriber count. Skipping subscriber_history insert.");
    }

    // NOTE: follower_history writes are intentionally REMOVED.
    // Kick's public API does not return follower_count via client credentials.
    // Writing null or a fallback to follower_history would be misleading.
    // Follower data will be displayed as unavailable in the UI.

    // -------------------------------------------------------------------------
    // 7. Daily analytics aggregation
    // -------------------------------------------------------------------------
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
        // Only create a daily row when a stream is actually running
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
      logger.warn("Failed to aggregate daily analytics, continuing...", e);
    }

    // -------------------------------------------------------------------------
    // 8. Write sync status to settings
    // -------------------------------------------------------------------------
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

    logger.info(`kick-sync completed in ${durationMs}ms. Updated ${updatedRecords} records across ${uniqueTables.size} tables.`);

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
      logger.error("Double fault: failed to write error status to settings table", dbErr);
    }

    return handleError(error);
  }
});
