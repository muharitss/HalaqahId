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
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

Font.register({
  family: "Helvetica",
  fonts: [],
});

export interface LaporanPdfRow {
  no: number;
  tanggal: string;
  nama_santri: string;
  nama_halaqah: string;
  juz: number;
  surat: string;
  ayat: string;
  kategori: string;
  taqwim: number | null;
  keterangan?: string;
  custom_values?: Record<string, any> | null;
}

export interface LaporanPdfStats {
  totalSetoran: number;
  totalSantriAktif: number;
  rataRataTaqwim: number;
  kategoriDominan: string;
  distribusiKategori: Record<string, number>;
  distribusiHalaqah: Record<string, number>;
  periodLabel: string;
}

interface LaporanPdfTemplateProps {
  rows: LaporanPdfRow[];
  stats: LaporanPdfStats;
  periodLabel: string;
  sekolah?: Sekolah | null;
  namaSekolah?: string;
  namaHalaqah?: string;
  generatedAt: string;
}

const getKategoriColor = (kategori: string): string => {
  const normalized = (kategori || "").toUpperCase();
  if (normalized.includes("ZIYADAH") || normalized.includes("SETORAN")) return "#7c3aed";
  if (normalized.includes("MURAJAAH")) return "#2563eb";
  if (normalized.includes("HAFALAN")) return "#059669";
  if (normalized.includes("INTENS")) return "#d97706";
  if (normalized.includes("BACAAN")) return "#e11d48";
  return "#64748b";
};

const TAQWIM_LABEL: Record<number, string> = {
  0: "Lancar",
  1: "1 Salah",
  2: "2 Salah",
  3: "3+ Salah",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    paddingHorizontal: 36,
    paddingVertical: 36,
  },
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
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
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
  colNo: { width: "5%" },
  colTanggal: { width: "10%" },
  colNama: { width: "20%" },
  colHalaqah: { width: "14%" },
  colJuz: { width: "5%" },
  colSurat: { width: "20%" },
  colAyat: { width: "8%" },
  colKategori: { width: "10%" },
  colTaqwim: { width: "8%" },
  badge: {
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
  },
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

function KategoriBadge({ kategori }: { kategori: string }) {
  const color = getKategoriColor(kategori);
  return (
    <View style={[styles.badge, { backgroundColor: color + "20" }]}>
      <Text style={[styles.badgeText, { color }]}>{kategori}</Text>
    </View>
  );
}

function TaqwimBadge({ taqwim }: { taqwim: number | null }) {
  if (taqwim === null || taqwim === undefined) return null;
  const isLancar = taqwim === 0;
  const color = isLancar ? "#059669" : taqwim <= 2 ? "#d97706" : "#dc2626";
  const label = TAQWIM_LABEL[taqwim] ?? `${taqwim} Salah`;
  return (
    <View style={[styles.badge, { backgroundColor: color + "15" }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

export function LaporanPdfTemplate({
  rows,
  stats,
  periodLabel,
  sekolah,
  namaSekolah = "Halaqah ID",
  namaHalaqah = "Semua Halaqah",
  generatedAt,
}: LaporanPdfTemplateProps) {
  const ROWS_FIRST = 10;
  const ROWS_REST = 18;

  const resolvedNamaSekolah = sekolah?.nama_sekolah || namaSekolah;
  const resolvedNamaSingkat = sekolah?.nama_singkat || resolvedNamaSekolah;

  const firstPageRows = rows.slice(0, ROWS_FIRST);
  const restRows = rows.slice(ROWS_FIRST);
  const restPages: LaporanPdfRow[][] = [];
  for (let i = 0; i < restRows.length; i += ROWS_REST) {
    restPages.push(restRows.slice(i, i + ROWS_REST));
  }

  const allPages: Array<{ rows: LaporanPdfRow[]; isFirst: boolean }> = [
    { rows: firstPageRows, isFirst: true },
    ...restPages.map((r) => ({ rows: r, isFirst: false })),
  ];
  const totalPages = allPages.length || 1;

  const taqwimLabel =
    stats.rataRataTaqwim === 0
      ? "Sempurna / Lancar"
      : stats.rataRataTaqwim <= 2
        ? "Baik (Itqan)"
        : "Perlu Perbaikan";

  const distribusiKategoriEntries = Object.entries(stats.distribusiKategori).sort(
    (a, b) => b[1] - a[1]
  );
  const distribusiHalaqahEntries = Object.entries(stats.distribusiHalaqah).sort(
    (a, b) => b[1] - a[1]
  );

  const formatTanggal = (raw: string) => {
    try {
      return format(new Date(raw), "dd/MM/yy", { locale: idLocale });
    } catch {
      return raw;
    }
  };

  return (
    <Document
      title={`Laporan Setoran Hafalan — ${periodLabel}`}
      author={resolvedNamaSekolah}
      subject="Laporan Rekapitulasi Setoran Hafalan"
    >
      {allPages.map((pageData, pageIdx) => (
        <Page key={pageIdx} size="A4" style={styles.page}>
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
                Laporan Rekapitulasi Setoran Hafalan
              </Text>
              <Text style={styles.periodText}>
                Periode Laporan: {periodLabel}
              </Text>
            </View>
            {sekolah?.logo_url ? <View style={{ width: 55 }} /> : null}
          </View>

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
                    <Text style={styles.summaryLabel}>Total Setoran</Text>
                    <Text style={styles.summaryValueBold}>
                      {stats.totalSetoran.toLocaleString("id-ID")} setoran
                    </Text>
                  </View>
                </View>

                <View style={styles.summaryCol}>
                  <View style={styles.summaryField}>
                    <Text style={styles.summaryLabel}>Santri Aktif</Text>
                    <Text
                      style={[styles.summaryValueBold, { color: "#2563eb" }]}
                    >
                      {stats.totalSantriAktif} Santri
                    </Text>
                  </View>
                  <View style={styles.summaryField}>
                    <Text style={styles.summaryLabel}>Rata-rata Kelancaran</Text>
                    <Text
                      style={[styles.summaryValueBold, { color: "#059669" }]}
                    >
                      {stats.rataRataTaqwim.toFixed(1)} — {taqwimLabel}
                    </Text>
                  </View>
                  <View style={styles.summaryField}>
                    <Text style={styles.summaryLabel}>Kategori Dominan</Text>
                    <Text
                      style={[
                        styles.summaryValueBold,
                        {
                          color: getKategoriColor(stats.kategoriDominan),
                        },
                      ]}
                    >
                      {stats.kategoriDominan || "—"}
                    </Text>
                  </View>
                </View>
              </View>

              {(distribusiKategoriEntries.length > 0 ||
                distribusiHalaqahEntries.length > 0) && (
                <View style={styles.distribusiContainer}>
                  {distribusiKategoriEntries.length > 0 && (
                    <View style={styles.distribusiCard}>
                      <Text style={styles.distribusiTitle}>
                        Distribusi Kategori
                      </Text>
                      {distribusiKategoriEntries.slice(0, 6).map(([kat, count]) => (
                        <View key={kat} style={styles.distribusiRow}>
                          <View
                            style={[
                              styles.distribusiDot,
                              {
                                backgroundColor: getKategoriColor(kat),
                              },
                            ]}
                          />
                          <Text style={styles.distribusiName}>{kat}</Text>
                          <Text style={styles.distribusiCount}>{count}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {distribusiHalaqahEntries.length > 0 && (
                    <View style={styles.distribusiCard}>
                      <Text style={styles.distribusiTitle}>
                        Distribusi Halaqah
                      </Text>
                      {distribusiHalaqahEntries.slice(0, 6).map(([halaqah, count]) => (
                        <View key={halaqah} style={styles.distribusiRow}>
                          <View
                            style={[
                              styles.distribusiDot,
                              { backgroundColor: "#6366f1" },
                            ]}
                          />
                          <Text style={styles.distribusiName}>{halaqah}</Text>
                          <Text style={styles.distribusiCount}>{count}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </>
          )}

          <Text style={styles.sectionTitle}>
            Daftar Setoran Hafalan
            {pageIdx > 0 ? ` (Lanjutan — Hal. ${pageIdx + 1})` : ""}
          </Text>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colNo]}>#</Text>
              <Text style={[styles.tableHeaderCell, styles.colTanggal]}>
                Tanggal
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colNama]}>
                Nama Santri
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colHalaqah]}>
                Halaqah
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colJuz]}>Juz</Text>
              <Text style={[styles.tableHeaderCell, styles.colSurat]}>
                Surat
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colAyat]}>
                Ayat
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colKategori]}>
                Kategori
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colTaqwim]}>
                Kelancaran
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
                    <Text
                      style={[
                        styles.tableCell,
                        styles.colTanggal,
                        { color: "#64748b" },
                      ]}
                    >
                      {formatTanggal(row.tanggal)}
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
                    <Text
                      style={[
                        styles.tableCellBold,
                        styles.colJuz,
                        { textAlign: "center" },
                      ]}
                    >
                      {row.juz}
                    </Text>
                    <Text style={[styles.tableCell, styles.colSurat]}>
                      {row.surat}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.colAyat,
                        { color: "#64748b" },
                      ]}
                    >
                      {row.ayat}
                    </Text>
                    <View style={styles.colKategori}>
                      <KategoriBadge kategori={row.kategori} />
                    </View>
                    <View style={styles.colTaqwim}>
                      {row.custom_values && typeof row.custom_values === "object" && Object.keys(row.custom_values).length > 0 ? (
                        Object.entries(row.custom_values).map(([key, val]) => {
                          const config = (sekolah?.form_setoran_config as any[]) || [];
                          const fieldConfig = config.find((f) => f.id === key);
                          if (!fieldConfig) return null;
                          if (val === undefined || val === null || val === "") return null;

                          let displayVal = String(val);
                          if (fieldConfig.type === "boolean") {
                            displayVal = val ? "Ya" : "Tidak";
                          }
                          return (
                            <Text key={key} style={{ fontSize: 6, color: "#1e293b", marginBottom: 1 }}>
                              {fieldConfig.label}: {displayVal}
                            </Text>
                          );
                        })
                      ) : (
                        row.taqwim !== null && row.taqwim !== undefined ? (
                          <TaqwimBadge taqwim={row.taqwim} />
                        ) : null
                      )}
                    </View>
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
                  Tidak ada data setoran
                </Text>
              </View>
            )}
          </View>

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
