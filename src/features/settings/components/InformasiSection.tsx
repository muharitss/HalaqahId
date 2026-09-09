import { useState } from "react";
import { Info, Link as LinkIcon, Trash2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SettingItem } from "./SettingItem";
import { useTerminology } from "@/hooks/useTerminology";

interface InformasiSectionProps {
  isKepala: boolean;
  basePath: string;
  searchQuery: string;
  onNavigate: (path: string) => void;
  onCopyLink: () => Promise<void>;
}

export function InformasiSection({
  isKepala,
  basePath,
  searchQuery,
  onNavigate,
  onCopyLink,
}: InformasiSectionProps) {
  const [isCopied, setIsCopied] = useState(false);

  const labelSantri = useTerminology("SANTRI");
  const labelMuhafiz = useTerminology("MUHAFIZ");
  const labelHalaqah = useTerminology("HALAQAH");

  const handleCopy = async () => {
    await onCopyLink();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const q = searchQuery.toLowerCase().trim();

  const items = [
    {
      id: "info-sop",
      icon: <Info className="h-4 w-4" />,
      title: "Informasi & SOP",
      description: "Pedoman penggunaan dan peraturan",
      onClick: () => onNavigate(`${basePath}/info`),
      keywords:
        "informasi sop pedoman buku panduan peraturan ma'had kebijakan santri dokumentasi",
      visible: true,
    },
    {
      id: "portal-publik",
      icon: <LinkIcon className="h-4 w-4" />,
      title: "Salin Link Portal Publik",
      description: `Bagikan akses ke wali ${labelSantri.toLowerCase()}`,
      keywords: `salin link tautan portal publik wali santri dashboard orang tua ${labelSantri.toLowerCase()}`,
      action: (
        <Button
          size="sm"
          variant="default"
          onClick={handleCopy}
          className="cursor-pointer"
        >
          {isCopied ? (
            <Check className="h-4 w-4 mr-1.5" />
          ) : (
            <Copy className="h-4 w-4 mr-1.5" />
          )}
          {isCopied ? "Tersalin!" : "Salin Link"}
        </Button>
      ),
      visible: isKepala,
    },
    {
      id: "trash",
      icon: <Trash2 className="h-4 w-4" />,
      title: "Tempat Sampah",
      description: `Pulihkan data ${labelMuhafiz.toLowerCase()} atau ${labelHalaqah.toLowerCase()}`,
      onClick: () => onNavigate(`${basePath}/trash`),
      keywords: `tempat sampah recycle bin sampah pulihkan data hapus muhafiz halaqah santri ${labelMuhafiz.toLowerCase()} ${labelHalaqah.toLowerCase()}`,
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
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
        3. Informasi & Eksternal
      </h3>
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
