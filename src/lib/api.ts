// API calls are proxied through server-side routes to keep API_KEY secure
// The server-side routes are at /api/* and forward requests to the backend
// with the API_KEY header added server-side
const getApiUrl = (): string => {
  // Always use relative URL to call our server-side API routes
  return "";
};

export interface PRBubble {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  tag_type: "gizmart" | "custom";
  tag_text: string;
  tag_color: string;
  start_date: string;
  end_date: string;
  priority: number | null;
  status: "draft" | "active" | "inactive";
  utm_campaign: string | null;
  view_count: number;
  click_count: number;
  created_at: string;
  updated_at: string;
}

export interface PRBubbleCreate {
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  tag_type: "gizmart" | "custom";
  tag_text: string;
  tag_color: string;
  start_date: string;
  end_date: string;
  priority?: number | null;
  status: "draft" | "active";
  utm_campaign?: string | null;
}

export interface PRBubbleUpdate {
  title?: string;
  description?: string;
  image_url?: string;
  link_url?: string;
  tag_type?: "gizmart" | "custom";
  tag_text?: string;
  tag_color?: string;
  start_date?: string;
  end_date?: string;
  priority?: number | null;
  status?: "draft" | "active" | "inactive";
  utm_campaign?: string | null;
}

export interface PRListResponse {
  items: PRBubble[];
  total: number;
  page: number;
  limit: number;
}

export interface PRStats {
  id: string;
  title: string;
  view_count: number;
  click_count: number;
  ctr: number;
  created_at: string;
  start_date: string;
  end_date: string;
  status: string;
}

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${getApiUrl()}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  pr: {
    list: (params?: { status?: string; page?: number; limit?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.set("status", params.status);
      if (params?.page) searchParams.set("page", params.page.toString());
      if (params?.limit) searchParams.set("limit", params.limit.toString());
      const query = searchParams.toString();
      return fetchAPI<PRListResponse>(`/api/pr${query ? `?${query}` : ""}`);
    },

    get: (id: string) => fetchAPI<PRBubble>(`/api/pr/${id}`),

    create: (data: PRBubbleCreate) =>
      fetchAPI<PRBubble>("/api/pr", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: PRBubbleUpdate) =>
      fetchAPI<PRBubble>(`/api/pr/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      fetchAPI<void>(`/api/pr/${id}`, { method: "DELETE" }),

    duplicate: (id: string) =>
      fetchAPI<PRBubble>(`/api/pr/${id}/duplicate`, { method: "POST" }),

    stats: (id: string) => fetchAPI<PRStats>(`/api/pr/${id}/stats`),
  },

  upload: {
    image: async (file: File): Promise<{ url: string }> => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${getApiUrl()}/api/upload/image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Upload failed" }));
        throw new Error(error.detail || `HTTP ${response.status}`);
      }

      return response.json();
    },
  },
};
