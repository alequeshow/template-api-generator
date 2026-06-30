const requiredClientKey = "NEXT_PUBLIC_API_BASE_URL" as const;

function readEnv(key: typeof requiredClientKey): string {
  const value = process.env[key];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export function getClientEnv() {
  return {
    apiBaseUrl: readEnv(requiredClientKey),
  };
}
