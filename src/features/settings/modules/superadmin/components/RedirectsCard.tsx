import { Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { RedirectRule } from "../types/superadmin.types";

interface RedirectsCardProps {
  redirects: RedirectRule[];
  fromPath: string;
  setFromPath: (path: string) => void;
  toPath: string;
  setToPath: (path: string) => void;
  statusCode: string;
  setStatusCode: (code: string) => void;
  editingRedirectId: number | null;
  setEditingRedirectId: (id: number | null) => void;
  handleSaveRedirect: (e: React.FormEvent) => void;
  handleEditRedirectClick: (red: RedirectRule) => void;
  handleDeleteRedirect: (id: number) => void;
}

export function RedirectsCard({
  redirects,
  fromPath,
  setFromPath,
  toPath,
  setToPath,
  statusCode,
  setStatusCode,
  editingRedirectId,
  setEditingRedirectId,
  handleSaveRedirect,
  handleEditRedirectClick,
  handleDeleteRedirect,
}: RedirectsCardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {editingRedirectId ? "Edit Redireksi" : "Tambah Redireksi"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveRedirect} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fromPath">Path Asal (From Path)</Label>
                <Input
                  id="fromPath"
                  value={fromPath}
                  onChange={(e) => setFromPath(e.target.value)}
                  placeholder="Contoh: /blog-lama"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toPath">Path Tujuan (To Path)</Label>
                <Input
                  id="toPath"
                  value={toPath}
                  onChange={(e) => setToPath(e.target.value)}
                  placeholder="Contoh: /blog"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="statusCode">Status HTTP</Label>
                <Select value={statusCode} onValueChange={setStatusCode}>
                  <SelectTrigger id="statusCode">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="301">301 - Permanent Redirect</SelectItem>
                    <SelectItem value="302">302 - Temporary Redirect</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 font-bold text-xs">
                  Simpan Rule
                </Button>
                {editingRedirectId && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setEditingRedirectId(null);
                      setFromPath("");
                      setToPath("");
                      setStatusCode("301");
                    }}
                    className="text-xs"
                  >
                    Batal
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Daftar Redirects Terdaftar</CardTitle>
          </CardHeader>
          <CardContent>
            {redirects.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">Belum ada pengalihan URL.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b bg-slate-50 dark:bg-slate-900/50 uppercase text-[9px] font-black text-slate-400">
                      <th className="p-3">Dari Path</th>
                      <th className="p-3">Ke Path</th>
                      <th className="p-3">Status HTTP</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {redirects.map((red) => (
                      <tr key={red.id_redirect} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200">{red.from_path}</td>
                        <td className="p-3 font-mono text-slate-550">{red.to_path}</td>
                        <td className="p-3">
                          <span className="px-1.5 py-0.5 rounded font-black bg-primary/10 text-primary text-[9px]">
                            {red.status_code}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditRedirectClick(red)}
                            className="h-8 w-8 text-slate-500 hover:text-slate-800"
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRedirect(red.id_redirect)}
                            className="h-8 w-8 text-red-500 hover:text-red-800"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

