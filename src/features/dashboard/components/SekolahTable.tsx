import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ChevronLeft, ChevronRight, School } from "lucide-react";
import type { SekolahWithCount, JenisLembaga } from "@/types/domain/sekolah";

interface SekolahTableProps {
  sekolahList: SekolahWithCount[];
  isLoading: boolean;
  search: string;
  onSearch: (val: string) => void;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  filterJenis: JenisLembaga | "ALL";
  onFilterJenis: (val: JenisLembaga | "ALL") => void;
  onDetail: (sekolah: SekolahWithCount) => void;
}

const JENIS_LABEL: Record<string, string> = {
  PESANTREN: "Pesantren",
  MADRASAH: "Madrasah",
  SEKOLAH_UMUM: "Sekolah Umum",
  TPA: "TPA",
};

export function SekolahTable({
  sekolahList,
  isLoading,
  search,
  onSearch,
  page,
  totalPages,
  total,
  onPageChange,
  filterJenis,
  onFilterJenis,
  onDetail,
}: SekolahTableProps) {
  const [inputVal, setInputVal] = useState(search);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch(inputVal);
  };

  const lokasi = (s: SekolahWithCount) =>
    [s.kota, s.provinsi].filter(Boolean).join(", ") || s.alamat || "-";

  return (
    <CardContent className="p-0 border rounded-xl overflow-hidden bg-card shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Memuat data..." : `${total} sekolah terdaftar`}
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={filterJenis}
            onValueChange={(v) => onFilterJenis(v as JenisLembaga | "ALL")}
          >
            <SelectTrigger className="h-9 w-full sm:w-[160px] text-xs">
              <SelectValue placeholder="Semua Jenis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Jenis</SelectItem>
              <SelectItem value="PESANTREN">Pesantren</SelectItem>
              <SelectItem value="MADRASAH">Madrasah</SelectItem>
              <SelectItem value="SEKOLAH_UMUM">Sekolah Umum</SelectItem>
              <SelectItem value="TPA">TPA</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Cari nama sekolah..."
              className="h-9 pl-8 w-full sm:w-[220px] text-xs"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => onSearch(inputVal)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Sekolah</TableHead>
            <TableHead className="hidden md:table-cell">Jenis</TableHead>
            <TableHead className="hidden sm:table-cell">Lokasi</TableHead>
            <TableHead className="text-center hidden sm:table-cell">Santri</TableHead>
            <TableHead className="text-center hidden sm:table-cell">Halaqah</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-10 mx-auto" /></TableCell>
                <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-10 mx-auto" /></TableCell>
                <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : sekolahList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                <School className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">
                  {search ? "Tidak ada sekolah yang cocok dengan pencarian" : "Belum ada data sekolah"}
                </p>
              </TableCell>
            </TableRow>
          ) : (
            sekolahList.map((s) => (
              <TableRow key={s.id_sekolah}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <School className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{s.nama_sekolah}</p>
                      {s.nama_singkat && (
                        <p className="text-xs text-muted-foreground">{s.nama_singkat}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {s.jenis_lembaga ? (
                    <Badge variant="secondary" className="text-xs font-normal">
                      {JENIS_LABEL[s.jenis_lembaga] ?? s.jenis_lembaga}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                  {lokasi(s)}
                </TableCell>
                <TableCell className="text-center hidden sm:table-cell text-sm">
                  {s._count.santri}
                </TableCell>
                <TableCell className="text-center hidden sm:table-cell text-sm">
                  {s._count.halaqah}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => onDetail(s)}>
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t text-xs text-muted-foreground">
          <span>Halaman {page} dari {totalPages}</span>
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </CardContent>
  );
}
