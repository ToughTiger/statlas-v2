export async function fetchWithAuthClient(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type')) {
    headers.append('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    credentials: 'include', // let browser send cookies
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`API request failed with status: ${response.status}`, { url, errorBody });
    throw new Error(`API request failed: ${response.statusText} - ${errorBody}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
}
