import { Trash2, GraduationCap, BookOpen, ListOrdered } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ExamTemplate } from "@/features/setoran/api/ujian-api";

interface ExamTemplateTableProps {
  templates: ExamTemplate[];
  isLoadingTemplates: boolean;
  errorTemplates: any;
  handleOpenDelete: (temp: ExamTemplate) => void;
}

export function ExamTemplateTable({
  templates,
  isLoadingTemplates,
  errorTemplates,
  handleOpenDelete,
}: ExamTemplateTableProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="py-4 px-6 border-b">
        <CardTitle className="text-sm font-bold">
          Templat Ujian Aktif
        </CardTitle>
        <CardDescription className="text-xs">
          Daftar opsi ujian kustom yang saat ini terintegrasi di sistem sekolah Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isLoadingTemplates ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Memuat templat...
          </div>
        ) : errorTemplates ? (
          <div className="p-10 text-center text-sm text-destructive font-medium">
            Gagal memuat templat: {errorTemplates.message}
          </div>
        ) : templates.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground space-y-2">
            <GraduationCap className="h-8 w-8 mx-auto opacity-30 text-muted-foreground" />
            <p className="font-medium">Belum ada templat ujian kustom</p>
            <p className="text-xs">
              Klik tombol &quot;Tambah Templat&quot; di atas untuk membuat.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-1/4 font-semibold text-xs">
                  Nama Ujian
                </TableHead>
                <TableHead className="w-[120px] font-semibold text-xs text-center">
                  Mode
                </TableHead>
                <TableHead className="font-semibold text-xs">
                  Kriteria Input
                </TableHead>
                <TableHead className="w-[200px] font-semibold text-xs">
                  Rumus Penilaian
                </TableHead>
                <TableHead className="w-[100px] font-semibold text-xs text-right pr-6">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((temp) => (
                <TableRow
                  key={temp.id_template}
                  className="transition-all hover:bg-muted/10"
                >
                  <TableCell className="font-bold text-sm text-foreground py-3.5">
                    {temp.nama_template || temp.nama_ujian}
                  </TableCell>
                  <TableCell className="text-center py-3.5">
                    {temp.jenis_ujian === "SINGLE_PASS" ? (
                      <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 text-[9px] font-bold hover:bg-emerald-500/10">
                        <BookOpen className="h-2.5 w-2.5 mr-1 inline" />
                        Single Pass
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="text-[9px] font-bold"
                      >
                        <ListOrdered className="h-2.5 w-2.5 mr-1 inline" />
                        Multi Soal
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5 flex flex-wrap gap-1 max-w-[250px]">
                    {temp.input_schema?.map((f) => (
                      <Badge
                        key={f.key}
                        variant="secondary"
                        className="text-[9px] px-1.5 py-0"
                      >
                        {f.label} ({f.type})
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground py-3.5">
                    {temp.formula_expression}
                  </TableCell>
                  <TableCell className="text-right py-3.5 pr-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDelete(temp)}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
