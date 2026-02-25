import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SantriInfoCard() {
  const targets = [
    { label: "Ringan", desc: "1-2 halaman per pertemuan (untuk pemula)", variant: "secondary" },
    { label: "Sedang", desc: "3-4 halaman per pertemuan (rata-rata)", variant: "outline" },
    { label: "Intens", desc: "5-6 halaman per pertemuan (lanjutan)", variant: "default" },
    { label: "Khusus", desc: "Target khusus sesuai kesepakatan", variant: "destructive" },
  ] as const;

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FontAwesomeIcon icon={faCircleInfo} />
        </div>
        <CardTitle className="text-base font-semibold">
          Informasi Target Hafalan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {targets.map((t, idx) => (
            <div key={idx} className="flex flex-col gap-2 rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <Badge variant={t.variant}>{t.label}</Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}