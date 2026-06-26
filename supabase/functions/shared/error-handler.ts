import { logger } from "./logger.ts";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Global HTTP Error Handler for Edge Functions.
 * Returns formatted JSON HTTP responses with CORS headers.
 */
export function handleError(error: unknown, status = 500): Response {
  const message = error instanceof Error ? error.message : String(error);
  logger.error(`Function execution failed: ${message}`, error);

  return new Response(
    JSON.stringify({
      error: message,
      status,
    }),
    {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
}
