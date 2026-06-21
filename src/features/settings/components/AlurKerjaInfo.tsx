import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function AlurKerjaInfo() {
  return (
    <AccordionItem value="alur-kerja">
      <AccordionTrigger className="text-base font-semibold hover:no-underline uppercase text-primary text-left">
        Alur Kerja
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-6 pt-2 pb-6 text-balance leading-relaxed text-[13px]">
        <div className="p-3 bg-muted rounded-md text-muted-foreground italic mb-2">
          Bagian ini berisi ringkasan alur kerja harian untuk semua kategori muhafiz.
        </div>
        {/* Hafalan Alur */}
        <div className="space-y-2">
            <h5 className="font-bold border-b border-primary/20 pb-1">ALUR KERJA MUHAFIZ HAFALAN</h5>
            <p className="font-bold underline italic text-xs uppercase">JobDesk : Menyimak Setoran Hafalan Santri</p>
            <p className="font-bold text-[11px] uppercase">Aktivitas : Menyimak Setoran</p>
            <ul className="list-disc ml-5 space-y-1">
                <li>Muhafiz menyimak setoran hafalan santri dengan target 2 santri per pekan.</li>
                <li>Muhafiz dapat memperbantukan santri pilihan untuk membantu menyimak setoran.</li>
                <li>Muhafiz mengarahkan santri yang hendak setoran untuk menuliskan apa yang akan disetorkan di mutaba’ah masing-masing.</li>
            </ul>
            <p className="font-bold text-[11px] uppercase mt-2">Aktivitas : Menyimak Setoran Per Dua Pekan</p>
            <ul className="list-disc ml-5 space-y-1">
                <li>Setiap sabtu kedua dan keempat, santri wajib menyetorkan hafalan selama dua pekan setiap periode sesuai target masing-masing.</li>
                <li>Apa yang sudah disetorkan tetap dicatat di lembar mutaba’ah dan diberi tanda di samping kolom, misal : “tasmi’ per dua pekan” atau semisalnya.</li>
                <li>Tasmi’ per dua pekan catatannya dibedakan dengan tasmi’ harian, yang berarti saat tiba tasmi’ periode kedua maka dia melanjutkan apa yang disetorkan di tasmi’ periode pertama bukan melanjutkan apa yang disetorkan di tasmi’ harian.</li>
            </ul>
        </div>
        {/* Bacaan Alur */}
        <div className="space-y-2 mt-4">
            <h5 className="font-bold border-b border-primary/20 pb-1">ALUR KERJA MUHAFIZ BACAAN</h5>
            <p className="font-bold underline italic text-xs uppercase">JobDesk : Mentahsin Bacaan Santri</p>
            <p className="font-bold text-[11px] uppercase">Aktivitas : Mengajari Baca Qur`an</p>
            <ul className="list-disc ml-5 space-y-1">
                <li>Mentalqin bacaan santri pada juz target (30, 29, 28)</li>
                <li>Muhafiz menyimak bacaan yang sudah ditalqinkan.</li>
                <li>Muhafiz mengarahkan santri menuliskan sampai mana bacaan yang sudah di storkan</li>
            </ul>
        </div>
        {/* Khusus Alur */}
        <div className="space-y-2 mt-4">
            <h5 className="font-bold border-b border-primary/20 pb-1">ALUR KERJA MUHAFIZ HALAQAH KHUSUS</h5>
            <p className="font-bold underline italic text-xs uppercase">JobDesk : Menyimak Setoran Hafalan Santri</p>
            <ul className="list-disc ml-5 space-y-1">
                <li>Muhafiz menyimak setoran hafalan santri dengan setiap santri harus setoran di setiap pertemuan.</li>
                <li>Muhafiz dapat memperbantukan santri pilihan untuk membantu menyimak setoran.</li>
                <li>Muhafiz mengarahkan santri yang hendak setoran untuk menuliskan apa yang akan disetorkan di mutaba’ah masing-masing.</li>
            </ul>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
