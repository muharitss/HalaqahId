import { useMemo } from "react";
import { laporanService } from "../../../api/laporanService";
import type { SetoranItem } from "../../../types";
import type { LaporanFilter } from "./useLaporanFilter";

interface UseLaporanGroupingProps {
  allSetoran: SetoranItem[];
  listHalaqah: any[];
  filters: LaporanFilter;
  effectiveActiveHalaqah: string;
}

export function useLaporanGrouping({
  allSetoran,
  listHalaqah,
  filters,
  effectiveActiveHalaqah,
}: UseLaporanGroupingProps) {
  // Enrich setoran with halaqah data
  const enrichedSetoran = useMemo(() => {
    return allSetoran.map((item) => {
      if (!item.santri?.halaqah) return item;
      const halaqahId = item.santri.halaqah.id_halaqah;
      const rawName = item.santri.halaqah.name_halaqah || "Tanpa Halaqah";

      const match = listHalaqah.find((h) => {
        if (halaqahId !== undefined && halaqahId !== null && halaqahId !== 0) {
          return h.id_halaqah === halaqahId;
        }
        return h.santri?.some((s: any) => s.id_santri === item.id_santri);
      });

      const muhafizName = match?.muhafiz?.name || "";
      const displayHalaqahName = muhafizName
        ? `${rawName} - ${muhafizName}`
        : rawName;

      return {
        ...item,
        santri: {
          ...item.santri,
          halaqah: {
            ...item.santri.halaqah,
            name_halaqah: displayHalaqahName,
            user: {
              name: muhafizName,
            },
          },
        },
      };
    });
  }, [allSetoran, listHalaqah]);

  // Grouped data (month/year filter for transformSetoranData)
  const groupedDataRaw = useMemo(() => {
    const dateFilter =
      filters.dateFrom || filters.dateTo
        ? { month: null, year: null }
        : { month: filters.selectedMonth, year: filters.selectedYear };

    return laporanService.transformSetoranData(enrichedSetoran, dateFilter);
  }, [
    enrichedSetoran,
    filters.selectedMonth,
    filters.selectedYear,
    filters.dateFrom,
    filters.dateTo,
  ]);

  const halaqahNames = useMemo(
    () => laporanService.getHalaqahNames(groupedDataRaw),
    [groupedDataRaw],
  );

  const halaqahMuhafizMap = useMemo(() => {
    const map: Record<string, string> = {};
    Object.entries(groupedDataRaw).forEach(([name, group]) => {
      if (group.muhafizName) {
        map[name] = group.muhafizName;
      }
    });
    return map;
  }, [groupedDataRaw]);

  const santriNames = useMemo(() => {
    const names = new Set<string>();
    Object.entries(groupedDataRaw).forEach(([halaqahName, group]) => {
      if (
        effectiveActiveHalaqah !== "all" &&
        effectiveActiveHalaqah !== "" &&
        halaqahName !== effectiveActiveHalaqah
      )
        return;
      Object.values(group.santriGroup).forEach((santri) => {
        names.add(santri.nama);
      });
    });
    return Array.from(names).sort();
  }, [groupedDataRaw, effectiveActiveHalaqah]);

  const activeHalaqahId = useMemo(() => {
    if (effectiveActiveHalaqah === "all") return null;
    return laporanService.getHalaqahIdByName(
      listHalaqah,
      effectiveActiveHalaqah,
    );
  }, [listHalaqah, effectiveActiveHalaqah]);

  return {
    groupedDataRaw,
    halaqahNames,
    halaqahMuhafizMap,
    santriNames,
    activeHalaqahId,
  };
}
