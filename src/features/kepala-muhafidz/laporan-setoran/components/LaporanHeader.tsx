import Laporan from "@/components/typed-text";

export function LaporanHeader() {
  return (
    <div>
      <Laporan />
      <p className="text-sm text-muted-foreground mt-1">
        Monitoring progres dan kehadiran per halaqah.
      </p>
    </div>
  );
}