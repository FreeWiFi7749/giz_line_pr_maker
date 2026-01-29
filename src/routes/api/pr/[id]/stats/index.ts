import type { RequestHandler } from "@builder.io/qwik-city";

const getApiConfig = (platform: App.Platform | undefined) => {
  const env = platform?.env || {};
  return {
    apiUrl: (env.API_URL as string) || "",
    apiKey: (env.API_KEY as string) || "",
  };
};

export const onGet: RequestHandler = async ({ platform, params, json }) => {
  const { apiUrl, apiKey } = getApiConfig(platform);
  
  if (!apiUrl || !apiKey) {
    json(500, { detail: "API_URL or API_KEY is not configured" });
    return;
  }
  
  const { id } = params;
  
  const response = await fetch(`${apiUrl}/api/pr/${id}/stats`, {
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    json(response.status, error);
    return;
  }
  
  const data = await response.json();
  json(200, data);
};
