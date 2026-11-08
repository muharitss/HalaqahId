import { useState, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ACTION_COLUMNS,
  SYSTEM_PERMISSION_DEFINITIONS,
  getGroupedPermissions,
} from "../constants/permissions";
import { Search, CheckSquare, Square, Info } from "lucide-react";

interface PermissionMatrixProps {
  selectedCodes: string[];
  onChange: (codes: string[]) => void;
  readOnly?: boolean;
}

export function PermissionMatrix({
  selectedCodes,
  onChange,
  readOnly = false,
}: PermissionMatrixProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const allGroups = useMemo(() => getGroupedPermissions(), []);

  const totalPossible = SYSTEM_PERMISSION_DEFINITIONS.length;
  const selectedSet = useMemo(() => new Set(selectedCodes), [selectedCodes]);

  // Filter groups based on search query
  const filteredGroups = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return allGroups;

    return allGroups
      .map((group) => {
        const matchingPermissions = group.permissions.filter(
          (p) =>
            p.code.toLowerCase().includes(q) ||
            p.moduleLabel.toLowerCase().includes(q) ||
            p.actionLabel.toLowerCase().includes(q) ||
            p.deskripsi.toLowerCase().includes(q)
        );

        if (matchingPermissions.length > 0) {
          return {
            ...group,
            permissions: matchingPermissions,
          };
        }
        return null;
      })
      .filter((g): g is NonNullable<typeof g> => g !== null);
  }, [allGroups, searchQuery]);

  const togglePermission = (code: string) => {
    if (readOnly) return;
    const next = new Set(selectedSet);
    if (next.has(code)) {
      next.delete(code);
    } else {
      next.add(code);
    }
    onChange(Array.from(next));
  };

  const handleSelectAll = () => {
    if (readOnly) return;
    const allCodes = SYSTEM_PERMISSION_DEFINITIONS.map((p) => p.code);
    onChange(allCodes);
  };

  const handleDeselectAll = () => {
    if (readOnly) return;
    onChange([]);
  };

  const toggleModulePermissions = (modulePermissions: typeof SYSTEM_PERMISSION_DEFINITIONS) => {
    if (readOnly) return;
    const moduleCodes = modulePermissions.map((p) => p.code);
    const allModuleSelected = moduleCodes.every((code) => selectedSet.has(code));

    const next = new Set(selectedSet);
    if (allModuleSelected) {
      moduleCodes.forEach((c) => next.delete(c));
    } else {
      moduleCodes.forEach((c) => next.add(c));
    }
    onChange(Array.from(next));
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-4">
        {/* Controls Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-muted/40 p-3 rounded-lg border">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari izin / modul..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 text-sm bg-background"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-between sm:justify-end">
            <Badge variant="secondary" className="px-2.5 py-1 text-xs font-normal">
              <span className="font-semibold text-primary mr-1">
                {selectedCodes.length}
              </span>
              / {totalPossible} hak akses dipilih
            </Badge>

            {!readOnly && (
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="h-8 text-xs gap-1"
                >
                  <CheckSquare className="h-3.5 w-3.5" />
                  Pilih Semua
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDeselectAll}
                  className="h-8 text-xs gap-1"
                >
                  <Square className="h-3.5 w-3.5" />
                  Batal Semua
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Matrix Container */}
        <div className="border rounded-xl overflow-hidden bg-background divide-y shadow-xs">
          {/* Header Row */}
          <div className="hidden lg:grid grid-cols-12 gap-3 p-3 bg-muted/70 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b">
            <div className="col-span-3">Modul & Fitur</div>
            <div className="col-span-9 grid grid-cols-5 gap-2">
              {ACTION_COLUMNS.map((col) => (
                <div key={col.key} className="text-center font-medium">
                  {col.label}
                </div>
              ))}
            </div>
          </div>

          {/* Module Rows */}
          {filteredGroups.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              Tidak ada hak akses yang sesuai dengan filter pencarian &quot;{searchQuery}&quot;.
            </div>
          ) : (
            filteredGroups.map((group) => {
              const moduleCodes = group.permissions.map((p) => p.code);
              const selectedCountInModule = moduleCodes.filter((c) =>
                selectedSet.has(c)
              ).length;
              const isAllModuleSelected =
                moduleCodes.length > 0 && selectedCountInModule === moduleCodes.length;
              const isSomeModuleSelected =
                selectedCountInModule > 0 && !isAllModuleSelected;

              return (
                <div
                  key={group.module}
                  className="p-3 sm:p-4 hover:bg-muted/15 transition-colors grid grid-cols-1 lg:grid-cols-12 gap-3 items-center"
                >
                  {/* Module Title & Select All for module */}
                  <div className="lg:col-span-3 flex items-center justify-between lg:justify-start gap-3">
                    <div className="flex items-center gap-2">
                      {!readOnly && (
                        <Checkbox
                          checked={
                            isAllModuleSelected
                              ? true
                              : isSomeModuleSelected
                              ? "indeterminate"
                              : false
                          }
                          onCheckedChange={() =>
                            toggleModulePermissions(group.permissions)
                          }
                          aria-label={`Pilih semua izin modul ${group.moduleLabel}`}
                        />
                      )}
                      <div>
                        <span className="font-semibold text-sm text-foreground">
                          {group.moduleLabel}
                        </span>
                        <div className="text-[11px] text-muted-foreground font-mono">
                          {group.module}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal">
                      {selectedCountInModule}/{moduleCodes.length}
                    </Badge>
                  </div>

                  {/* Actions Columns for this module */}
                  <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
                    {ACTION_COLUMNS.map((col) => {
                      const permsForAction = group.permissions.filter(
                        (p) => p.action === col.key
                      );

                      if (permsForAction.length === 0) {
                        return (
                          <div
                            key={col.key}
                            className="hidden lg:flex items-center justify-center p-2 rounded-md bg-muted/10 text-muted-foreground/30 text-xs border border-dashed border-muted/50 min-h-[44px]"
                          >
                            -
                          </div>
                        );
                      }

                      return (
                        <div
                          key={col.key}
                          className="flex flex-col gap-1.5 p-2 rounded-lg bg-card border shadow-2xs hover:border-primary/40 transition-all"
                        >
                          <span className="lg:hidden text-[10px] font-semibold text-muted-foreground uppercase">
                            {col.label}
                          </span>

                          {permsForAction.map((perm) => {
                            const isChecked = selectedSet.has(perm.code);

                            return (
                              <Tooltip key={perm.code}>
                                <TooltipTrigger asChild>
                                  <label
                                    className={`flex items-start gap-2 p-1 rounded text-xs cursor-pointer select-none transition-colors ${
                                      isChecked
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-muted-foreground hover:text-foreground"
                                    } ${readOnly ? "cursor-default" : ""}`}
                                  >
                                    <Checkbox
                                      checked={isChecked}
                                      onCheckedChange={() => togglePermission(perm.code)}
                                      disabled={readOnly}
                                      className="mt-0.5"
                                    />
                                    <div className="flex-1 overflow-hidden">
                                      <div className="truncate leading-tight">
                                        {perm.actionLabel}
                                      </div>
                                    </div>
                                    <Info className="h-3 w-3 text-muted-foreground/60 shrink-0 mt-0.5" />
                                  </label>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs text-xs space-y-1">
                                  <p className="font-semibold text-foreground">
                                    {perm.actionLabel}
                                  </p>
                                  <p className="text-muted-foreground">
                                    {perm.deskripsi}
                                  </p>
                                  <p className="font-mono text-[10px] text-primary/80 pt-1 border-t border-muted">
                                    {perm.code}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
