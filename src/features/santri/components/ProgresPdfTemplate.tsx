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

// Register font (system font fallback)
Font.register({
  family: "Helvetica",
  fonts: [],
});

export interface ProgresPdfRow {
  no: number;
  nama_santri: string;
  nama_halaqah: string;
  target: string;
  capaian: string;
  persentase: number;
  status: string;
}

interface PdfStats {
  total: number;
  tercapai: number;
  dalamProses: number;
  belumMulai: number;
  bebas: number;
}

interface ProgresPdfTemplateProps {
  rows: ProgresPdfRow[];
  stats: PdfStats;
  periodLabel: string;
  sekolah?: Sekolah | null;
  namaSekolah?: string;
  namaHalaqah?: string;
  generatedAt: string;
}

const STATUS_COLOR: Record<string, string> = {
  TERCAPAI: "#059669",
  DALAM_PROSES: "#2563eb",
  BELUM_MULAI: "#64748b",
  BEBAS: "#7c3aed",
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
    width: 90,
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
  // Column widths
  colNo: { width: "5%" },
  colNama: { width: "25%" },
  colHalaqah: { width: "15%" },
  colTarget: { width: "20%" },
  colCapaian: { width: "12%" },
  colPersen: { width: "10%" },
  colStatus: { width: "13%" },
  // ─── STATUS BADGE ─────────────────────────────────────────────────────────
  statusBadge: {
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  statusBadgeText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
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

function StatusPill({ status, label }: { status: string; label: string }) {
  const color = STATUS_COLOR[status.toUpperCase()] ?? "#64748b";
  return (
    <View style={[styles.statusBadge, { backgroundColor: color + "20" }]}>
      <Text style={[styles.statusBadgeText, { color }]}>{label}</Text>
    </View>
  );
}

export function ProgresPdfTemplate({
  rows,
  stats,
  periodLabel,
  sekolah,
  namaSekolah = "Halaqah ID",
  namaHalaqah = "Semua Halaqah",
  generatedAt,
}: ProgresPdfTemplateProps) {
  const ROWS_PER_PAGE = 22;
  const totalPages = Math.ceil(rows.length / ROWS_PER_PAGE) || 1;

  const resolvedNamaSekolah = sekolah?.nama_sekolah || namaSekolah;
  const resolvedNamaSingkat = sekolah?.nama_singkat || resolvedNamaSekolah;

  const pages = Array.from({ length: totalPages }, (_, i) =>
    rows.slice(i * ROWS_PER_PAGE, (i + 1) * ROWS_PER_PAGE)
  );

  const getStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case "TERCAPAI": return "Tercapai";
      case "DALAM_PROSES": return "Dalam Proses";
      case "BELUM_MULAI": return "Belum Mulai";
      case "BEBAS": return "Tanpa Target";
      default: return status;
    }
  };

  return (
    <Document
      title={`Laporan Progres Hafalan — ${periodLabel}`}
      author={resolvedNamaSekolah}
      subject="Laporan Progres Hafalan Santri"
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
              <Text style={styles.docTitle}>Laporan Progres Hafalan Santri</Text>
              <Text style={styles.periodText}>Periode Laporan: {periodLabel}</Text>
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
                  <Text style={styles.infoLabel}>Periode Laporan</Text>
                  <Text style={styles.infoValue}>{periodLabel}</Text>
                </View>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Halaqah</Text>
                  <Text style={styles.infoValue}>{namaHalaqah}</Text>
                </View>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Total Santri</Text>
                  <Text style={styles.infoValueBold}>{stats.total} Orang</Text>
                </View>
              </View>

              <View style={styles.infoCol}>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Target Tercapai</Text>
                  <Text style={[styles.infoValueBold, { color: "#059669" }]}>
                    {stats.tercapai} Santri
                  </Text>
                </View>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Dalam Proses</Text>
                  <Text style={[styles.infoValueBold, { color: "#2563eb" }]}>
                    {stats.dalamProses} Santri
                  </Text>
                </View>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Belum Mulai</Text>
                  <Text style={[styles.infoValueBold, { color: "#64748b" }]}>
                    {stats.belumMulai} Santri
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Section title */}
          <Text style={styles.sectionTitle}>
            Daftar Progres Santri {pageIdx > 0 ? `(Lanjutan — Hal. ${pageIdx + 1})` : ""}
          </Text>

          {/* Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colNo]}>#</Text>
              <Text style={[styles.tableHeaderCell, styles.colNama]}>Nama Santri</Text>
              <Text style={[styles.tableHeaderCell, styles.colHalaqah]}>Halaqah</Text>
              <Text style={[styles.tableHeaderCell, styles.colTarget]}>Target Aktif</Text>
              <Text style={[styles.tableHeaderCell, styles.colCapaian]}>Capaian</Text>
              <Text style={[styles.tableHeaderCell, styles.colPersen, { textAlign: "center" }]}>Persen</Text>
              <Text style={[styles.tableHeaderCell, styles.colStatus]}>Status</Text>
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
                    <Text style={[styles.tableCellBold, styles.colNama]}>
                      {row.nama_santri}
                    </Text>
                    <Text style={[styles.tableCell, styles.colHalaqah, { color: "#64748b" }]}>
                      {row.nama_halaqah}
                    </Text>
                    <Text style={[styles.tableCell, styles.colTarget]}>
                      {row.target}
                    </Text>
                    <Text style={[styles.tableCellBold, styles.colCapaian]}>
                      {row.capaian}
                    </Text>
                    <Text style={[styles.tableCellBold, styles.colPersen, { textAlign: "center" }]}>
                      {row.persentase}%
                    </Text>
                    <View style={styles.colStatus}>
                      <StatusPill status={row.status} label={getStatusLabel(row.status)} />
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 9, color: "#94a3b8", textAlign: "center" }}>
                  Tidak ada data progres santri
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
