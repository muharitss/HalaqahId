import { Edit2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { LandingSection } from "../types/superadmin.types";

interface LandingSectionsCardProps {
  landingSections: LandingSection[];
  editingSectionKey: string | null;
  setEditingSectionKey: (key: string | null) => void;
  sectTitle: string;
  setSectTitle: (title: string) => void;
  sectSubtitle: string;
  setSectSubtitle: (sub: string) => void;
  sectOrder: string;
  setSectOrder: (order: string) => void;
  sectActive: boolean;
  setSectActive: (active: boolean) => void;
  handleSaveSection: (e: React.FormEvent) => void;
  handleEditSection: (sec: LandingSection) => void;
}

export function LandingSectionsCard({
  landingSections,
  editingSectionKey,
  setEditingSectionKey,
  sectTitle,
  setSectTitle,
  sectSubtitle,
  setSectSubtitle,
  sectOrder,
  setSectOrder,
  sectActive,
  setSectActive,
  handleSaveSection,
  handleEditSection,
}: LandingSectionsCardProps) {
  if (editingSectionKey) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4 mb-4">
          <div>
            <CardTitle className="text-base">Edit Section: {editingSectionKey.toUpperCase()}</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setEditingSectionKey(null)}>
            Batal
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveSection} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sectTitle">Judul Section</Label>
              <Input
                id="sectTitle"
                value={sectTitle}
                onChange={(e) => setSectTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sectSub">Subjudul / Deskripsi Section</Label>
              <textarea
                id="sectSub"
                value={sectSubtitle}
                onChange={(e) => setSectSubtitle(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-primary resize-none bg-white dark:bg-slate-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sectOrder">Urutan (Order)</Label>
                <Input
                  id="sectOrder"
                  type="number"
                  value={sectOrder}
                  onChange={(e) => setSectOrder(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={sectActive ? "true" : "false"} onValueChange={(val) => setSectActive(val === "true")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Aktif (Tampil Publik)</SelectItem>
                    <SelectItem value="false">Nonaktif (Sembunyikan)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="font-bold text-xs">
              Simpan Section
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Kelola Section Landing Page</CardTitle>
        <CardDescription>Aktifkan/nonaktifkan dan edit teks global landing page secara langsung.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b bg-slate-50 dark:bg-slate-900/50 uppercase text-[9px] font-black text-slate-400">
                <th className="p-3">Key Section</th>
                <th className="p-3">Judul Tampil</th>
                <th className="p-3">Urutan</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {landingSections.map((sec) => (
                <tr key={sec.id_section} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  <td className="p-3 font-bold font-mono text-slate-800 dark:text-slate-200">{sec.section_key}</td>
                  <td className="p-3 font-medium text-slate-550 max-w-xs truncate">{sec.title || <span className="text-slate-300">-</span>}</td>
                  <td className="p-3 font-semibold">{sec.order}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase ${
                      sec.is_active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                    }`}>
                      {sec.is_active ? "Aktif" : "Mati"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-primary"
                      onClick={() => handleEditSection(sec)}
                    >
                      <Edit2 size={12} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

