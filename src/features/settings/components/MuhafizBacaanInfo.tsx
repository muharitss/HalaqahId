import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function MuhafizBacaanInfo() {
  return (
    <AccordionItem value="muhafiz-bacaan">
      <AccordionTrigger className="text-base font-semibold hover:no-underline uppercase text-primary text-left">
        Muhafiz Bacaan
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4 pt-2 pb-6 text-balance leading-relaxed text-sm">
        <div className="space-y-4">
          <div>
            <h4 className="font-bold underline italic mb-1 uppercase text-xs">JobDesk : Mentahsin Bacaan Santri</h4>
            <p className="font-bold text-xs mb-1 italic uppercase">Aktivitas : Mengajari Baca Qur`an</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Mentalqin bacaan santri pada juz target (30, 29, 28)</li>
              <li>Muhafiz menyimak bacaan yang sudah ditalqinkan.</li>
              <li>Muhafiz mengarahkan santri menuliskan sampai mana bacaan yang sudah di storkan</li>
            </ul>
            <p className="font-bold text-xs mt-3 mb-1 italic uppercase">Aktivitas : Menyimak Setoran Per Dua Pekan</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Setiap sabtu kedua dan keempat, Muhafiz harus mengadakan tes bacaan dari apa yang sudah ditalqinkan.</li>
              <li>Muhafiz menentukan secara acak ayat-ayat yang sudah ditalqinkan untuk dibaca oleh setiap santri sebagai bentuk tes kemajuan kemampuan mereka.</li>
            </ul>
          </div>
          <div className="pt-3 border-t">
            <h4 className="font-bold underline italic mb-1 uppercase text-xs">JobDesk : Mengabsen dan Input Data</h4>
            <p className="font-bold text-xs mb-1 italic uppercase">Aktivitas : Mengabsen kehadiran santri setiap halaqah</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Setelah muqaddimah dan do’a, Muhafiz mengabsen kehadiran anggota.</li>
              <li>Ba'da isya’ luangkan waktu untuk laporan ke grup telegram sesuai format yang ditentukan.</li>
            </ul>
            <p className="font-bold text-xs mt-3 mb-1 italic uppercase">Aktivitas : Mengupdate Peningkatan Bacaan Santri</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Ba’da isya’ luangkan waktu untuk input apa yang telah disetorkan dari tasmi’ santri di hari itu ke link yang sudah ditentukan.</li>
              <li>Setiap bulan, muhafiz mengisi raport target setoran setiap anggota perihal ketercapaian target yang sudah ditentukan untuk tiap bulan.</li>
            </ul>
          </div>
          <div className="pt-3 border-t">
            <h4 className="font-bold underline italic mb-1 uppercase text-xs">JobDesk : Evaluasi</h4>
            <p className="font-bold text-xs mb-1 italic uppercase">Aktivitas : Evaluasi Halaqah</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Muhafiz mengambil satu pertemuan untuk setiap bulannya untuk mengevaluasi anggotanya; santri yang sudah sesuai target dimotivasi / di challange dan yang belum sesuai target diingatkan dan dimotivasi</li>
              <li>Muhafiz melaporkan perkembangan setiap santri anggotanya di rapat bulanan muhafiz.</li>
            </ul>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
