/**
 * Memformat nama Role ke label yang mudah dibaca pengguna.
 */
export function getRoleBadgeLabel(role: string): string {
  const map: Record<string, string> = {
    MUHAFIZ: "Muhafiz",
    ADMIN: "Admin",
    KOORDINATOR_TAHFIZ: "Koordinator Tahfidz",
    SUPERADMIN: "Superadmin",
  };
  return map[role] ?? role;
}
