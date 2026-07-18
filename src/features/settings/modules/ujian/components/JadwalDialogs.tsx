import { Calendar as CalendarIcon, Trash2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ExamTemplate } from "@/features/setoran/api/ujian-api";

interface JadwalDialogsProps {
  isJadwalModalOpen: boolean;
  setIsJadwalModalOpen: (val: boolean) => void;
  isEditJadwalOpen: boolean;
  setIsEditJadwalOpen: (val: boolean) => void;

  jadwalTitle: string;
  setJadwalTitle: (val: string) => void;
  jadwalTemplateId: string;
  setJadwalTemplateId: (val: string) => void;
  jadwalDate: string;
  setJadwalDate: (val: string) => void;
  periodeStart: string;
  setPeriodeStart: (val: string) => void;
  periodeEnd: string;
  setPeriodeEnd: (val: string) => void;
  jadwalStatus: "DRAFT" | "AKTIF" | "SELESAI" | "DIBATALKAN";
  setJadwalStatus: (val: "DRAFT" | "AKTIF" | "SELESAI" | "DIBATALKAN") => void;
  jadwalNotes: string;
  setJadwalNotes: (val: string) => void;
  templates: ExamTemplate[];
  isCreatingSchedule: boolean;
  isUpdatingSchedule: boolean;
  isDeletingSchedule: boolean;
  isLockingSnapshot: boolean;
  handleCreateJadwal: (e: React.FormEvent) => void;
  handleUpdateJadwal: (e: React.FormEvent) => void;
  handleDeleteJadwal: () => void;
  handleLockSnapshot: () => void;
  getTemplateDisplayName: (t: ExamTemplate) => string;
  clearJadwalForm: () => void;
}

export function JadwalDialogs({
  isJadwalModalOpen,
  setIsJadwalModalOpen,
  isEditJadwalOpen,
  setIsEditJadwalOpen,
  jadwalTitle,
  setJadwalTitle,
  jadwalTemplateId,
  setJadwalTemplateId,
  jadwalDate,
  setJadwalDate,
  periodeStart,
  setPeriodeStart,
  periodeEnd,
  setPeriodeEnd,
  jadwalStatus,
  setJadwalStatus,
  jadwalNotes,
  setJadwalNotes,
  templates,
  isCreatingSchedule,
  isUpdatingSchedule,
  isDeletingSchedule,
  isLockingSnapshot,
  handleCreateJadwal,
  handleUpdateJadwal,
  handleDeleteJadwal,
  handleLockSnapshot,
  getTemplateDisplayName,
  clearJadwalForm,
}: JadwalDialogsProps) {
  return (
    <>
      {/* CREATE JADWAL MODAL */}
      <Dialog open={isJadwalModalOpen} onOpenChange={setIsJadwalModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-extrabold flex items-center gap-2">
              <CalendarIcon className="h-4.5 w-4.5 text-primary" />
              Jadwalkan Ujian Baru
            </DialogTitle>
            <DialogDescription className="text-xs">
              Buat rincian pelaksanaan ujian berdasarkan templat yang telah didesain.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateJadwal} className="space-y-4 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">
                Judul Pelaksanaan Ujian
              </Label>
              <Input
                placeholder="Contoh: Ujian Akhir Bulan Juli 2026"
                value={jadwalTitle}
                onChange={(e) => setJadwalTitle(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">
                Pilih Templat Penilaian
              </Label>
              <Select
                value={jadwalTemplateId}
                onValueChange={setJadwalTemplateId}
                required
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Pilih Templat Ujian" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((t) => (
                    <SelectItem
                      key={t.id_template}
                      value={t.id_template.toString()}
                    >
                      {getTemplateDisplayName(t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1 col-span-1">
                <Label className="text-xs font-semibold">Tanggal Ujian</Label>
                <Input
                  type="date"
                  value={jadwalDate}
                  onChange={(e) => setJadwalDate(e.target.value)}
                  required
                  className="h-9 text-xs font-semibold px-2"
                />
              </div>
              <div className="space-y-1 col-span-1">
                <Label className="text-xs font-semibold">Periode Awal</Label>
                <Input
                  type="date"
                  value={periodeStart}
                  onChange={(e) => setPeriodeStart(e.target.value)}
                  required
                  className="h-9 text-xs font-semibold px-2"
                />
              </div>
              <div className="space-y-1 col-span-1">
                <Label className="text-xs font-semibold">Periode Akhir</Label>
                <Input
                  type="date"
                  value={periodeEnd}
                  onChange={(e) => setPeriodeEnd(e.target.value)}
                  required
                  className="h-9 text-xs font-semibold px-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1 col-span-2">
                <Label className="text-xs font-semibold">Status Awal</Label>
                <Select
                  value={jadwalStatus}
                  onValueChange={(val: any) => setJadwalStatus(val)}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">
                      Draft (Belum bisa dipilih Muhafidz)
                    </SelectItem>
                    <SelectItem value="AKTIF">
                      Aktif (Dapat dipilih Muhafidz)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">
                Catatan Tambahan (Opsional)
              </Label>
              <Textarea
                placeholder="Rincian / Petunjuk Ujian..."
                value={jadwalNotes}
                onChange={(e) => setJadwalNotes(e.target.value)}
                className="text-xs min-h-[70px] resize-none"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsJadwalModalOpen(false);
                  clearJadwalForm();
                }}
                className="h-9 text-xs font-bold"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isCreatingSchedule}
                className="h-9 text-xs font-bold"
              >
                {isCreatingSchedule ? "Menyimpan..." : "Simpan Jadwal"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT / DETAIL JADWAL MODAL */}
      <Dialog open={isEditJadwalOpen} onOpenChange={setIsEditJadwalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-extrabold flex items-center justify-between">
              <span>Detail Pelaksanaan Ujian</span>
              <Badge
                className={`text-[9px] font-black uppercase ${
                  jadwalStatus === "AKTIF"
                    ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200"
                    : jadwalStatus === "SELESAI"
                      ? "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200"
                      : jadwalStatus === "DIBATALKAN"
                        ? "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200"
                        : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200"
                }`}
              >
                {jadwalStatus}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdateJadwal} className="space-y-4 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Judul Jadwal</Label>
              <Input
                value={jadwalTitle}
                onChange={(e) => setJadwalTitle(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">
                Pilih Templat Penilaian
              </Label>
              <Select
                value={jadwalTemplateId}
                onValueChange={setJadwalTemplateId}
                required
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Pilih Templat Ujian" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((t) => (
                    <SelectItem
                      key={t.id_template}
                      value={t.id_template.toString()}
                    >
                      {getTemplateDisplayName(t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1 col-span-1">
                <Label className="text-xs font-semibold">Tanggal Ujian</Label>
                <Input
                  type="date"
                  value={jadwalDate}
                  onChange={(e) => setJadwalDate(e.target.value)}
                  required
                  className="h-9 text-xs font-semibold px-2"
                />
              </div>
              <div className="space-y-1 col-span-1">
                <Label className="text-xs font-semibold">Periode Awal</Label>
                <Input
                  type="date"
                  value={periodeStart}
                  onChange={(e) => setPeriodeStart(e.target.value)}
                  required
                  className="h-9 text-xs font-semibold px-2"
                />
              </div>
              <div className="space-y-1 col-span-1">
                <Label className="text-xs font-semibold">Periode Akhir</Label>
                <Input
                  type="date"
                  value={periodeEnd}
                  onChange={(e) => setPeriodeEnd(e.target.value)}
                  required
                  className="h-9 text-xs font-semibold px-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1 col-span-2">
                <Label className="text-xs font-semibold">Ubah Status</Label>
                <Select
                  value={jadwalStatus}
                  onValueChange={(val: any) => setJadwalStatus(val)}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">
                      Draft (Belum bisa dipilih Muhafidz)
                    </SelectItem>
                    <SelectItem value="AKTIF">
                      Aktif (Dapat dipilih Muhafidz)
                    </SelectItem>
                    <SelectItem value="SELESAI">
                      Selesai (Tidak menerima input hasil baru)
                    </SelectItem>
                    <SelectItem value="DIBATALKAN">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Catatan</Label>
              <Textarea
                value={jadwalNotes}
                onChange={(e) => setJadwalNotes(e.target.value)}
                className="text-xs min-h-[70px] resize-none"
              />
            </div>

            {/* Locked Snapshot Feature Action */}
            <div className="bg-muted/30 border border-dashed rounded-lg p-3 flex items-center justify-between gap-4 mt-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-foreground block">
                  Snapshot Materi Hafalan
                </span>
                <span className="text-[9px] text-muted-foreground block leading-normal">
                  Kunci rentang ayat & statistik setoran santri untuk periode ini sekarang.
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLockSnapshot}
                disabled={isLockingSnapshot}
                className="h-7.5 px-3 text-[10px] font-black text-primary gap-1 border-primary/20 hover:border-primary/40 shrink-0"
              >
                <Lock className="h-3 w-3" />
                Kunci
              </Button>
            </div>

            <DialogFooter className="pt-2 flex justify-between items-center gap-2 w-full">
              <Button
                type="button"
                variant="ghost"
                onClick={handleDeleteJadwal}
                disabled={isDeletingSchedule}
                className="h-9 text-xs font-bold text-destructive hover:bg-destructive/10 mr-auto"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditJadwalOpen(false);

                  }}
                  className="h-9 text-xs font-bold"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdatingSchedule}
                  className="h-9 text-xs font-bold"
                >
                  {isUpdatingSchedule ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
