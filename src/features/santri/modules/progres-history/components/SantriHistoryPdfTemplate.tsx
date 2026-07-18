import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { type Sekolah } from "@/types/domain/sekolah";
import { format } from "date-fns";
import { type SetoranRecord } from "@/features/setoran/types";
import { type ProgresSantri } from "@/features/santri/types";
import { SATUAN_TARGET_LABELS, TIPE_TARGET_LABELS } from "@/types/domain/target";

interface SantriHistoryPdfTemplateProps {
  santri: ProgresSantri;
  history: SetoranRecord[];
  periodLabel: string;
  sekolah?: Sekolah | null;
  generatedAt: string;
}

const getKategoriColor = (kategori: string): string => {
  const normalized = (kategori || "").toUpperCase();
  if (normalized.includes("ZIYADAH") || normalized.includes("SETORAN")) return "#7c3aed";
  if (normalized.includes("MURAJAAH")) return "#2563eb";
  if (normalized.includes("HAFALAN")) return "#059669";
  if (normalized.includes("INTENS")) return "#d97706";
  if (normalized.includes("BACAAN")) return "#e11d48";
  return "#64748b"; // Fallback color
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  // ─── KOP SURAT / HEADER ───────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    borderBottom: "2px solid #0f172a",
    paddingBottom: 10,
    marginBottom: 20,
    gap: 16,
  },
  logo: {
    width: 55,
    height: 55,
    objectFit: "contain",
  },
  headerMain: {
    flex: 1,
    alignItems: "center",
  },
  schoolName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  schoolDetails: {
    fontSize: 7.5,
    color: "#475569",
    marginTop: 2,
    textAlign: "center",
    lineHeight: 1.3,
  },
  docTitle: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
    marginTop: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  periodText: {
    fontSize: 8.5,
    color: "#64748b",
    marginTop: 1,
    textAlign: "center",
  },
  // ─── STUDENT INFO BOX ─────────────────────────────────────────────────────
  studentInfoContainer: {
    flexDirection: "row",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    backgroundColor: "#f8fafc",
    padding: 12,
    marginBottom: 20,
    gap: 20,
  },
  infoCol: {
    flex: 1,
    gap: 4,
  },
  infoField: {
    flexDirection: "row",
    fontSize: 8.5,
  },
  infoLabel: {
    width: 80,
    color: "#64748b",
    fontFamily: "Helvetica-Bold",
  },
  infoValue: {
    flex: 1,
    color: "#0f172a",
    fontFamily: "Helvetica",
  },
  infoValueBold: {
    flex: 1,
    color: "#0f172a",
    fontFamily: "Helvetica-Bold",
  },
  // ─── SECTION TITLE ────────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  // ─── TABLE ────────────────────────────────────────────────────────────────
  table: {
    width: "100%",
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #cbd5e1",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderBottom: "1px solid #f1f5f9",
    alignItems: "center",
  },
  tableRowAlt: {
    backgroundColor: "#f8fafc",
  },
  tableCell: {
    fontSize: 8,
    color: "#334155",
  },
  tableCellBold: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  tableCellMuted: {
    fontSize: 7,
    color: "#94a3b8",
  },
  colNo: { width: "5%" },
  colTanggal: { width: "15%" },
  colMateri: { width: "40%" },
  colKategori: { width: "15%" },
  colTaqwim: { width: "10%", textAlign: "center" },
  colKet: { width: "15%" },
  
  // ─── BADGES ───────────────────────────────────────────────────────────────
  kategoriBadge: {
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  kategoriBadgeText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
  },
  taqwimText: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
  },
  // ─── SIGNATURES ───────────────────────────────────────────────────────────
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    paddingHorizontal: 20,
  },
  signatureCol: {
    alignItems: "center",
    width: 140,
  },
  signatureLabel: {
    fontSize: 8.5,
    color: "#475569",
    marginBottom: 45,
    fontFamily: "Helvetica-Bold",
  },
  signatureName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    borderBottom: "1px solid #475569",
    paddingBottom: 2,
    width: "100%",
    textAlign: "center",
  },
  signatureRole: {
    fontSize: 7.5,
    color: "#64748b",
    marginTop: 2,
  },
  // ─── FOOTER ───────────────────────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: "1px solid #e2e8f0",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 7.5,
    color: "#94a3b8",
  },
});

function KategoriPill({ kategori }: { kategori: string }) {
  const color = getKategoriColor(kategori);
  return (
    <View style={[styles.kategoriBadge, { backgroundColor: color + "20" }]}>
      <Text style={[styles.kategoriBadgeText, { color }]}>{kategori}</Text>
    </View>
  );
}

export function SantriHistoryPdfTemplate({
  santri,
  history,
  periodLabel,
  sekolah,
  generatedAt,
}: SantriHistoryPdfTemplateProps) {
  const ROWS_PER_PAGE = 18;
  const totalPages = Math.ceil(history.length / ROWS_PER_PAGE) || 1;

  const resolvedNamaSekolah = sekolah?.nama_sekolah || "Halaqah ID";
  const resolvedNamaSingkat = sekolah?.nama_singkat || resolvedNamaSekolah;

  const pages = Array.from({ length: totalPages }, (_, i) =>
    history.slice(i * ROWS_PER_PAGE, (i + 1) * ROWS_PER_PAGE)
  );

  const targetLabel = santri.target
    ? `${santri.target.nilai_target} ${SATUAN_TARGET_LABELS[santri.target.satuan as keyof typeof SATUAN_TARGET_LABELS] ?? santri.target.satuan} / ${TIPE_TARGET_LABELS[santri.target.tipe as keyof typeof TIPE_TARGET_LABELS]?.toLowerCase() ?? santri.target.tipe.toLowerCase()}`
    : "Tanpa Target";

  const totalTaqwim = history.reduce((sum, s) => sum + (s.taqwim ?? 0), 0);
  const rataRataTaqwim = history.length > 0 ? (totalTaqwim / history.length) : 0;
  const taqwimTextLabel = rataRataTaqwim === 0 ? "Sempurna" : rataRataTaqwim <= 2 ? "Baik" : "Perlu Perbaikan";
  const taqwimColor = rataRataTaqwim === 0 ? "#059669" : rataRataTaqwim <= 2 ? "#d97706" : "#dc2626";

  const totalBaris = history.reduce((sum, s) => sum + (s.total_baris ?? s.totalBaris ?? 0), 0);
  const totalHalamanData = history.reduce((sum, s) => {
    const startPage = s.start_page ?? s.startPage;
    const endPage = s.end_page ?? s.endPage;
    if (startPage && endPage) {
      return sum + (endPage - startPage + 1);
    }
    return sum;
  }, 0);
  const estimasiHalaman = totalBaris > 0 ? Math.ceil(totalBaris / 15) : 0;
  const displayTotalHalaman = totalHalamanData > 0 ? totalHalamanData : estimasiHalaman;

  return (
    <Document
      title={`Laporan Riwayat Hafalan — ${santri.nama_santri}`}
      author={resolvedNamaSekolah}
      subject="Laporan Riwayat Setoran Tahfiz Santri"
    >
      {pages.map((pageRows, pageIdx) => (
        <Page key={pageIdx} size="A4" style={styles.page}>
          {/* ── KOP SURAT ── */}
          <View style={styles.header}>
            {sekolah?.logo_url ? (
              <Image src={sekolah.logo_url} style={styles.logo} />
            ) : null}
            <View style={styles.headerMain}>
              <Text style={styles.schoolName}>{resolvedNamaSekolah}</Text>
              {sekolah ? (
                <Text style={styles.schoolDetails}>
                  {sekolah.alamat ? sekolah.alamat : ""}
                  {sekolah.kota ? ` · ${sekolah.kota}` : ""}
                  {sekolah.provinsi ? ` · ${sekolah.provinsi}` : ""}
                  {sekolah.no_telepon || sekolah.whatsapp || sekolah.email ? "\n" : ""}
                  {sekolah.no_telepon ? `Telp: ${sekolah.no_telepon}` : ""}
                  {sekolah.whatsapp ? ` · WA: ${sekolah.whatsapp}` : ""}
                  {sekolah.email ? ` · Email: ${sekolah.email}` : ""}
                </Text>
              ) : null}
              <Text style={styles.docTitle}>Laporan Riwayat Setoran Hafalan Santri</Text>
              <Text style={styles.periodText}>Periode Target: {periodLabel}</Text>
            </View>
            {sekolah?.logo_url ? (
              <View style={{ width: 55 }} />
            ) : null}
          </View>

          {/* ── INFO BOX (Only Page 1) ── */}
          {pageIdx === 0 && (
            <View style={styles.studentInfoContainer}>
              <View style={styles.infoCol}>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Nama Santri</Text>
                  <Text style={styles.infoValueBold}>{santri.nama_santri.toUpperCase()}</Text>
                </View>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Halaqah</Text>
                  <Text style={styles.infoValue}>{santri.nama_halaqah}</Text>
                </View>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Target Aktif</Text>
                  <Text style={styles.infoValue}>{targetLabel}</Text>
                </View>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Capaian Progres</Text>
                  <Text style={styles.infoValueBold}>
                    {santri.target ? `${santri.progres.capaian} dari ${santri.target.nilai_target} (${santri.progres.persentase}%)` : "—"}
                  </Text>
                </View>
              </View>

              <View style={styles.infoCol}>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Total Setoran</Text>
                  <Text style={styles.infoValueBold}>{history.length} Kali</Text>
                </View>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Total Halaman</Text>
                  <Text style={styles.infoValueBold}>{displayTotalHalaman} Halaman</Text>
                </View>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Total Baris</Text>
                  <Text style={styles.infoValueBold}>{totalBaris} Baris</Text>
                </View>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Rata-rata Taqwim</Text>
                  <Text style={[styles.infoValueBold, { color: taqwimColor }]}>
                    {rataRataTaqwim.toFixed(1)} ({taqwimTextLabel})
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* ── TABLE TITLE ── */}
          <Text style={styles.sectionTitle}>
            Rincian Riwayat Setoran {pageIdx > 0 ? `(Lanjutan — Hal. ${pageIdx + 1})` : ""}
          </Text>

          {/* ── HISTORY TABLE ── */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colNo]}>#</Text>
              <Text style={[styles.tableHeaderCell, styles.colTanggal]}>Tanggal</Text>
              <Text style={[styles.tableHeaderCell, styles.colMateri]}>Materi Setoran</Text>
              <Text style={[styles.tableHeaderCell, styles.colKategori]}>Kategori</Text>
              <Text style={[styles.tableHeaderCell, styles.colTaqwim, { textAlign: "center" }]}>Taqwim</Text>
              <Text style={[styles.tableHeaderCell, styles.colKet]}>Keterangan</Text>
            </View>

            {pageRows.map((row, idx) => {
              const startPage = row.start_page ?? row.startPage;
              const endPage = row.end_page ?? row.endPage;
              const totalBaris = row.total_baris ?? row.totalBaris;
              const catName = typeof row.kategori === "object" && row.kategori ? row.kategori.nama_kategori : (row.kategori || "HAFALAN");

              return (
                <View
                  key={row.id_setoran}
                  style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}
                >
                  <Text style={[styles.tableCell, styles.colNo, { color: "#94a3b8" }]}>
                    {pageIdx * ROWS_PER_PAGE + idx + 1}
                  </Text>
                  
                  <View style={styles.colTanggal}>
                    <Text style={styles.tableCellBold}>
                      {format(new Date(row.tanggal_setoran), "dd/MM/yyyy")}
                    </Text>
                    <Text style={styles.tableCellMuted}>
                      {format(new Date(row.tanggal_setoran), "HH:mm")}
                    </Text>
                  </View>

                  <View style={styles.colMateri}>
                    <Text style={styles.tableCellBold}>
                      Juz {row.juz}: {row.surat}
                    </Text>
                    <Text style={styles.tableCellMuted}>
                      Ayat {row.ayat}
                      {startPage && (
                        ` · Hal ${startPage === endPage ? startPage : `${startPage}-${endPage}`} (${totalBaris} baris)`
                      )}
                    </Text>
                  </View>

                  <View style={styles.colKategori}>
                    <KategoriPill kategori={catName} />
                  </View>

                  <View style={[styles.colTaqwim, { alignItems: "center" }]}>
                    <Text style={[styles.taqwimText, { color: row.taqwim === 0 ? "#059669" : row.taqwim <= 2 ? "#d97706" : "#dc2626" }]}>
                      {row.taqwim}
                    </Text>
                  </View>

                  <Text style={[styles.tableCell, styles.colKet, { color: "#94a3b8" }]}>
                    {row.keterangan || "—"}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* ── FOOTER ── */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Dicetak pada: {generatedAt} · {resolvedNamaSingkat}
            </Text>
            <Text style={styles.footerText}>
              Halaman {pageIdx + 1} dari {totalPages}
            </Text>
          </View>
        </Page>
      ))}
    </Document>
  );
}
