export function readCsrfTokenFromDocument() {
  if (typeof document === "undefined") {
    return "";
  }

  const csrfCookie = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("tg_csrf_token="));

  return csrfCookie?.split("=")[1] ?? "";
}
