import { logger } from "../shared/logger.ts";
import { handleError, corsHeaders } from "../shared/error-handler.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    logger.info("Edge function: steam-sync triggered.");
    
    // Stub: In a future sprint, this will call the Steam Web API
    // for active game metadata and cache it in the database.

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "steam-sync edge function skeleton executed successfully." 
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
