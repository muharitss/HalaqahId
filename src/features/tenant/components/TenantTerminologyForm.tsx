import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Languages, Save, RotateCcw, Loader2 } from "lucide-react";
import {
  useTenantTerminology,
  useUpdateTenantTerminology,
} from "../hooks/useTenants";

interface TenantTerminologyFormProps {
  tenantId: number;
}

const DEFAULT_ENTITIES = [
  {
    code: "SANTRI",
    defaultLabel: "Santri",
    description: "Peserta didik atau murid penghafal Al-Qur'an",
    suggestions: ["Siswa", "Murid", "Tholib"],
  },
  {
    code: "HALAQAH",
    defaultLabel: "Halaqah",
    description: "Grup atau kelas tahfidz",
    suggestions: ["Kelas", "Kelompok", "Kafilah"],
  },
  {
    code: "MUHAFIZ",
    defaultLabel: "Muhafiz",
    description: "Guru / pembimbing tahfidz",
    suggestions: ["Ustadz", "Guru", "Musyrif", "Asatidz"],
  },
  {
    code: "SEKOLAH",
    defaultLabel: "Sekolah",
    description: "Lembaga, institusi induk, atau pondok",
    suggestions: ["Pesantren", "Pondok", "Madrasah", "Yayasan"],
  },
];

export function TenantTerminologyForm({ tenantId }: TenantTerminologyFormProps) {
  const { data: terminologies, isLoading } = useTenantTerminology(tenantId);
  const updateMutation = useUpdateTenantTerminology(tenantId);

  const [customLabels, setCustomLabels] = useState<Record<string, string>>({});
  const [savingCode, setSavingCode] = useState<string | null>(null);

  useEffect(() => {
    if (terminologies) {
      const mapping: Record<string, string> = {};
      terminologies.forEach((t) => {
        if (t.label_custom) {
          mapping[t.kode_entity] = t.label_custom;
        }
      });
      setCustomLabels(mapping);
    }
  }, [terminologies]);

  const handleCustomChange = (code: string, value: string) => {
    setCustomLabels((prev) => ({ ...prev, [code]: value }));
  };

  const handleSave = async (code: string) => {
    setSavingCode(code);
    const value = customLabels[code]?.trim() || null;
    try {
      await updateMutation.mutateAsync({
        kode_entity: code,
        label_custom: value,
      });
    } finally {
      setSavingCode(null);
    }
  };

  const handleReset = async (code: string) => {
    setSavingCode(code);
    try {
      await updateMutation.mutateAsync({
        kode_entity: code,
        label_custom: null,
      });
      setCustomLabels((prev) => {
        const next = { ...prev };
        delete next[code];
        return next;
      });
    } finally {
      setSavingCode(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <CardTitle>Terminologi & Sebutan Lembaga</CardTitle>
            <CardDescription>
              Atur sebutan kustom untuk entitas utama sesuai budaya lembaga ini
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[180px]">Kode Entitas</TableHead>
                <TableHead className="w-[140px]">Default</TableHead>
                <TableHead>Sebutan Kustom</TableHead>
                <TableHead className="w-[160px] text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DEFAULT_ENTITIES.map((entity) => {
                const currentCustom = customLabels[entity.code] ?? "";
                const isSavedCustom = !!terminologies?.find(
                  (t) => t.kode_entity === entity.code && t.label_custom
                );
                const isPending = savingCode === entity.code;

                return (
                  <TableRow key={entity.code}>
                    <TableCell className="font-semibold text-xs text-foreground">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-primary">{entity.code}</span>
                        <span className="text-[11px] text-muted-foreground font-normal">
                          {entity.description}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="font-normal text-xs">
                        {entity.defaultLabel}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1.5 max-w-sm">
                        <Input
                          placeholder={`Default: ${entity.defaultLabel}`}
                          value={currentCustom}
                          onChange={(e) =>
                            handleCustomChange(entity.code, e.target.value)
                          }
                          disabled={isPending}
                          className="h-8 text-xs"
                        />
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-[10px] text-muted-foreground">Contoh:</span>
                          {entity.suggestions.map((sug) => (
                            <button
                              key={sug}
                              type="button"
                              onClick={() => handleCustomChange(entity.code, sug)}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-muted hover:bg-muted/80 text-foreground transition-colors"
                            >
                              {sug}
                            </button>
                          ))}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="default"
                          className="h-8 px-2.5 text-xs"
                          onClick={() => handleSave(entity.code)}
                          disabled={isPending}
                        >
                          {isPending ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Save className="w-3.5 h-3.5 mr-1" />
                          )}
                          Simpan
                        </Button>
                        {isSavedCustom && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
                            onClick={() => handleReset(entity.code)}
                            disabled={isPending}
                            title="Reset ke default"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
