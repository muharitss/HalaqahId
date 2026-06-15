export const Role = {
  SUPERADMIN: 'SUPERADMIN',
  ADMIN: 'ADMIN',
  KOORDINATOR_TAHFIZ: 'KOORDINATOR_TAHFIZ',
  MUHAFIZ: 'MUHAFIZ',
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const Permission = {
  // Halaqah
  HALAQAH_CREATE: 'halaqah:create',
  HALAQAH_VIEW_ALL: 'halaqah:view-all',
  HALAQAH_VIEW_OWN: 'halaqah:view-own',
  HALAQAH_EDIT_ALL: 'halaqah:edit-all',
  HALAQAH_DELETE_ALL: 'halaqah:delete-all',
  // Santri
  SANTRI_CREATE_OWN: 'santri:create-own',
  SANTRI_CREATE_ALL: 'santri:create-all',
  SANTRI_VIEW_OWN: 'santri:view-own',
  SANTRI_VIEW_ALL: 'santri:view-all',
  SANTRI_EDIT_OWN: 'santri:edit-own',
  SANTRI_EDIT_ALL: 'santri:edit-all',
  SANTRI_DELETE_OWN: 'santri:delete-own',
  SANTRI_DELETE_ALL: 'santri:delete-all',
  // Absensi Santri
  ABSENSI_SANTRI_CREATE_OWN: 'absensi:santri:create-own',
  ABSENSI_SANTRI_CREATE_ALL: 'absensi:santri:create-all',
  ABSENSI_SANTRI_VIEW_OWN: 'absensi:santri:view-own',
  ABSENSI_SANTRI_VIEW_ALL: 'absensi:santri:view-all',
  ABSENSI_SANTRI_EDIT_OWN: 'absensi:santri:edit-own',
  ABSENSI_SANTRI_EDIT_ALL: 'absensi:santri:edit-all',
  // Absensi Muhafiz
  ABSENSI_MUHAFIZ_MANAGE: 'absensi:muhafiz:manage',
  // Setoran
  SETORAN_CREATE_OWN: 'setoran:create-own',
  SETORAN_CREATE_ALL: 'setoran:create-all',
  SETORAN_VIEW_OWN: 'setoran:view-own',
  SETORAN_VIEW_ALL: 'setoran:view-all',
  // Sesi Halaqah
  SESI_HALAQAH_CREATE: 'sesi-halaqah:create',
  SESI_HALAQAH_VIEW: 'sesi-halaqah:view',
  SESI_HALAQAH_EDIT: 'sesi-halaqah:edit',
  SESI_HALAQAH_DELETE: 'sesi-halaqah:delete',
  // User Management
  MUHAFIZ_MANAGE: 'muhafiz:manage',
} as const;
export type Permission = (typeof Permission)[keyof typeof Permission];

/**
 * Mapping dari setiap Role ke Permission yang dimilikinya.
 * SUPERADMIN memiliki semua permission secara otomatis.
 */
export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  [Role.SUPERADMIN]: Object.values(Permission),
  [Role.ADMIN]: [
    Permission.HALAQAH_CREATE, Permission.HALAQAH_VIEW_ALL, Permission.HALAQAH_EDIT_ALL, Permission.HALAQAH_DELETE_ALL,
    Permission.SANTRI_CREATE_ALL, Permission.SANTRI_VIEW_ALL, Permission.SANTRI_EDIT_ALL, Permission.SANTRI_DELETE_ALL,
    Permission.ABSENSI_SANTRI_CREATE_ALL, Permission.ABSENSI_SANTRI_VIEW_ALL, Permission.ABSENSI_SANTRI_EDIT_ALL,
    Permission.ABSENSI_MUHAFIZ_MANAGE,
    Permission.SETORAN_CREATE_ALL, Permission.SETORAN_VIEW_ALL,
    Permission.SESI_HALAQAH_CREATE, Permission.SESI_HALAQAH_VIEW, Permission.SESI_HALAQAH_EDIT, Permission.SESI_HALAQAH_DELETE,
    Permission.MUHAFIZ_MANAGE,
  ],
  [Role.KOORDINATOR_TAHFIZ]: [
    Permission.HALAQAH_CREATE, Permission.HALAQAH_VIEW_ALL, Permission.HALAQAH_EDIT_ALL, Permission.HALAQAH_DELETE_ALL,
    Permission.SANTRI_CREATE_ALL, Permission.SANTRI_VIEW_ALL, Permission.SANTRI_EDIT_ALL, Permission.SANTRI_DELETE_ALL,
    Permission.ABSENSI_SANTRI_CREATE_ALL, Permission.ABSENSI_SANTRI_VIEW_ALL, Permission.ABSENSI_SANTRI_EDIT_ALL,
    Permission.ABSENSI_MUHAFIZ_MANAGE,
    Permission.SETORAN_CREATE_ALL, Permission.SETORAN_VIEW_ALL,
    Permission.SESI_HALAQAH_CREATE, Permission.SESI_HALAQAH_VIEW, Permission.SESI_HALAQAH_EDIT, Permission.SESI_HALAQAH_DELETE,
    Permission.MUHAFIZ_MANAGE,
  ],
  [Role.MUHAFIZ]: [
    Permission.HALAQAH_VIEW_OWN,
    Permission.SANTRI_CREATE_OWN, Permission.SANTRI_VIEW_OWN, Permission.SANTRI_EDIT_OWN, Permission.SANTRI_DELETE_OWN,
    Permission.ABSENSI_SANTRI_CREATE_OWN, Permission.ABSENSI_SANTRI_VIEW_OWN, Permission.ABSENSI_SANTRI_EDIT_OWN,
    Permission.SETORAN_CREATE_OWN, Permission.SETORAN_VIEW_OWN,
    Permission.SESI_HALAQAH_VIEW,
  ],
};

/** Cek apakah sebuah Role memiliki Permission tertentu */
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

/** Cek apakah Role termasuk "kepala" (bukan MUHAFIZ) — untuk navigasi dashboard */
export function isKepalaRole(role: Role): boolean {
  return role === Role.SUPERADMIN || role === Role.ADMIN || role === Role.KOORDINATOR_TAHFIZ;
}

export const JenisHalaqah = {
  TAHFIDZ: 'TAHFIDZ',
  BACAAN: 'BACAAN',
  INTENSIF: 'INTENSIF',
} as const;
export type JenisHalaqah = (typeof JenisHalaqah)[keyof typeof JenisHalaqah];

export const KategoriTarget = {
  RINGAN: 'RINGAN',
  SEDANG: 'SEDANG',
  INTENSE: 'INTENSE',
  BACAAN: 'BACAAN',
} as const;
export type KategoriTarget = (typeof KategoriTarget)[keyof typeof KategoriTarget];

export const StatusKehadiran = {
  HADIR: 'HADIR',
  IZIN: 'IZIN',
  SAKIT: 'SAKIT',
  ALFA: 'ALFA',
  TERLAMBAT: 'TERLAMBAT',
} as const;
export type StatusKehadiran = (typeof StatusKehadiran)[keyof typeof StatusKehadiran];

export const KategoriSetoran = {
  MURAJAAH: 'MURAJAAH',
  ZIYADAH: 'ZIYADAH',
  INTENS: 'INTENS',
  BACAAN: 'BACAAN',
  HAFALAN: 'HAFALAN',
} as const;
export type KategoriSetoran = (typeof KategoriSetoran)[keyof typeof KategoriSetoran];
