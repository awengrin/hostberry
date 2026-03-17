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

  console.log(`[API] ${method} ${url.toString()}`);

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();

  if (!res.ok) {
    let errorData: unknown = text;
    try {
      errorData = JSON.parse(text);
    } catch {
      // keep as text
    }
    console.error(`[API] ${method} ${url.toString()} -> ${res.status}`, errorData);
    throw new ApiError(
      res.status,
      `API error: ${res.status} ${res.statusText}`,
      errorData
    );
  }

  if (!text) return {} as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    console.error(`[API] Failed to parse response:`, text.substring(0, 500));
    return {} as T;
  }
}
