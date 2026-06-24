import { AbsensiProvider } from "./components/absensi-provider";
import { AbsensiTabs } from "./components/absensi-tabs";
import { Absensi } from "@/components/custom/typed-text";

export default function AbsensiPage({
  hideHeader = false,
}: {
  hideHeader?: boolean;
}) {
  return (
    <AbsensiProvider>
      <div className="space-y-6 animate-in fade-in duration-500">
        {!hideHeader && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
            <div className="space-y-1">
              <Absensi />
            </div>
          </div>
        )}
        <AbsensiTabs />
      </div>
    </AbsensiProvider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export * from "./types/absensi.schema";
