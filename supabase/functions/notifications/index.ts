import { logger } from "../shared/logger.ts";
import { handleError, corsHeaders } from "../shared/error-handler.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    logger.info("Edge function: notifications triggered.");
    
    // Stub: In a future sprint, this will trigger real-time notifications
    // for users (e.g. discord webhooks or push notifications on announcements).

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "notifications edge function skeleton executed successfully." 
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
