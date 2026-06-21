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
              <li>Muhafiz mengarahkan santri yang hendak setoran untuk menuliskan apa yang akan disetorkan di mutaba’ah masing-masing.</li>
            </ul>
            <p className="font-bold text-xs mt-3 mb-1 italic uppercase">Aktivitas : Menyimak Setoran Per Dua Pekan</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Setiap sabtu kedua dan keempat, santri wajib menyetorkan hafalan selama dua pekan setiap periode sesuai target masing-masing.</li>
              <li>Apa yang sudah disetorkan tetap dicatat di lembar mutaba’ah dan diberi tanda di samping kolom, misal : “tasmi’ per dua pekan” atau semisalnya.</li>
              <li>Tasmi’ per dua pekan catatannya dibedakan dengan tasmi’ harian, yang berarti saat tiba tasmi’ periode kedua maka dia melanjutkan apa yang disetorkan di tasmi’ periode pertama bukan melanjutkan apa yang disetorkan di tasmi’ harian.</li>
            </ul>
            <p className="font-bold text-xs mt-3 mb-1 italic uppercase">Aktivitas : Sima’an Bacaan</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Halaqah dibuka dengan sima’an bacaan, yaitu muhafiz dan santri membaca Al-Quran bergantian saling menyimak dan memperhatikan bacaan dari setiap anggota halaqah.</li>
              <li>Target sima’an bacaan minimal 1 halam atau setiap anggota mendapat giliran bacaan.</li>
              <li>Bacaan dicatat di mutaba’ah sima’an bacaan</li>
            </ul>
          </div>
          <div className="pt-3 border-t">
            <h4 className="font-bold underline italic mb-1 uppercase text-xs">JobDesk : Mengabsen dan Input Data</h4>
            <p className="font-bold text-xs mb-1 italic uppercase">Aktivitas : Mengabsen kehadiran santri setiap halaqah</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Sebelum melakukan sima’an bacaan, muhafiz mengabsen kehadiran anggota.</li>
              <li>Setelah sima’an bacaan muhafiz kembali absen yg sekiranya terlambat atau lainnya.</li>
              <li>Ba'da isya’ luangkan waktu untuk laporan ke grup telegram sesuai format yang ditentukan.</li>
            </ul>
            <p className="font-bold text-xs mt-3 mb-1 italic uppercase">Aktivitas : Mengupdate Data Hafalan Santri</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Ba’da isya’ luangkan waktu untuk input apa yang telah disetorkan dari tasmi’ santri di hari itu ke link yang sudah ditentukan.</li>
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
