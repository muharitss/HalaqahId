import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function MuhafizKhususInfo() {
  return (
    <AccordionItem value="muhafiz-khusus">
      <AccordionTrigger className="text-base font-semibold hover:no-underline uppercase text-primary text-left">
        Muhafiz Halaqah Khusus
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4 pt-2 pb-6 text-balance leading-relaxed text-sm">
        <div className="space-y-4">
          <div>
            <h4 className="font-bold underline italic mb-1 uppercase text-xs">JobDesk : Menyimak Setoran Hafalan Santri</h4>
            <p className="font-bold text-xs mb-1 italic uppercase">Aktivitas : Menyimak Setoran</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Muhafiz menyimak setoran hafalan santri dengan setiap santri harus setoran di setiap pertemuan.</li>
              <li>Muhafiz dapat memperbantukan santri pilihan untuk membantu menyimak setoran.</li>
              <li>Muhafiz mengarahkan santri yang hendak setoran untuk menuliskan apa yang akan disetorkan di mutabaâ€™ah masing-masing.</li>
            </ul>
            <p className="font-bold text-xs mt-3 mb-1 italic uppercase">Aktivitas : Menyimak Setoran Sekali Duduk</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Jika terdapat santri yang hendak menyetorkan juz`iyyah (per juz) sekali duduk segera laporkan ke koordinator untuk segera dipersiapkan fasilitas yang diperlukan.</li>
            </ul>
          </div>
          <div className="pt-3 border-t">
            <h4 className="font-bold underline italic mb-1 uppercase text-xs">JobDesk : Mengabsen dan Input Data</h4>
            <p className="font-bold text-xs mb-1 italic uppercase">Aktivitas : Mengabsen Kehadiran Santri Setiap Halaqah</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Sebelum melakukan setoran hafalan, muhafidz mengabsen kehadiran setiap anggota.</li>
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
