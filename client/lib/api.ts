const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

// On 401, silently call /auth/refresh (cookies sent automatically) then retry once
async function refreshAccessToken(): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });
  return res.ok;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // send cookies automatically
    });

    const data = await response.json();

    // On 401, try refreshing once then retry
    if (response.status === 401 && endpoint !== '/auth/refresh') {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        const retryRes = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
          credentials: 'include',
        });
        const retryData = await retryRes.json();
        if (!retryRes.ok) {
          return { error: retryData.error || 'Request failed', message: retryData.message, status: retryRes.status };
        }
        return { data: retryData, status: retryRes.status };
      }
    }

    if (!response.ok) {
      return {
        error: data.error || 'Request failed',
        message: data.message || 'An unexpected error occurred',
        status: response.status,
      };
    }

    return { data, status: response.status };
  } catch (err: any) {
    return {
      error: 'Network Error',
      message: err.message || 'Unable to connect to backend server. Make sure the server is running on port 5000.',
      status: 0,
    };
  }
}
