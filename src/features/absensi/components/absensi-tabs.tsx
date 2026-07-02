import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAbsensi } from "./absensi-provider";
import { AbsensiFilter } from "./absensi-filter";
import { AbsensiInputTable } from "./absensi-input-table";
import { AbsensiRekapTable } from "./absensi-rekap-table";

export function AbsensiTabs() {
  const { tab, setTab } = useAbsensi();

  return (
    <Tabs value={tab} onValueChange={setTab} className="space-y-4">
      <TabsList className="bg-muted p-1 w-full md:w-auto grid grid-cols-2 max-w-sm">
        <TabsTrigger value="input">Input Harian</TabsTrigger>
        <TabsTrigger value="rekap">Rekap Bulanan</TabsTrigger>
      </TabsList>

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
