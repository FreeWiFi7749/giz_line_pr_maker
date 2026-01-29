import type { RequestHandler } from "@builder.io/qwik-city";

const getApiConfig = (platform: App.Platform | undefined) => {
  const env = platform?.env || {};
  return {
    apiUrl: (env.API_URL as string) || "",
    apiKey: (env.API_KEY as string) || "",
  };
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export const onPost: RequestHandler = async ({ platform, request, json }) => {
  const { apiUrl, apiKey } = getApiConfig(platform);
  
  if (!apiUrl || !apiKey) {
    json(500, { detail: "API_URL or API_KEY is not configured" });
    return;
  }
  
  const formData = await request.formData();
  const file = formData.get("file");
  
  if (!file || !(file instanceof File)) {
    json(400, { detail: "No file provided" });
    return;
  }
  
  if (file.size > MAX_FILE_SIZE) {
    json(413, { detail: "File too large. Maximum size is 5MB" });
    return;
  }
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    json(415, { detail: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP" });
    return;
  }
  
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
