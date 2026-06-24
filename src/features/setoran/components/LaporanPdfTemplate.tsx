import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

// Register font (system font fallback)
Font.register({
  family: "Helvetica",
  fonts: [],
});

interface SetoranPdfRow {
  no: number;
  tanggal: string;
  nama_santri: string;
  nama_halaqah: string;
  juz: number;
  surat: string;
  ayat: string;
  kategori: string;
  taqwim: number;
  keterangan?: string;
}

interface PdfStats {
  totalSetoran: number;
  totalSantriAktif: number;
  rataRataTaqwim: number;
  kategoriDominan: string;
  distribusiKategori: Record<string, number>;
}

interface LaporanPdfTemplateProps {
  rows: SetoranPdfRow[];
  stats: PdfStats;
  periodLabel: string;
  namaSekolah?: string;
  namaHalaqah?: string;
  generatedAt: string;
}

const KATEGORI_COLOR: Record<string, string> = {
  HAFALAN: "#059669",
  MURAJAAH: "#2563eb",
  ZIYADAH: "#7c3aed",
  INTENS: "#d97706",
  BACAAN: "#e11d48",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    padding: 0,
  },
  // ─── HEADER ───────────────────────────────────────────────────────────────
  header: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 36,
    paddingVertical: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 9,
    color: "#94a3b8",
    marginTop: 3,
    letterSpacing: 0.3,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerBadge: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  headerBadgeText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  headerDate: {
    fontSize: 7.5,
    color: "#64748b",
    marginTop: 4,
  },
  // ─── CONTENT ──────────────────────────────────────────────────────────────
  content: {
    paddingHorizontal: 36,
    paddingVertical: 20,
    flex: 1,
  },
  // ─── INFO SECTION ─────────────────────────────────────────────────────────
  infoRow: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  infoItem: {
    flex: 1,
    borderLeft: "3px solid #3b82f6",
    paddingLeft: 8,
    paddingVertical: 2,
  },
  infoLabel: {
    fontSize: 7.5,
    color: "#64748b",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
    marginTop: 2,
  },
  // ─── KPI CARDS ────────────────────────────────────────────────────────────
  kpiSection: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
  },
  kpiValue: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
  },
  kpiLabel: {
    fontSize: 7,
    color: "#64748b",
    textAlign: "center",
    marginTop: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  kpiSub: {
    fontSize: 7.5,
    color: "#94a3b8",
    marginTop: 2,
    textAlign: "center",
  },
  // ─── SECTION TITLE ────────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    paddingBottom: 6,
    borderBottom: "1.5px solid #e2e8f0",
  },
  // ─── TABLE ────────────────────────────────────────────────────────────────
  table: {
    width: "100%",
    borderRadius: 6,
    overflow: "hidden",
    border: "1px solid #e2e8f0",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    paddingVertical: 7,
    paddingHorizontal: 4,
  },
  tableHeaderCell: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottom: "1px solid #f1f5f9",
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
    color: "#1e293b",
  },
  tableCellMuted: {
    fontSize: 7,
    color: "#94a3b8",
    marginTop: 1,
  },
  // Column widths
  colNo: { width: "4%" },
  colTanggal: { width: "11%" },
  colNama: { width: "20%" },
  colHalaqah: { width: "13%" },
  colMateri: { width: "22%" },
  colKategori: { width: "13%" },
  colTaqwim: { width: "8%" },
  colKet: { width: "9%" },
  // ─── KATEGORI BADGE ───────────────────────────────────────────────────────
  kategoriBadge: {
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  kategoriBadgeText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
  },
  // ─── DISTRIBUSI SECTION ───────────────────────────────────────────────────
  distribusiRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 16,
  },
  distribusiItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  distribusiDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  distribusiText: {
    fontSize: 7.5,
    color: "#334155",
  },
  distribusiCount: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
    marginLeft: 2,
  },
  // ─── FOOTER ───────────────────────────────────────────────────────────────
  footer: {
    backgroundColor: "#f8fafc",
    borderTop: "1px solid #e2e8f0",
    paddingHorizontal: 36,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerLeft: {
    fontSize: 7.5,
    color: "#94a3b8",
  },
  footerRight: {
    fontSize: 7.5,
    color: "#94a3b8",
    fontFamily: "Helvetica-Bold",
  },
  watermark: {
    fontSize: 7,
    color: "#cbd5e1",
    textAlign: "center",
    marginTop: 2,
  },
});

function KategoriPill({ kategori }: { kategori: string }) {
  const color = KATEGORI_COLOR[kategori] ?? "#64748b";
  return (
    <View style={[styles.kategoriBadge, { backgroundColor: color + "20" }]}>
      <Text style={[styles.kategoriBadgeText, { color }]}>{kategori}</Text>
    </View>
  );
}

function TaqwimText({ value }: { value: number }) {
  const color =
    value === 0 ? "#059669" : value <= 2 ? "#d97706" : "#dc2626";
  return (
    <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color }}>
      {value}
    </Text>
  );
}

export function LaporanPdfTemplate({
  rows,
  stats,
  periodLabel,
  namaSekolah = "Halaqah ID",
  namaHalaqah = "Semua Halaqah",
  generatedAt,
}: LaporanPdfTemplateProps) {
  const ROWS_PER_PAGE = 22;
  const totalPages = Math.ceil(rows.length / ROWS_PER_PAGE) || 1;

  const pages = Array.from({ length: totalPages }, (_, i) =>
    rows.slice(i * ROWS_PER_PAGE, (i + 1) * ROWS_PER_PAGE)
  );

  return (
    <Document
      title={`Laporan Setoran — ${periodLabel}`}
      author={namaSekolah}
      subject="Laporan Setoran Hafalan"
    >
      {pages.map((pageRows, pageIdx) => (
        <Page key={pageIdx} size="A4" orientation="landscape" style={styles.page}>
          {/* ── HEADER ── */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>LAPORAN SETORAN HAFALAN</Text>
              <Text style={styles.headerSubtitle}>
                {namaSekolah} · {namaHalaqah} · {periodLabel}
              </Text>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>LAPORAN RESMI</Text>
              </View>
              <Text style={styles.headerDate}>
                Dicetak: {generatedAt} · Hal. {pageIdx + 1}/{totalPages}
              </Text>
            </View>
          </View>

          {/* ── CONTENT ── */}
          <View style={styles.content}>
            {/* Hanya tampilkan info & KPI di halaman pertama */}
            {pageIdx === 0 && (
              <>
                {/* Info row */}
                <View style={styles.infoRow}>
                  <View style={[styles.infoItem, { borderLeftColor: "#3b82f6" }]}>
                    <Text style={styles.infoLabel}>Periode Laporan</Text>
                    <Text style={styles.infoValue}>{periodLabel}</Text>
                  </View>
                  <View style={[styles.infoItem, { borderLeftColor: "#10b981" }]}>
                    <Text style={styles.infoLabel}>Halaqah</Text>
                    <Text style={styles.infoValue}>{namaHalaqah}</Text>
                  </View>
                  <View style={[styles.infoItem, { borderLeftColor: "#8b5cf6" }]}>
                    <Text style={styles.infoLabel}>Lembaga</Text>
                    <Text style={styles.infoValue}>{namaSekolah}</Text>
                  </View>
                </View>

                {/* KPI Cards */}
                <View style={styles.kpiSection}>
                  <View style={styles.kpiCard}>
                    <Text style={styles.kpiValue}>{stats.totalSetoran}</Text>
                    <Text style={styles.kpiLabel}>Total Setoran</Text>
                  </View>
                  <View style={styles.kpiCard}>
                    <Text style={styles.kpiValue}>{stats.totalSantriAktif}</Text>
                    <Text style={styles.kpiLabel}>Santri Aktif</Text>
                  </View>
                  <View style={styles.kpiCard}>
                    <Text
                      style={[
                        styles.kpiValue,
                        {
                          color:
                            stats.rataRataTaqwim === 0
                              ? "#059669"
                              : stats.rataRataTaqwim <= 2
                                ? "#d97706"
                                : "#dc2626",
                        },
                      ]}
                    >
                      {stats.rataRataTaqwim.toFixed(1)}
                    </Text>
                    <Text style={styles.kpiLabel}>Rata-rata Taqwim</Text>
                    <Text style={styles.kpiSub}>
                      {stats.rataRataTaqwim === 0
                        ? "Sempurna"
                        : stats.rataRataTaqwim <= 2
                          ? "Baik"
                          : "Perlu Perbaikan"}
                    </Text>
                  </View>
                  <View style={[styles.kpiCard, { borderLeftColor: KATEGORI_COLOR[stats.kategoriDominan] ?? "#64748b" }]}>
                    <Text
                      style={[
                        styles.kpiValue,
                        { fontSize: 13, color: KATEGORI_COLOR[stats.kategoriDominan] ?? "#1e293b" },
                      ]}
                    >
                      {stats.kategoriDominan || "—"}
                    </Text>
                    <Text style={styles.kpiLabel}>Kategori Dominan</Text>
                  </View>
                </View>

                {/* Distribusi kategori */}
                <View style={styles.distribusiRow}>
                  {Object.entries(stats.distribusiKategori).map(([k, v]) => (
                    <View key={k} style={styles.distribusiItem}>
                      <View style={[styles.distribusiDot, { backgroundColor: KATEGORI_COLOR[k] ?? "#94a3b8" }]} />
                      <Text style={styles.distribusiText}>{k}:</Text>
                      <Text style={styles.distribusiCount}>{v}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Section title */}
            <Text style={styles.sectionTitle}>
              Rincian Setoran {pageIdx > 0 ? `(Lanjutan — Hal. ${pageIdx + 1})` : ""}
            </Text>

            {/* Table */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.colNo]}>#</Text>
                <Text style={[styles.tableHeaderCell, styles.colTanggal]}>Tanggal</Text>
                <Text style={[styles.tableHeaderCell, styles.colNama]}>Nama Santri</Text>
                <Text style={[styles.tableHeaderCell, styles.colHalaqah]}>Halaqah</Text>
                <Text style={[styles.tableHeaderCell, styles.colMateri]}>Materi</Text>
                <Text style={[styles.tableHeaderCell, styles.colKategori]}>Kategori</Text>
                <Text style={[styles.tableHeaderCell, styles.colTaqwim, { textAlign: "center" }]}>Taqwim</Text>
                <Text style={[styles.tableHeaderCell, styles.colKet]}>Keterangan</Text>
              </View>

              {pageRows.length > 0 ? (
                pageRows.map((row, idx) => {
                  const globalIdx = pageIdx * ROWS_PER_PAGE + idx;
                  return (
                    <View
                      key={row.no}
                      style={[styles.tableRow, globalIdx % 2 === 1 ? styles.tableRowAlt : {}]}
                    >
                      <Text style={[styles.tableCell, styles.colNo, { color: "#94a3b8" }]}>
                        {row.no}
                      </Text>
                      <View style={styles.colTanggal}>
                        <Text style={styles.tableCell}>
                          {format(new Date(row.tanggal), "dd/MM/yyyy", { locale: idLocale })}
                        </Text>
                        <Text style={styles.tableCellMuted}>
                          {format(new Date(row.tanggal), "HH:mm")}
                        </Text>
                      </View>
                      <Text style={[styles.tableCellBold, styles.colNama]}>
                        {row.nama_santri}
                      </Text>
                      <Text style={[styles.tableCell, styles.colHalaqah, { color: "#64748b" }]}>
                        {row.nama_halaqah}
                      </Text>
                      <View style={styles.colMateri}>
                        <Text style={styles.tableCellBold}>
                          Juz {row.juz} — {row.surat}
                        </Text>
                        <Text style={styles.tableCellMuted}>Ayat {row.ayat}</Text>
                      </View>
                      <View style={styles.colKategori}>
                        <KategoriPill kategori={row.kategori} />
                      </View>
                      <View style={[styles.colTaqwim, { alignItems: "center" }]}>
                        <TaqwimText value={row.taqwim} />
                      </View>
                      <Text style={[styles.tableCell, styles.colKet, { color: "#94a3b8", fontSize: 7 }]}>
                        {row.keterangan ?? "—"}
                      </Text>
                    </View>
                  );
                })
              ) : (
                <View style={{ padding: 16 }}>
                  <Text style={{ fontSize: 9, color: "#94a3b8", textAlign: "center" }}>
                    Tidak ada data setoran
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* ── FOOTER ── */}
          <View style={styles.footer}>
            <Text style={styles.footerLeft}>
              {namaSekolah} · Laporan Setoran Hafalan · {periodLabel}
            </Text>
            <Text style={styles.watermark}>
              Dokumen ini dibuat secara otomatis oleh sistem Halaqah ID
            </Text>
            <Text style={styles.footerRight}>
              Halaman {pageIdx + 1} / {totalPages}
            </Text>
          </View>
        </Page>
      ))}
    </Document>
  );
}
