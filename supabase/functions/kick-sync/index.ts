import { logger } from "../shared/logger.ts";
import { handleError, corsHeaders } from "../shared/error-handler.ts";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    logger.info("Edge function: kick-sync triggered.");
    
    // Stub: In a future sprint, this will poll the Kick API and sync
    // live status (viewer count, game, title) to the database.

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "kick-sync edge function skeleton executed successfully." 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    return handleError(error);
  }
});
