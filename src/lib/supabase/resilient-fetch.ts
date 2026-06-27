/**
 * A fetch wrapper with built-in timeout and retry logic for network calls.
 * Improves client resilience against transient network drops and database connection timeouts.
 */
export async function resilientFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs = 3000,
  retries = 1
): Promise<Response> {
  let lastError: unknown = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(input, {
        ...init,
        signal: controller.signal,
      });
      return response;
    } catch (err: unknown) {
      lastError = err;

      const errorName = err instanceof Error ? err.name : "";
      const errorMessage = err instanceof Error ? err.message : String(err);
      const errorCode =
        err && typeof err === "object" && "code" in err
          ? String((err as Record<string, unknown>).code)
          : "";

      const isTimeout = errorName === "AbortError" || errorMessage.includes("timeout");
      const isNetworkError =
        errorMessage.includes("fetch failed") ||
        errorCode === "UND_ERR_CONNECT_TIMEOUT" ||
        errorCode === "ECONNREFUSED";

      // If it's not a timeout or a network/connection error, fail immediately without retrying
      if (!isTimeout && !isNetworkError) {
        throw err;
      }

      // Log warning in development
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `Supabase connection attempt ${attempt + 1}/${retries + 1} failed: ${errorMessage || errorCode || "Timeout"}. Retrying...`
        );
      }
    } finally {
      clearTimeout(id);
    }
  }

  throw lastError || new Error("Supabase connection timed out or failed after retries");
}
