import type { TerminologyConfigItem } from "../types";

export const ENTITY_CONFIGS: TerminologyConfigItem[] = [
  {
    code: "SANTRI",
    defaultLabel: "Santri",
    description: "Peserta Didik.",
    placeholder: "Contoh: Siswa, Murid, Tholib",
    category: "Primer",
    quickOptions: ["Siswa", "Murid", "Tholib", "Santriwan/wati"],
  },
  {
    code: "HALAQAH",
    defaultLabel: "Halaqah",
    description: "Kelompok belajar.",
    placeholder: "Contoh: Kelas, Kelompok, Kafilah",
    category: "Kelompok",
    quickOptions: ["Kelas", "Kelompok", "Kafilah", "Halaqah"],
  },
  {
    code: "MUHAFIZ",
    defaultLabel: "Muhafiz",
    description: "Pembimbing Tahfiz.",
    placeholder: "Contoh: Ustadz, Guru, Asatidz",
    category: "Pendidik",
    quickOptions: ["Ustadz", "Guru", "Asatidz", "Musyrif"],
  },
  {
    code: "SEKOLAH",
    defaultLabel: "Sekolah",
    description: "instansi, pondok, madrasah, atau yayasan.",
    placeholder: "Contoh: Pesantren, Pondok, Madrasah",
    category: "Entitas",
    quickOptions: ["Pesantren", "Pondok", "Madrasah", "Yayasan"],
  },
];
