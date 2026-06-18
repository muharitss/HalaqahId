## 6. Role & Permission

### Roles (Enum PostgreSQL)

| Role                | Keterangan                                    |
|--------------------|-----------------------------------------------|
| `SUPERADMIN`       | Akses penuh ke semua fitur di semua sekolah    |
| `ADMIN`            | Admin sekolah, kelola muhafiz + semua fitur    |
| `KOORDINATOR_TAHFIZ` | Koordinator, kelola semua halaqah di sekolah |
| `MUHAFIZ`          | Pengajar tahfidz, kelola halaqah sendiri       |

### Permission Matrix

| Permission                  | SUPERADMIN | ADMIN | KOORDINATOR | MUHAFIZ |
|----------------------------|------------|-------|-------------|---------|
| **Halaqah**                |            |       |             |         |
| `halaqah:create`           | Yes        | Yes   | Yes         | -       |
| `halaqah:view-all`         | Yes        | Yes   | Yes         | -       |
| `halaqah:view-own`         | Yes        | -     | -           | Yes     |
| `halaqah:edit-all`         | Yes        | Yes   | Yes         | -       |
| `halaqah:delete-all`       | Yes        | Yes   | Yes         | -       |
| **Santri**                 |            |       |             |         |
| `santri:create-own`        | Yes        | -     | -           | Yes     |
| `santri:create-all`        | Yes        | Yes   | Yes         | -       |
| `santri:view-own`          | Yes        | -     | -           | Yes     |
| `santri:view-all`          | Yes        | Yes   | Yes         | -       |
| `santri:edit-own`          | Yes        | -     | -           | Yes     |
| `santri:edit-all`          | Yes        | Yes   | Yes         | -       |
| `santri:delete-own`        | Yes        | -     | -           | Yes     |
| `santri:delete-all`        | Yes        | Yes   | Yes         | -       |
| **Absensi Santri**         |            |       |             |         |
| `absensi:santri:create-own`| Yes        | -     | -           | Yes     |
| `absensi:santri:create-all`| Yes        | Yes   | Yes         | -       |
| `absensi:santri:view-own`  | Yes        | -     | -           | Yes     |
| `absensi:santri:view-all`  | Yes        | Yes   | Yes         | -       |
| `absensi:santri:edit-own`  | Yes        | -     | -           | Yes     |
| `absensi:santri:edit-all`  | Yes        | Yes   | Yes         | -       |
| **Absensi Muhafiz**        |            |       |             |         |
| `absensi:muhafiz:manage`   | Yes        | Yes   | Yes         | -       |
| **Setoran**                |            |       |             |         |
| `setoran:create-own`       | Yes        | -     | -           | Yes     |
| `setoran:create-all`       | Yes        | Yes   | Yes         | -       |
| `setoran:view-own`         | Yes        | -     | -           | Yes     |
| `setoran:view-all`         | Yes        | Yes   | Yes         | -       |
| **Sesi Halaqah**           |            |       |             |         |
| `sesi-halaqah:create`      | Yes        | Yes   | Yes         | -       |
| `sesi-halaqah:view`        | Yes        | Yes   | Yes         | Yes     |
| `sesi-halaqah:edit`        | Yes        | Yes   | Yes         | -       |
| `sesi-halaqah:delete`      | Yes        | Yes   | Yes         | -       |
| **User Management**        |            |       |             |         |
| `muhafiz:manage`           | Yes        | Yes   | -           | -       |

> **Catatan**: SUPERADMIN memiliki semua permission secara otomatis.

---

