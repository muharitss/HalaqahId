import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function SupervisorInfo() {
  return (
    <AccordionItem value="supervisor">
      <AccordionTrigger className="text-base font-semibold hover:no-underline uppercase text-primary text-left">
        Supervisor
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4 pt-2 pb-6 text-balance leading-relaxed">
        <div className="space-y-4">
          <div>
            <h4 className="font-bold underline italic mb-1 uppercase text-xs">Job Desk 1: Pemantauan Pelaksanaan Program</h4>
            <p className="font-bold text-xs mb-1 italic">Aktivitas</p>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              <li>Memastikan strategi yang telah dibuat oleh manager/koordinator tahfidz berjalan dengan maksimal</li>
              <li>Melakukan kontrol harian terhadap semua kegiatan halaqah, termasuk kehadiran santri dan aktivitas yang berlangsung.</li>
              <li>Mengamati segala hal yang bisa menjadi bahan evaluasi</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold underline italic mb-1 uppercase text-xs">Job Desk 2: Dokumentasi Kegiatan</h4>
            <p className="font-bold text-xs mb-1 italic">Aktivitas</p>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              <li>Mengambil dokumentasi foto atau video selama kegiatan halaqah untuk mencatat aktivitas santri dan mengetahui perkembangan mereka.</li>
              <li>Membuat laporan harian yang mencakup catatan tentang kehadiran, kegiatan yang dilakukan, dan capaian santri.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold underline italic mb-1 uppercase text-xs">Job Desk 3: Interaksi Santri dengan Al-Qur'an</h4>
            <p className="font-bold text-xs mb-1 italic">Aktivitas</p>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              <li>Membantu merumuskan strategi supaya santri dapat maksimal berinteraksi dengan Al-Qur'an</li>
              <li>Memastikan setiap santri mematuhi ketentuan yang berlaku selama halaqah, serta mengingatkan mereka jika ada pelanggaran.</li>
            </ul>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
