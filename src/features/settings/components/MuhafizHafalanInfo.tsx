import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function MuhafizHafalanInfo() {
  return (
    <AccordionItem value="muhafiz-hafalan">
      <AccordionTrigger className="text-base font-semibold hover:no-underline uppercase text-primary text-left">
        Muhafiz Hafalan
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4 pt-2 pb-6 text-balance leading-relaxed text-sm">
        <div className="space-y-4">
          <div>
            <h4 className="font-bold underline italic mb-1 uppercase text-xs">JobDesk : Menyimak Setoran Hafalan Santri</h4>
            <p className="font-bold text-xs mb-1 italic uppercase">Aktivitas : Menyimak Setoran</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Muhafiz menyimak setoran hafalan santri dengan target 2 santri per pekan.</li>
              <li>Muhafiz dapat memperbantukan santri pilihan untuk membantu menyimak setoran.</li>
              <li>Muhafiz mengarahkan santri yang hendak setoran untuk menuliskan apa yang akan disetorkan di mutabaâ€™ah masing-masing.</li>
            </ul>
            <p className="font-bold text-xs mt-3 mb-1 italic uppercase">Aktivitas : Menyimak Setoran Per Dua Pekan</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Setiap sabtu kedua dan keempat, santri wajib menyetorkan hafalan selama dua pekan setiap periode sesuai target masing-masing.</li>
              <li>Apa yang sudah disetorkan tetap dicatat di lembar mutabaâ€™ah dan diberi tanda di samping kolom, misal : â€œtasmiâ€™ per dua pekanâ€ atau semisalnya.</li>
              <li>Tasmiâ€™ per dua pekan catatannya dibedakan dengan tasmiâ€™ harian, yang berarti saat tiba tasmiâ€™ periode kedua maka dia melanjutkan apa yang disetorkan di tasmiâ€™ periode pertama bukan melanjutkan apa yang disetorkan di tasmiâ€™ harian.</li>
            </ul>
            <p className="font-bold text-xs mt-3 mb-1 italic uppercase">Aktivitas : Simaâ€™an Bacaan</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Halaqah dibuka dengan simaâ€™an bacaan, yaitu muhafiz dan santri membaca Al-Quran bergantian saling menyimak dan memperhatikan bacaan dari setiap anggota halaqah.</li>
              <li>Target simaâ€™an bacaan minimal 1 halam atau setiap anggota mendapat giliran bacaan.</li>
              <li>Bacaan dicatat di mutabaâ€™ah simaâ€™an bacaan</li>
            </ul>
          </div>
          <div className="pt-3 border-t">
            <h4 className="font-bold underline italic mb-1 uppercase text-xs">JobDesk : Mengabsen dan Input Data</h4>
            <p className="font-bold text-xs mb-1 italic uppercase">Aktivitas : Mengabsen kehadiran santri setiap halaqah</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Sebelum melakukan simaâ€™an bacaan, muhafiz mengabsen kehadiran anggota.</li>
              <li>Setelah simaâ€™an bacaan muhafiz kembali absen yg sekiranya terlambat atau lainnya.</li>
              <li>Ba'da isyaâ€™ luangkan waktu untuk laporan ke grup telegram sesuai format yang ditentukan.</li>
            </ul>
            <p className="font-bold text-xs mt-3 mb-1 italic uppercase">Aktivitas : Mengupdate Data Hafalan Santri</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Baâ€™da isyaâ€™ luangkan waktu untuk input apa yang telah disetorkan dari tasmiâ€™ santri di hari itu ke link yang sudah ditentukan.</li>
              <li>Setiap bulan, muhafiz mengisi raport target setoran setiap anggota perihal ketercapaian target yang sudah ditentukan untuk tiap bulan</li>
            </ul>
          </div>
          <div className="pt-3 border-t">
            <h4 className="font-bold underline italic mb-1 uppercase text-xs">JobDesk : Evaluasi</h4>
            <p className="font-bold text-xs mb-1 italic uppercase">Aktivitas : Evaluasi Halaqah</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Muhafiz mengambil satu pertemuan untuk setiap bulannya untuk mengevaluasi anggotanya; santri yang sudah sesuai target dimotivasi / di challange dan yang belum sesuai target diingatkan dan dimotivasi</li>
              <li>Muhafiz melaporkan perkembangan setiap santri anggotanya di rapat bulanan muhafiz</li>
            </ul>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
