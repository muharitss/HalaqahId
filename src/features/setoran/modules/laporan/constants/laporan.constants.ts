export const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const currentYear = new Date().getFullYear();
export const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

export const DEFAULT_FILTER = {
  selectedMonth: new Date().getMonth(),
  selectedYear: new Date().getFullYear(),
  activeHalaqah: "all",
  selectedSantri: "",
  dateFrom: null as Date | null,
  dateTo: null as Date | null,
  selectedKategori: "",
  filterMode: "month" as "month" | "week" | "range",
  selectedWeek: null as number | null,
};

