import { startOfDay, endOfDay, isWithinInterval } from "date-fns";
import type {
  GroupedData,
  GroupedSantriItem,
  SetoranItem,
} from "../../../types";

interface LaporanFilter {
  selectedMonth: number | null;
  selectedYear: number | null;
  activeHalaqah: string;
  selectedSantri: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  selectedKategori: string;
}

export function applyFilters(
  groupedDataRaw: GroupedData,
  filters: LaporanFilter,
  effectiveActiveHalaqah: string,
): GroupedData {
  const result: GroupedData = {};

  Object.entries(groupedDataRaw).forEach(([halaqahName, group]) => {
    if (
      effectiveActiveHalaqah !== "all" &&
      effectiveActiveHalaqah !== "" &&
      halaqahName !== effectiveActiveHalaqah
    ) {
      return;
    }

    const filteredSantriGroup: Record<number, GroupedSantriItem> = {};

    Object.entries(group.santriGroup).forEach(([santriKey, santri]) => {
      if (
        filters.selectedSantri !== "" &&
        !santri.nama
          .toLowerCase()
          .includes(filters.selectedSantri.toLowerCase())
      ) {
        return;
      }

      const filteredSetoran = santri.setoran.filter((s) => {
        const tgl = new Date(s.tanggal_setoran);

        if (filters.dateFrom && filters.dateTo) {
          if (
            !isWithinInterval(tgl, {
              start: startOfDay(filters.dateFrom),
              end: endOfDay(filters.dateTo),
            })
          ) {
            return false;
          }
        } else if (filters.dateFrom) {
          if (tgl < startOfDay(filters.dateFrom)) return false;
        } else if (filters.dateTo) {
          if (tgl > endOfDay(filters.dateTo)) return false;
        }

        const kategoriName =
          s.kategori?.nama_kategori ||
          (typeof s.kategori === "string" ? s.kategori : "Setoran");
        if (
          filters.selectedKategori !== "" &&
          kategoriName.toUpperCase() !== filters.selectedKategori.toUpperCase()
        ) {
          return false;
        }

        return true;
      });

      if (filteredSetoran.length > 0) {
        filteredSantriGroup[Number(santriKey)] = {
          ...santri,
          setoran: filteredSetoran,
          stats: filteredSetoran.reduce(
            (acc: Record<string, number>, s: SetoranItem) => {
              const kName =
                s.kategori?.nama_kategori ||
                (typeof s.kategori === "string" ? s.kategori : "Setoran");
              const key = kName.toUpperCase();
              acc[key] = (acc[key] ?? 0) + 1;
              return acc;
            },
            {},
          ),
        };
      }
    });

    if (Object.keys(filteredSantriGroup).length > 0) {
      result[halaqahName] = { ...group, santriGroup: filteredSantriGroup };
    }
  });

  return result;
}
