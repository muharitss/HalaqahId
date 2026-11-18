import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage paths: resolves to HalaqahId/.auth/
export const AUTH_DIR = path.resolve(__dirname, '../../../.auth');

export const STORAGE_STATE = {
  admin: path.join(AUTH_DIR, 'admin.json'),
  muhafiz: path.join(AUTH_DIR, 'muhafiz.json'),
  wali: path.join(AUTH_DIR, 'wali.json'),
  superadmin: path.join(AUTH_DIR, 'superadmin.json'),
};

export const TEST_USERS = {
  tenant: {
    id: 1,
    slug: 'default',
    nama: 'Yayasan Bina Tahfidz Indonesia',
  },
  sekolah: {
    id: 1,
    slug: 'al-hikmah',
    nama: 'Pesantren Tahfidz Al-Hikmah',
  },
  admin: {
    email: 'admin@halaqah.id',
    password: 'password',
    role: 'ADMIN',
    expectedPath: '/kepala-muhafidz',
  },
  muhafiz: {
    email: 'muhafiz1@halaqah.id',
    password: 'password',
    role: 'MUHAFIZ',
    expectedPath: '/muhafidz',
  },
  muhafiz2: {
    email: 'muhafiz2@halaqah.id',
    password: 'password',
    role: 'MUHAFIZ',
    expectedPath: '/muhafidz',
  },
  superadmin: {
    email: 'superadmin@halaqah.id',
    password: 'password',
    role: 'SUPERADMIN',
    expectedPath: '/superadmin',
  },
  wali: {
    sekolah_slug: 'al-hikmah',
    nis: '20260001',
    no_telepon: '081234567890',
    nama_santri: 'Muhammad Fatih',
    nama_wali: 'Bapak Rahmat Hidayat',
    otp: '123456',
    expectedPath: '/portal',
  },
  wali2: {
    sekolah_slug: 'al-hikmah',
    nis: '20260002',
    no_telepon: '081298765432',
    nama_santri: 'Zaid bin Tsabit',
    nama_wali: 'Ibu Siti Aminah',
    otp: '123456',
    expectedPath: '/portal',
  },
  // ── Tenant 2 Fixtures (Multi-Tenant RLS & Isolation) ──
  tenant2: {
    id: 2,
    slug: 'tenant-dua',
    nama: 'Yayasan Tahfidz Rahmatan Lil Alamin',
  },
  sekolah2: {
    id: 2,
    slug: 'bina-quran',
    nama: 'Pesantren Bina Quran',
  },
  adminTenant2: {
    email: 'admin2@halaqah.id',
    password: 'password',
    role: 'ADMIN',
    expectedPath: '/kepala-muhafidz',
  },
  muhafizTenant2: {
    email: 'muhafiz.t2@halaqah.id',
    password: 'password',
    role: 'MUHAFIZ',
    expectedPath: '/muhafidz',
  },
  waliTenant2: {
    sekolah_slug: 'bina-quran',
    nis: '20261001',
    no_telepon: '081299990001',
    nama_santri: 'Ahmad Al-Baqir',
    nama_wali: 'Bapak Mansur',
    otp: '123456',
    expectedPath: '/portal',
  },
  halaqahTenant2: {
    id: 3,
    name: 'Halaqah Utsman bin Affan (Tenant 2)',
  },
};
