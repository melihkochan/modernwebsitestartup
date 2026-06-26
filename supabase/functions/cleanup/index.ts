import { logger } from "../shared/logger.ts";
import { handleError, corsHeaders } from "../shared/error-handler.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    logger.info("Edge function: cleanup triggered.");
    
    // Stub: In a future sprint, this will prune old viewer telemetry
    // entries (older than 30 days) and old logs.

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "cleanup edge function skeleton executed successfully." 
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
