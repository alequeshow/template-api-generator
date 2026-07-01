const serverApiBaseUrlKey = "API_BASE_URL" as const;
const clientApiBaseUrlKey = "NEXT_PUBLIC_API_BASE_URL" as const;

function readValue(value: string | undefined, key: string): string {
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export function getBackendApiBaseUrl() {
  const explicitServerUrl = process.env[serverApiBaseUrlKey];

  if (explicitServerUrl && explicitServerUrl.trim().length > 0) {
    return explicitServerUrl;
  }

  return readValue(process.env[clientApiBaseUrlKey], clientApiBaseUrlKey);
}
