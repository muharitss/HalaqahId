import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { type Sekolah } from "@/types/domain/sekolah";

Font.register({
  family: "Helvetica",
  fonts: [],
});

export interface AbsensiPdfRow {
  no: number;
  nama_santri: string;
  nama_halaqah: string;
  hadir: number;
  izin: number;
  sakit: number;
  terlambat: number;
  alfa: number;
  persentase: number;
}

export interface AbsensiPdfStats {
  totalSantri: number;
  rataRataKehadiran: number;
  totalHadir: number;
  totalIzin: number;
  totalSakit: number;
  totalTerlambat: number;
  totalAlfa: number;
}

interface AbsensiPdfTemplateProps {
  rows: AbsensiPdfRow[];
  stats: AbsensiPdfStats;
  periodLabel: string;
  sekolah?: Sekolah | null;
  namaSekolah?: string;
  namaHalaqah?: string;
  generatedAt: string;
}

const STATUS_COLOR = {
  HADIR: "#059669",
  IZIN: "#2563eb",
  SAKIT: "#eab308",
  TERLAMBAT: "#f97316",
  ALFA: "#dc2626",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    paddingHorizontal: 36,
    paddingVertical: 36,
  },
  // ─── KOP SURAT / HEADER ───────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    borderBottom: "2px solid #0f172a",
    paddingBottom: 10,
    marginBottom: 18,
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
  // ─── SUMMARY INFO BOX ─────────────────────────────────────────────────────
  summaryContainer: {
    flexDirection: "row",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    backgroundColor: "#f8fafc",
    padding: 12,
    marginBottom: 14,
    gap: 16,
  },
  summaryCol: {
    flex: 1,
    gap: 5,
  },
  summaryField: {
    flexDirection: "row",
    fontSize: 8.5,
  },
  summaryLabel: {
    width: 100,
    color: "#64748b",
    fontFamily: "Helvetica-Bold",
  },
  summaryValue: {
    flex: 1,
    color: "#0f172a",
    fontFamily: "Helvetica",
  },
  summaryValueBold: {
    flex: 1,
    color: "#0f172a",
    fontFamily: "Helvetica-Bold",
  },
  // ─── DISTRIBUSI SECTION ───────────────────────────────────────────────────
  distribusiContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  distribusiCard: {
    flex: 1,
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    backgroundColor: "#f8fafc",
    padding: 8,
  },
  distribusiTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  distribusiRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
    gap: 5,
  },
  distribusiDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  distribusiName: {
    flex: 1,
    fontSize: 7.5,
    color: "#334155",
  },
  distribusiCount: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  // ─── SECTION TITLE ────────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
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
    backgroundColor: "#f1f5f9",
    borderBottom: "1px solid #cbd5e1",
    paddingVertical: 7,
    paddingHorizontal: 5,
  },
  tableHeaderCell: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 5,
    borderBottom: "1px solid #f1f5f9",
    alignItems: "center",
  },
  tableRowAlt: {
    backgroundColor: "#f8fafc",
  },
  tableCell: {
    fontSize: 7.5,
    color: "#334155",
  },
  tableCellBold: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  // Column widths — portrait A4 layout
  colNo:       { width: "5%" },
  colNama:     { width: "28%" },
  colHalaqah:  { width: "17%" },
  colH:        { width: "8%", textAlign: "center" as const },
  colI:        { width: "8%", textAlign: "center" as const },
  colS:        { width: "8%", textAlign: "center" as const },
  colT:        { width: "8%", textAlign: "center" as const },
  colA:        { width: "8%", textAlign: "center" as const },
  colPersen:   { width: "10%", textAlign: "center" as const },
  // ─── FOOTER ───────────────────────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    borderTop: "1px solid #e2e8f0",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 7,
    color: "#94a3b8",
  },
});

export function AbsensiPdfTemplate({
  rows,
  stats,
  periodLabel,
  sekolah,
  namaSekolah = "Halaqah ID",
  namaHalaqah = "Semua Halaqah",
  generatedAt,
}: AbsensiPdfTemplateProps) {
  // Halaman pertama: lebih sedikit baris karena ada summary & distribusi
  const ROWS_FIRST = 15;
  const ROWS_REST = 22;

  const resolvedNamaSekolah = sekolah?.nama_sekolah || namaSekolah;
  const resolvedNamaSingkat = sekolah?.nama_singkat || resolvedNamaSekolah;

  const firstPageRows = rows.slice(0, ROWS_FIRST);
  const restRows = rows.slice(ROWS_FIRST);
  const restPages: AbsensiPdfRow[][] = [];
  for (let i = 0; i < restRows.length; i += ROWS_REST) {
    restPages.push(restRows.slice(i, i + ROWS_REST));
  }

  const allPages: Array<{ rows: AbsensiPdfRow[]; isFirst: boolean }> = [
    { rows: firstPageRows, isFirst: true },
    ...restPages.map((r) => ({ rows: r, isFirst: false })),
  ];
  const totalPages = allPages.length || 1;

  const totalCatatan = stats.totalHadir + stats.totalIzin + stats.totalSakit + stats.totalTerlambat + stats.totalAlfa;

  return (
    <Document
      title={`Laporan Absensi Santri — ${periodLabel}`}
      author={resolvedNamaSekolah}
      subject="Laporan Rekapitulasi Absensi Santri"
    >
      {allPages.map((pageData, pageIdx) => (
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
                  {sekolah.no_telepon || sekolah.whatsapp || sekolah.email
                    ? "\n"
                    : ""}
                  {sekolah.no_telepon ? `Telp: ${sekolah.no_telepon}` : ""}
                  {sekolah.whatsapp ? ` · WA: ${sekolah.whatsapp}` : ""}
                  {sekolah.email ? ` · Email: ${sekolah.email}` : ""}
                </Text>
              ) : null}
              <Text style={styles.docTitle}>
                Laporan Rekapitulasi Absensi Santri
              </Text>
              <Text style={styles.periodText}>
                Periode Laporan: {periodLabel}
              </Text>
            </View>
            {sekolah?.logo_url ? <View style={{ width: 55 }} /> : null}
          </View>

          {/* ── SUMMARY & DISTRIBUSI (Hanya Halaman 1) ── */}
          {pageData.isFirst && (
            <>
              <View style={styles.summaryContainer}>
                <View style={styles.summaryCol}>
                  <View style={styles.summaryField}>
                    <Text style={styles.summaryLabel}>Periode Laporan</Text>
                    <Text style={styles.summaryValue}>{periodLabel}</Text>
                  </View>
                  <View style={styles.summaryField}>
                    <Text style={styles.summaryLabel}>Halaqah</Text>
                    <Text style={styles.summaryValue}>{namaHalaqah}</Text>
                  </View>
                  <View style={styles.summaryField}>
                    <Text style={styles.summaryLabel}>Total Santri</Text>
                    <Text style={styles.summaryValueBold}>
                      {stats.totalSantri.toLocaleString("id-ID")} Santri
                    </Text>
                  </View>
                </View>

                <View style={styles.summaryCol}>
                  <View style={styles.summaryField}>
                    <Text style={styles.summaryLabel}>Rata-rata Kehadiran</Text>
                    <Text
                      style={[styles.summaryValueBold, { color: STATUS_COLOR.HADIR }]}
                    >
                      {stats.rataRataKehadiran.toFixed(1)}%
                    </Text>
                  </View>
                  <View style={styles.summaryField}>
                    <Text style={styles.summaryLabel}>Total Presensi</Text>
                    <Text style={styles.summaryValueBold}>
                      {totalCatatan.toLocaleString("id-ID")} Catatan
                    </Text>
                  </View>
                </View>
              </View>

              {/* <View style={styles.distribusiContainer}>
                <View style={styles.distribusiCard}>
                  <Text style={styles.distribusiTitle}>
                    Distribusi Status Kehadiran
                  </Text>
                  <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
                    <View style={styles.distribusiRow}>
                      <View
                        style={[
                          styles.distribusiDot,
                          { backgroundColor: STATUS_COLOR.HADIR },
                        ]}
                      />
                      <Text style={styles.distribusiName}>Hadir</Text>
                      <Text style={styles.distribusiCount}>{stats.totalHadir}</Text>
                    </View>
                    <View style={styles.distribusiRow}>
                      <View
                        style={[
                          styles.distribusiDot,
                          { backgroundColor: STATUS_COLOR.IZIN },
                        ]}
                      />
                      <Text style={styles.distribusiName}>Izin</Text>
                      <Text style={styles.distribusiCount}>{stats.totalIzin}</Text>
                    </View>
                    <View style={styles.distribusiRow}>
                      <View
                        style={[
                          styles.distribusiDot,
                          { backgroundColor: STATUS_COLOR.SAKIT },
                        ]}
                      />
                      <Text style={styles.distribusiName}>Sakit</Text>
                      <Text style={styles.distribusiCount}>{stats.totalSakit}</Text>
                    </View>
                    <View style={styles.distribusiRow}>
                      <View
                        style={[
                          styles.distribusiDot,
                          { backgroundColor: STATUS_COLOR.TERLAMBAT },
                        ]}
                      />
                      <Text style={styles.distribusiName}>Terlambat</Text>
                      <Text style={styles.distribusiCount}>{stats.totalTerlambat}</Text>
                    </View>
                    <View style={styles.distribusiRow}>
                      <View
                        style={[
                          styles.distribusiDot,
                          { backgroundColor: STATUS_COLOR.ALFA },
                        ]}
                      />
                      <Text style={styles.distribusiName}>Alfa</Text>
                      <Text style={styles.distribusiCount}>{stats.totalAlfa}</Text>
                    </View>
                  </View>
                </View>
              </View> */}
            </>
          )}

          {/* ── SECTION TITLE ── */}
          <Text style={styles.sectionTitle}>
            Daftar Rekapitulasi Absensi
            {pageIdx > 0 ? ` (Lanjutan — Hal. ${pageIdx + 1})` : ""}
          </Text>

          {/* ── TABLE ── */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colNo]}>#</Text>
              <Text style={[styles.tableHeaderCell, styles.colNama]}>
                Nama Santri
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colHalaqah]}>
                Halaqah
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colH]}>Hadir</Text>
              <Text style={[styles.tableHeaderCell, styles.colI]}>Izin</Text>
              <Text style={[styles.tableHeaderCell, styles.colS]}>Sakit</Text>
              <Text style={[styles.tableHeaderCell, styles.colT]}>Terlambat</Text>
              <Text style={[styles.tableHeaderCell, styles.colA]}>Alfa</Text>
              <Text style={[styles.tableHeaderCell, styles.colPersen]}>
                Persen (%)
              </Text>
            </View>

            {pageData.rows.length > 0 ? (
              pageData.rows.map((row, idx) => {
                const globalIdx = pageData.isFirst
                  ? idx
                  : ROWS_FIRST +
                    (pageIdx - 1) * ROWS_REST +
                    idx;
                return (
                  <View
                    key={row.no}
                    style={[
                      styles.tableRow,
                      globalIdx % 2 === 1 ? styles.tableRowAlt : {},
                    ]}
                  >
                    <Text
                      style={[
                        styles.tableCell,
                        styles.colNo,
                        { color: "#94a3b8" },
                      ]}
                    >
                      {row.no}
                    </Text>
                    <Text style={[styles.tableCellBold, styles.colNama]}>
                      {row.nama_santri}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.colHalaqah,
                        { color: "#64748b" },
                      ]}
                    >
                      {row.nama_halaqah}
                    </Text>
                    <Text style={[styles.tableCell, styles.colH]}>{row.hadir}</Text>
                    <Text style={[styles.tableCell, styles.colI]}>{row.izin}</Text>
                    <Text style={[styles.tableCell, styles.colS]}>{row.sakit}</Text>
                    <Text style={[styles.tableCell, styles.colT]}>{row.terlambat}</Text>
                    <Text style={[styles.tableCell, styles.colA]}>{row.alfa}</Text>
                    <Text style={[styles.tableCellBold, styles.colPersen, { color: row.persentase >= 85 ? STATUS_COLOR.HADIR : STATUS_COLOR.ALFA }]}>
                      {row.persentase.toFixed(0)}%
                    </Text>
                  </View>
                );
              })
            ) : (
              <View style={{ padding: 16 }}>
                <Text
                  style={{
                    fontSize: 9,
                    color: "#94a3b8",
                    textAlign: "center",
                  }}
                >
                  Tidak ada data absensi
                </Text>
              </View>
            )}
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
