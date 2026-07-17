export const absensiKeys = {
  all: (userId?: number) => (userId ? (["absensi", userId] as const) : (["absensi"] as const)),
  sesi: (userId: number | undefined, sesiId: number, date: string) =>
    [...absensiKeys.all(userId), "sesi", sesiId, date] as const,
  rekapHalaqah: (userId: number | undefined, halaqahId: number, month: string, year: string) =>
    [...absensiKeys.all(userId), "rekap", halaqahId, month, year] as const,
  rekapAll: (userId: number | undefined, month: string, year: string) =>
    [...absensiKeys.all(userId), "rekap-all", month, year] as const,
};

export const sesiKeys = {
  all: (userId?: number) => (userId ? (["sesi", userId] as const) : (["sesi"] as const)),
  list: (userId?: number) => [...sesiKeys.all(userId), "list"] as const,
};
