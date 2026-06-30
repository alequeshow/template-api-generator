const requiredKeys = ["NEXT_PUBLIC_API_BASE_URL"] as const;

type RequiredKey = (typeof requiredKeys)[number];

function readEnv(key: RequiredKey): string {
  const value = process.env[key];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export function getClientEnv() {
  return {
    apiBaseUrl: readEnv("NEXT_PUBLIC_API_BASE_URL"),
  };
}
