import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase, faClock, faMicrochip } from "@fortawesome/free-solid-svg-icons";

interface HealthData {
  status: string;
  dbLatencyMs: number;
  memoryUsage: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
  };
  uptime: number;
}

interface SystemHealthPanelProps {
  health?: HealthData;
  isLoading: boolean;
}

export function SystemHealthPanel({ health, isLoading }: SystemHealthPanelProps) {
  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts = [];
    if (days > 0) parts.push(`${days} hari`);
    if (hours > 0) parts.push(`${hours} jam`);
    if (minutes > 0) parts.push(`${minutes} menit`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs} detik`);

    return parts.join(", ");
  };

  const getLatencyColor = (ms: number): string => {
    if (ms < 50) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (ms < 150) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-red-500 bg-red-500/10 border-red-500/20";
  };

  const getLatencyStatus = (ms: number): string => {
    if (ms < 50) return "Lancar (Sangat Cepat)";
    if (ms < 150) return "Normal";
    return "Mengalami Latensi Tinggi";
  };

  if (isLoading || !health) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status Kesehatan Server</CardTitle>
          <CardDescription>Menghubungkan ke server...</CardDescription>
        </CardHeader>
        <CardContent className="h-[210px] flex items-center justify-center text-muted-foreground text-sm">
          Memuat data performa server...
        </CardContent>
      </Card>
    );
  }

  const memoryPercent = Math.min(100, Math.round((health.memoryUsage.heapUsed / health.memoryUsage.heapTotal) * 100));

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold">Status Kesehatan Server</CardTitle>
            <CardDescription>Metrik infrastruktur platform secara real-time</CardDescription>
          </div>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        {/* DATABASE LATENCY */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faDatabase} className="text-sm" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Koneksi Database</div>
              <div className="text-[10px] text-muted-foreground">{getLatencyStatus(health.dbLatencyMs)}</div>
            </div>
          </div>
          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold border ${getLatencyColor(health.dbLatencyMs)}`}>
            {health.dbLatencyMs} ms
          </span>
        </div>

        {/* PROCESS MEMORY */}
        <div className="border-b pb-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faMicrochip} className="text-sm" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">Penggunaan Memori (Heap)</div>
                <div className="text-[10px] text-muted-foreground">RSS: {health.memoryUsage.rss} MB</div>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-700">
              {health.memoryUsage.heapUsed} MB / {health.memoryUsage.heapTotal} MB
            </span>
          </div>
          <div className="space-y-1">
            <Progress value={memoryPercent} className="h-1.5 bg-slate-100" />
            <div className="flex justify-between text-[9px] text-muted-foreground">
              <span>Heap Used ({memoryPercent}%)</span>
              <span>Heap Allocation</span>
            </div>
          </div>
        </div>

        {/* PROCESS UPTIME */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faClock} className="text-sm" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Uptime Server</div>
              <div className="text-[10px] text-muted-foreground">Aktif Sejak Server Dijalankan</div>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-700 max-w-[150px] text-right truncate" title={formatUptime(health.uptime)}>
            {formatUptime(health.uptime)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
