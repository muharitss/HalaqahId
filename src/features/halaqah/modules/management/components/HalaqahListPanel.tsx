import { useState, useMemo, useEffect } from "react";
import { Search, Users, UserCheck, MoreVertical, Edit2, Trash2, UserPlus, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PermissionGate } from "@/components/ui/PermissionGate";
import { Term } from "@/components/ui/Term";
import { useTerminology } from "@/hooks/useTerminology";
import { RoleBadge } from "@/features/halaqah/components";
import type { Halaqah, Santri } from "@/features/halaqah/types";
import { cn } from "@/lib/utils";

export interface HalaqahListPanelProps {
  halaqahs: Halaqah[];
  selectedHalaqahId?: number | null;
  santriMap: Record<number, Santri[]>;
  onSelectHalaqah: (halaqah: Halaqah) => void;
  onAddSantri: (halaqah: Halaqah) => void;
  onEdit: (halaqah: Halaqah) => void;
  onDelete: (halaqah: Halaqah) => void;
  onManageMuhafiz?: (halaqah: Halaqah) => void;
}

const PAGE_SIZE = 8;

export function HalaqahListPanel({
  halaqahs,
  selectedHalaqahId,
  santriMap,
  onSelectHalaqah,
  onAddSantri,
  onEdit,
  onDelete,
  onManageMuhafiz,
}: HalaqahListPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const labelHalaqah = useTerminology("HALAQAH");

  useEffect(() => {
    setCurrentPage(1);
  }, [halaqahs.length, searchTerm]);

  const filteredHalaqahs = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return halaqahs;
    return halaqahs.filter((h) => {
      const nameMatch = h.name_halaqah.toLowerCase().includes(term);
      const muhafizMatch =
        (h.muhafiz?.name || "").toLowerCase().includes(term) ||
        (h.muhafiz_list || []).some((m) => m.name.toLowerCase().includes(term));
      return nameMatch || muhafizMatch;
    });
  }, [halaqahs, searchTerm]);

  const totalPages = Math.ceil(filteredHalaqahs.length / PAGE_SIZE);
  const displayedHalaqahs = filteredHalaqahs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Cari ${labelHalaqah.toLowerCase()} atau muhafiz...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-card"
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          Total: <strong>{filteredHalaqahs.length}</strong> {labelHalaqah.toLowerCase()}
        </span>
        {totalPages > 1 && (
          <span>
            Hal {currentPage} / {totalPages}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {displayedHalaqahs.length > 0 ? (
          displayedHalaqahs.map((h) => {
            const isSelected = selectedHalaqahId === h.id_halaqah;
            const santriCount = santriMap[h.id_halaqah]?.length ?? h.total_santri ?? 0;
            const muhafizList = (h.muhafiz_list && h.muhafiz_list.length > 0)
              ? h.muhafiz_list
              : h.muhafiz?.name
                ? [{ id_user: h.muhafiz.id_user, name: h.muhafiz.name, peran: "UTAMA" as const }]
                : [];
            const primaryMuhafiz = muhafizList[0];

            return (
              <div
                key={h.id_halaqah}
                role="button"
                tabIndex={0}
                onClick={() => onSelectHalaqah(h)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectHalaqah(h);
                  }
                }}
                className={cn(
                  "group relative p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3",
                  isSelected
                    ? "bg-primary/5 border-primary shadow-xs ring-1 ring-primary/40"
                    : "bg-card hover:bg-muted/40 hover:border-muted-foreground/30 border-border"
                )}
              >
                <div
                  className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary group-hover:bg-primary/20"
                  )}
                >
                  {h.name_halaqah.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm truncate text-foreground">
                      {h.name_halaqah}
                    </h4>
                    {isSelected && (
                      <Badge variant="secondary" className="text-[10px] h-4.5 px-1.5 py-0 font-medium">
                        Aktif
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 truncate">
                    <span className="flex items-center gap-1 shrink-0 font-medium">
                      <Users className="h-3.5 w-3.5" />
                      <span>{santriCount}</span>
                    </span>
                    <span>•</span>
                    <span className="truncate">
                      {primaryMuhafiz ? primaryMuhafiz.name : "Tanpa Muhafiz"}
                    </span>
                    {primaryMuhafiz?.peran && (
                      <RoleBadge role={primaryMuhafiz.peran} />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenuLabel>Aksi {labelHalaqah}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {onManageMuhafiz && (
                        <PermissionGate permission="halaqah.update">
                          <DropdownMenuItem onClick={() => onManageMuhafiz(h)} className="cursor-pointer">
                            <UserCheck className="mr-2 h-4 w-4" />
                            <span>Kelola <Term code="MUHAFIZ" /></span>
                          </DropdownMenuItem>
                        </PermissionGate>
                      )}
                      <PermissionGate permission="santri.create">
                        <DropdownMenuItem onClick={() => onAddSantri(h)} className="cursor-pointer">
                          <UserPlus className="mr-2 h-4 w-4" />
                          <span>Tambah <Term code="SANTRI" /></span>
                        </DropdownMenuItem>
                      </PermissionGate>
                      <PermissionGate permission="halaqah.update">
                        <DropdownMenuItem onClick={() => onEdit(h)} className="cursor-pointer">
                          <Edit2 className="mr-2 h-4 w-4" />
                          <span>Edit {labelHalaqah}</span>
                        </DropdownMenuItem>
                      </PermissionGate>
                      <PermissionGate permission="halaqah.delete">
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(h)}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Hapus {labelHalaqah}</span>
                        </DropdownMenuItem>
                      </PermissionGate>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isSelected ? "text-primary" : "text-muted-foreground/40 group-hover:text-muted-foreground"
                    )}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center bg-card">
            <p className="text-xs text-muted-foreground">
              Tidak ada {labelHalaqah.toLowerCase()} yang sesuai pencarian.
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2.5 text-xs"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Sebelumnya
          </Button>
          <span className="text-xs text-muted-foreground">
            {currentPage} dari {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2.5 text-xs"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Selanjutnya
          </Button>
        </div>
      )}
    </div>
  );
}