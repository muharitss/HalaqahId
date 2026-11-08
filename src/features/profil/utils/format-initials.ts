/**
 * Mengambil 2 huruf inisial dari nama pengguna.
 */
export function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return "US";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}
