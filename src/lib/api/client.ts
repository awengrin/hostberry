const API_BASE_URL = (
  process.env.HOSTCREATORS_API_URL ||
  "https://www.hostberry.sk/api/v1/host"
).replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  params?: Record<string, string>;
  token?: string;
};

function getToken(optToken?: string): string {
  const token = optToken || process.env.HOSTCREATORS_API_TOKEN || "";
  if (!token) throw new ApiError(401, "API token nie je nastavený");
  return token;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, params, token } = options;

  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${getToken(token)}`,
    Accept: "application/json",
  };

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let errorData: unknown;
    try {
      errorData = await res.json();
    } catch {
      errorData = await res.text();
    }
    throw new ApiError(
      res.status,
      `API error: ${res.status} ${res.statusText}`,
      errorData
    );
  }

  // Some endpoints may return empty responses
  const text = await res.text();
  if (!text) return {} as T;

  return JSON.parse(text) as T;
}
