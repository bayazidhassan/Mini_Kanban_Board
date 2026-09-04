const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchClient = async <T = unknown>(
  endpoint: string,

  options: RequestInit = {},
): Promise<T> => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,

    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { 'Content-Type': 'application/json' }),

      ...options.headers,

      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));

    throw new Error(error.message || 'Request failed');
  }

  return res.json() as Promise<T>;
};
