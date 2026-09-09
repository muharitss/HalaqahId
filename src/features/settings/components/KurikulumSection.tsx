import {
  Bot,
  Languages,
  Layers,
  Sliders,
  Target,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SettingItem } from "./SettingItem";
import { useTerminology } from "@/hooks/useTerminology";

interface KurikulumSectionProps {
  isKepala: boolean;
  searchQuery: string;
  onNavigate: (path: string) => void;
}

export function KurikulumSection({
  isKepala,
  searchQuery,
  onNavigate,
}: KurikulumSectionProps) {
  const labelSantri = useTerminology("SANTRI");
  const labelMuhafiz = useTerminology("MUHAFIZ");
  const labelHalaqah = useTerminology("HALAQAH");

  const q = searchQuery.toLowerCase().trim();

  const items = [
    {
      id: "tahfidz-ai",
      icon: <Bot className="h-4 w-4" />,
      title: "Tahfidz AI",
      description: `Asisten virtual hafalan ${labelSantri.toLowerCase()}`,
      onClick: () =>
        onNavigate(
          isKepala ? "/kepala-muhafidz/tahfidzai" : "/muhafidz/tahfidzai"
        ),
      keywords: `tahfidz ai bot asisten virtual kecerdasan buatan koreksi makhraj tajwid ${labelSantri.toLowerCase()}`,
      visible: true,
    },
    {
      id: "terminologi-lembaga",
      icon: <Languages className="h-4 w-4" />,
      title: "Terminologi Lembaga",
      description: `Kustomisasi sebutan istilah ${labelSantri.toLowerCase()}, ${labelHalaqah.toLowerCase()}, ${labelMuhafiz.toLowerCase()}`,
      onClick: () => onNavigate("/kepala-muhafidz/settings/terminology"),
      keywords: `terminologi lembaga glosarium istilah santri santriwati ustadz muhafiz halaqah kobong asrama hujrah ${labelSantri.toLowerCase()} ${labelHalaqah.toLowerCase()} ${labelMuhafiz.toLowerCase()}`,
      visible: isKepala,
    },
    {
      id: "kategori-setoran",
      icon: <Layers className="h-4 w-4" />,
      title: "Kategori Setoran",
      description: "Kelola kategori kustom setoran Al-Quran",
      onClick: () => onNavigate("/kepala-muhafidz/settings/kategori"),
      keywords:
        "kategori setoran al-quran ziyadah murajaah bin-nazhar bil-ghaib tahsin jenis hafalan",
      visible: isKepala,
    },
    {
      id: "form-setoran",
      icon: <Sliders className="h-4 w-4" />,
      title: "Form Setoran",
      description: "Atur kolom kustom untuk form setoran",
      onClick: () => onNavigate("/kepala-muhafidz/settings/form-setoran"),
      keywords:
        "form setoran kolom kustom input nilai mutqin catatan ustadz kriteria centang",
      visible: isKepala,
    },
    {
      id: "target-setoran",
      icon: <Target className="h-4 w-4" />,
      title: "Target Setoran",
      description: `Atur target hafalan fleksibel untuk ${labelSantri.toLowerCase()}`,
      onClick: () => onNavigate("/kepala-muhafidz/settings/target"),
      keywords: `target setoran fleksibel santri semester tahunan juz halaman mutqin akselerasi ikhtibar ${labelSantri.toLowerCase()}`,
      visible: isKepala,
    },
    {
      id: "pengaturan-ujian",
      icon: <GraduationCap className="h-4 w-4" />,
      title: "Pengaturan Ujian",
      description: "Kelola kriteria dan rumus kelulusan ujian",
      onClick: () => onNavigate("/kepala-muhafidz/settings/ujian"),
      keywords:
        "pengaturan ujian kriteria kelulusan rumus nilai ikhtibar tasmi akreditasi tahfidz bobot munaqasyah",
      visible: isKepala,
    },
  ].filter((item) => {
    if (!item.visible) return false;
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.keywords.toLowerCase().includes(q)
    );
  });

  if (items.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pb-2">
          2. Fitur Tambahan & Kurikulum Ma'had
        </h3>
      </div>
      <Card className="p-0">
        <CardContent className="p-0 divide-y">
          {items.map((item) => (
            <SettingItem key={item.id} {...item} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
