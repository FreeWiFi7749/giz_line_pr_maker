import type { RequestHandler } from "@builder.io/qwik-city";

const getApiConfig = (platform: App.Platform | undefined) => {
  const env = platform?.env || {};
  return {
    apiUrl: (env.API_URL as string) || "http://localhost:8000",
    apiKey: (env.API_KEY as string) || "",
  };
};

export const onGet: RequestHandler = async ({ platform, params, json }) => {
  const { apiUrl, apiKey } = getApiConfig(platform);
  const { id } = params;
  
  const response = await fetch(`${apiUrl}/api/pr/${id}`, {
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

export const onPut: RequestHandler = async ({ platform, params, request, json }) => {
  const { apiUrl, apiKey } = getApiConfig(platform);
  const { id } = params;
  
  const body = await request.json();
  
  const response = await fetch(`${apiUrl}/api/pr/${id}`, {
    method: "PUT",
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
  json(200, data);
};

export const onDelete: RequestHandler = async ({ platform, params, json }) => {
  const { apiUrl, apiKey } = getApiConfig(platform);
  const { id } = params;
  
  const response = await fetch(`${apiUrl}/api/pr/${id}`, {
    method: "DELETE",
    headers: {
      "X-API-Key": apiKey,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    json(response.status, error);
    return;
  }
  
  json(204, null);
};
