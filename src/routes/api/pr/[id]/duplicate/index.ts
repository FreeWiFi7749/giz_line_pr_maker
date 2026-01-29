import type { RequestHandler } from "@builder.io/qwik-city";

const getApiConfig = (platform: App.Platform | undefined) => {
  const env = platform?.env || {};
  return {
    apiUrl: (env.API_URL as string) || "",
    apiKey: (env.API_KEY as string) || "",
  };
};

const FETCH_TIMEOUT_MS = 30000;

export const onPost: RequestHandler = async ({ platform, params, json }) => {
  const { apiUrl, apiKey } = getApiConfig(platform);
  
  if (!apiUrl || !apiKey) {
    json(500, { detail: "API_URL or API_KEY is not configured" });
    return;
  }
  
  const { id } = params;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  
  try {
    const response = await fetch(`${apiUrl}/api/pr/${id}/duplicate`, {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Unknown error" }));
      json(response.status, error);
      return;
    }
    
    const data = await response.json();
    json(201, data);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      json(504, { detail: "Request timeout" });
      return;
    }
    json(500, { detail: "Internal server error" });
  }
};
