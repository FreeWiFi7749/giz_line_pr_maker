import type { RequestHandler } from "@builder.io/qwik-city";

const getApiConfig = (platform: App.Platform | undefined) => {
  const env = platform?.env || {};
  return {
    apiUrl: (env.API_URL as string) || "",
    apiKey: (env.API_KEY as string) || "",
  };
};

export const onGet: RequestHandler = async ({ platform, query, json }) => {
  const { apiUrl, apiKey } = getApiConfig(platform);
  
  if (!apiUrl || !apiKey) {
    json(500, { detail: "API_URL or API_KEY is not configured" });
    return;
  }
  
  const params = new URLSearchParams();
  const status = query.get("status");
  const page = query.get("page");
  const limit = query.get("limit");
  
  if (status) params.set("status", status);
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);
  
  const url = `${apiUrl}/api/pr${params.toString() ? `?${params.toString()}` : ""}`;
  
  const response = await fetch(url, {
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

export const onPost: RequestHandler = async ({ platform, request, json }) => {
  const { apiUrl, apiKey } = getApiConfig(platform);
  
  if (!apiUrl || !apiKey) {
    json(500, { detail: "API_URL or API_KEY is not configured" });
    return;
  }
  
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    json(400, { detail: "Invalid JSON" });
    return;
  }
  
  const response = await fetch(`${apiUrl}/api/pr`, {
    method: "POST",
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    json(response.status, error);
    return;
  }
  
  const data = await response.json();
  json(201, data);
};
