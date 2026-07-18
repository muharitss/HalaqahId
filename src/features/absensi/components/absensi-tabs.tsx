import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAbsensi } from "./absensi-provider";
import { AbsensiFilter } from "./absensi-filter";
import { AbsensiInputTable } from "./absensi-input-table";
import { AbsensiRekapTable } from "./absensi-rekap-table";
import { useAuth } from "@/features/auth";
import { useTour } from "@/hooks/useTour";
import { type DriveStep } from "driver.js";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AbsensiTabs() {
  const { user } = useAuth();
  const { tab, setTab, loadingSantri, isLoadingSync } = useAbsensi();

  const steps: DriveStep[] = [
    {
      element: '[data-tour="absensi-tabs-list"]',
      popover: {
        title: "Navigasi Halaman Absensi 📅",
        description: "Beralih antara melakukan pencatatan absensi harian (Input Harian) dan melihat rekapitulasi kehadiran bulanan (Rekap Bulanan).",
        side: "bottom",
        align: "start"
      }
    },
    {
      element: '[data-tour="absensi-filters"]',
      popover: {
        title: "Filter Pencatatan 🔍",
        description: "Pilih sesi halaqah dan tanggal absensi. Absensi harian hanya bisa dicatat pada hari jadwal sesi tersebut aktif.",
        side: "bottom",
        align: "end"
      }
    },
    {
      element: '[data-tour="absensi-bulk-action"]',
      popover: {
        title: "Tandai Hadir Semua ⚡",
        description: "Klik tombol ini untuk secara cepat menandai seluruh santri di halaqah ini sebagai 'HADIR' dalam satu klik.",
        side: "bottom",
        align: "end"
      }
    },
    {
      element: '[data-tour="absensi-save-btn"]',
      popover: {
        title: "Simpan Kehadiran 💾",
        description: "Setelah mengubah kehadiran, klik 'Simpan Absensi' untuk menyimpan perubahan dari draf ke server secara permanen.",
        side: "top",
        align: "end"
      },
      waitForElement: 600,
      onDeselected: (_element, _step, options) => {
        if (options.index === 4) {
          setTab("rekap");
        }
      }
    },
    {
      element: '[data-tour="absensi-rekap-month-select"]',
      popover: {
        title: "Pilih Bulan Rekap 📅",
        description: "Pilih bulan dan tahun tertentu untuk melihat riwayat kehadiran kumulatif santri di halaqah.",
        side: "bottom",
        align: "end"
      },
      waitForElement: 600,
      onDeselected: (_element, _step, options) => {
        if (options.index === 3) {
          setTab("input");
        }
      }
    },
    {
      element: '[data-tour="absensi-rekap-download-pdf"]',
      popover: {
        title: "Unduh Laporan PDF 📄",
        description: "Ekspor laporan rekapitulasi absensi bulanan halaqah ini ke file PDF untuk dicetak atau dibagikan.",
        side: "bottom",
        align: "end"
      }
    }
  ];

  const { restartTour } = useTour({
    tourKey: "tour_absensi",
    steps,
    userId: user?.id_user,
    autoStart: true,
    ready: !loadingSantri && !isLoadingSync
  });

  return (
    <Tabs value={tab} onValueChange={setTab} className="space-y-4">
      <div className="flex items-center justify-between">
        <TabsList className="bg-muted p-1 w-full md:w-auto grid grid-cols-2 max-w-sm" data-tour="absensi-tabs-list">
          <TabsTrigger value="input">Input Harian</TabsTrigger>
          <TabsTrigger value="rekap">Rekap Bulanan</TabsTrigger>
        </TabsList>
        <Button
          onClick={restartTour}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary rounded-full"
          title="Mulai Panduan Absensi"
        >
          <HelpCircle className="h-4.5 w-4.5" />
        </Button>
      </div>

      <TabsContent
        value="input"
        className="space-y-6 mt-0 focus-visible:outline-none"
      >
        <AbsensiFilter />
        <AbsensiInputTable />
      </TabsContent>

      <TabsContent value="rekap" className="mt-0 focus-visible:outline-none">
        <AbsensiRekapTable />
      </TabsContent>
    </Tabs>
  );
}

