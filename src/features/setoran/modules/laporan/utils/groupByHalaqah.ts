import type { SetoranItem } from "../../../types";

export function enrichSetoranWithHalaqahData(
  allSetoran: SetoranItem[],
  listHalaqah: any[]
): SetoranItem[] {
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
}
