import type { RequestHandler } from "@builder.io/qwik-city";

const getApiConfig = (platform: App.Platform | undefined) => {
  const env = platform?.env || {};
  return {
    apiUrl: (env.API_URL as string) || "http://localhost:8000",
    apiKey: (env.API_KEY as string) || "",
  };
};

export const onPost: RequestHandler = async ({ platform, request, json }) => {
  const { apiUrl, apiKey } = getApiConfig(platform);
  
  const formData = await request.formData();
  
  const response = await fetch(`${apiUrl}/api/upload/image`, {
    method: "POST",
    headers: {
      "X-API-Key": apiKey,
    },
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Upload failed" }));
    json(response.status, error);
    return;
  }
  
  const data = await response.json();
  json(200, data);
};
