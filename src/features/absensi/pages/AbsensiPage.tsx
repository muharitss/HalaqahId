import { AbsensiProvider } from "../components/absensi-provider";
import { AbsensiTabs } from "../components/absensi-tabs";
import { Term } from "@/components/ui/Term";
import { useTerminology } from "@/hooks/useTerminology";

export default function AbsensiPage({
  hideHeader = false,
}: {
  hideHeader?: boolean;
}) {
  const labelSantri = useTerminology("SANTRI");

  return (
    <AbsensiProvider>
      <div className="w-full space-y-6">
        {!hideHeader && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-0">
                Absensi <Term code="SANTRI" />
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-0">
                Catat dan pantau riwayat kehadiran harian {labelSantri.toLowerCase()}.
              </p>
            </div>
          </div>
        )}
        <AbsensiTabs />
      </div>
    </AbsensiProvider>
  );
}
