import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faSearch,
  faHistory,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useKelolaAuditLog } from "../hooks/useKelolaAuditLog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function KelolaAuditLogPage() {
  const {
    search,
    setSearch,
    actionFilter,
    setActionFilter,
    schoolFilter,
    setSchoolFilter,
    page,
    setPage,
    schools,
    logs,
    isLoading,
    totalPages,
  } = useKelolaAuditLog();

  const getActionBadge = (action: string) => {
    let classes = "bg-slate-500/10 text-slate-600";
    if (action.includes("CREATE")) {
      classes = "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20";
    } else if (action.includes("UPDATE") || action.includes("RESET")) {
      classes = "bg-blue-500/10 text-blue-600 border border-blue-500/20";
    } else if (action.includes("DELETE")) {
      classes = "bg-red-500/10 text-red-600 border border-red-500/20";
    } else if (action === "LOGIN") {
      classes = "bg-green-500/10 text-green-600 border border-green-500/20";
    } else if (action.includes("IMPERSONATE")) {
      classes = "bg-amber-500/10 text-amber-600 border border-amber-500/20";
    }

    return (
      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase ${classes}`}>
        {action.replace("_", " ")}
      </span>
    );
  };

  const formatBrowser = (userAgent: string | null) => {
    if (!userAgent) return "Unknown Client";
    if (userAgent.includes("Firefox")) return "Firefox Browser";
    if (userAgent.includes("Chrome")) return "Chrome Browser";
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari Browser";
    if (userAgent.includes("Edge")) return "Edge Browser";
    if (userAgent.includes("Postman")) return "Postman client";
    return "HTTP Client";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Logs & Aktivitas Sistem</h1>
          <p className="text-muted-foreground">
            Lacak riwayat tindakan penghapusan sekolah dan pengguna secara real-time
          </p>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="grid gap-4 md:grid-cols-4 items-end">
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="search">Cari Aktor atau Perubahan</Label>
          <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3.5 text-muted-foreground text-sm" />
            <Input
              id="search"
              placeholder="Cari aktor, email, atau detail..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="action">Filter Tindakan</Label>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger id="action">
              <SelectValue placeholder="Semua Tindakan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Tindakan</SelectItem>
              <SelectItem value="SCHOOL_DELETE">SCHOOL DELETE</SelectItem>
              <SelectItem value="USER_DELETE">USER DELETE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="school">Filter Sekolah</Label>
          <Select value={schoolFilter} onValueChange={setSchoolFilter}>
            <SelectTrigger id="school">
              <SelectValue placeholder="Semua Sekolah" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Sekolah</SelectItem>
              {schools.map((s) => (
                <SelectItem key={s.id_sekolah} value={s.id_sekolah.toString()}>
                  {s.nama_sekolah}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* AUDIT LOG TABLE */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Riwayat Aktivitas</CardTitle>
              <CardDescription>Menampilkan log aktivitas keamanan sistem terbaru</CardDescription>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <FontAwesomeIcon icon={faHistory} className="text-sm" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Waktu</TableHead>
                <TableHead className="w-[180px]">Tindakan</TableHead>
                <TableHead className="w-[200px]">Aktor</TableHead>
                <TableHead>Keterangan / Detail Perubahan</TableHead>
                <TableHead className="w-[220px]">IP & Perangkat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    Memuat data log audit...
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    Tidak ditemukan catatan aktivitas audit yang cocok
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id_log} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                    <TableCell className="text-xs text-slate-500 font-mono">
                      {new Date(log.created_at).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell>
                      <div className="text-xs font-semibold">{log.actor_name}</div>
                      <div className="text-[10px] text-slate-500 truncate" title={log.actor_email}>
                        {log.actor_email}
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        {log.actor_role.replace("_", " ")}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="font-medium text-slate-700 dark:text-slate-300">{log.details}</div>
                      {log.id_sekolah && (
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-slate-500">
                          <FontAwesomeIcon icon={faBuilding} className="h-3 w-3" />
                          Sekolah ID: {log.id_sekolah}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-[11px] text-slate-500">
                      <div className="flex items-center gap-1 font-mono">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                        {log.ip_address || "No IP Address"}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5" title={log.user_agent || ""}>
                        <FontAwesomeIcon icon={faInfoCircle} className="h-3 w-3 text-slate-400" />
                        <span className="truncate max-w-[180px]">{formatBrowser(log.user_agent)}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t mt-4">
              <div className="text-xs text-muted-foreground">
                Halaman {page} dari {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
