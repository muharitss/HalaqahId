import { useMemo } from "react";
import { startOfDay, endOfDay, isWithinInterval } from "date-fns";
import type { GroupedData, GroupedSantriItem, SetoranItem } from "../../../types";
import type { LaporanFilter } from "./useLaporanFilter";

interface UseLaporanStatsProps {
  groupedDataRaw: GroupedData;
  filters: LaporanFilter;
  effectiveActiveHalaqah: string;
}

export function useLaporanStats({
  groupedDataRaw,
  filters,
  effectiveActiveHalaqah,
}: UseLaporanStatsProps) {
  const groupedData = useMemo(() => {
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
          !santri.nama.toLowerCase().includes(filters.selectedSantri.toLowerCase())
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

          const kategoriName = s.kategori?.nama_kategori || (typeof s.kategori === "string" ? s.kategori : "Setoran");
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
                const kName = s.kategori?.nama_kategori || (typeof s.kategori === "string" ? s.kategori : "Setoran");
                const key = kName.toUpperCase();
                acc[key] = (acc[key] ?? 0) + 1;
                return acc;
              },
              {}
            ),
          };
        }
      });

      if (Object.keys(filteredSantriGroup).length > 0) {
        result[halaqahName] = { ...group, santriGroup: filteredSantriGroup };
      }
    });

    return result;
  }, [groupedDataRaw, filters, effectiveActiveHalaqah]);

  const isFilterActive =
    filters.selectedSantri !== "" ||
    filters.dateFrom !== null ||
    filters.dateTo !== null ||
    filters.selectedKategori !== "" ||
    (effectiveActiveHalaqah !== "" && effectiveActiveHalaqah !== "all");

  const periodLabel = useMemo(() => {
    const { dateFrom, dateTo, selectedMonth, selectedYear } = filters;

    if (dateFrom || dateTo) {
      const fmt = (d: Date) =>
        d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
      if (dateFrom && dateTo) return `${fmt(dateFrom)} – ${fmt(dateTo)}`;
      if (dateFrom) return `Sejak ${fmt(dateFrom)}`;
      return `Hingga ${fmt(dateTo!)}`;
    }

    if (selectedMonth === null || selectedYear === null) return "Semua Periode";

    return new Date(selectedYear, selectedMonth).toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  }, [filters]);

  return {
    groupedData,
    periodLabel,
    isFilterActive,
  };
}
