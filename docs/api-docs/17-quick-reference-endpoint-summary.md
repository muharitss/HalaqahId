## Quick Reference: Endpoint Summary

| Method   | Endpoint                                              | Auth  | Keterangan                            |
|---------|------------------------------------------------------|-------|---------------------------------------|
| POST    | `/api/halaqah/auth/login`                            | -     | Login                                 |
| GET     | `/api/halaqah/auth/me`                               | Yes   | Profil user login                     |
| POST    | `/api/halaqah/auth/register`                         | Yes   | Register muhafiz                      |
| POST    | `/api/halaqah/auth/register-admin`                   | -     | Register admin + sekolah              |
| GET     | `/api/halaqah/auth/verify-email`                     | -     | Verifikasi email                      |
| POST    | `/api/halaqah/auth/resend-verification`              | -     | Kirim ulang verifikasi                |
| GET     | `/api/halaqah/auth/muhafiz`                          | Yes   | List muhafiz                          |
| GET     | `/api/halaqah/auth/muhafiz/:id`                      | Yes   | Detail muhafiz                        |
| PATCH   | `/api/halaqah/auth/muhafiz/:id`                      | Yes   | Update muhafiz                        |
| DELETE  | `/api/halaqah/auth/muhafiz/:id`                      | Yes   | Soft delete muhafiz                   |
| GET     | `/api/halaqah/auth/muhafiz/deleted`                  | Yes   | List deleted muhafiz                  |
| PATCH   | `/api/halaqah/auth/muhafiz/restore/:id`              | Yes   | Restore muhafiz                       |
| POST    | `/api/halaqah/auth/impersonate/:id`                  | Yes   | Impersonate muhafiz                   |
| POST    | `/api/halaqah`                                       | Yes   | Create halaqah                        |
| GET     | `/api/halaqah`                                       | Yes   | List halaqah                          |
| GET     | `/api/halaqah/deleted`                               | Yes   | List deleted halaqah                  |
| GET     | `/api/halaqah/:id`                                   | Yes   | Detail halaqah                        |
| PATCH   | `/api/halaqah/:id`                                   | Yes   | Update halaqah                        |
| DELETE  | `/api/halaqah/:id`                                   | Yes   | Soft delete halaqah                   |
| PATCH   | `/api/halaqah/restore/:id`                           | Yes   | Restore halaqah                       |
| GET     | `/api/santri`                                        | Yes   | List santri                           |
| GET     | `/api/santri/:id`                                    | Yes   | Detail santri                         |
| POST    | `/api/santri`                                        | Yes   | Create santri                         |
| PATCH   | `/api/santri/:id`                                    | Yes   | Update santri                         |
| DELETE  | `/api/santri/:id`                                    | Yes   | Soft delete santri                    |
| PATCH   | `/api/santri/:id/restore`                            | Yes   | Restore santri                        |
| POST    | `/api/sesi-halaqah`                                  | Yes   | Create sesi                           |
| GET     | `/api/sesi-halaqah`                                  | Yes   | List sesi (no pagination)             |
| GET     | `/api/sesi-halaqah/:id`                              | Yes   | Detail sesi                           |
| PATCH   | `/api/sesi-halaqah/:id`                              | Yes   | Update sesi                           |
| DELETE  | `/api/sesi-halaqah/:id`                              | Yes   | Delete sesi                           |
| POST    | `/api/absensi`                                       | Yes   | Create absensi santri (upsert)        |
| POST    | `/api/absensi/muhafiz`                               | Yes   | Create absensi muhafiz (upsert)       |
| GET     | `/api/absensi/halaqah/:halaqahId`                    | Yes   | Absensi harian/bulanan halaqah        |
| GET     | `/api/absensi/sesi/:id_sesi`                         | Yes   | Absensi sebuah sesi (per-sesi)         |
| GET     | `/api/absensi/santri/:id_santri`                     | Yes   | Riwayat absensi santri                |
| GET     | `/api/absensi/rekap-santri`                          | Yes   | Rekap bulanan semua santri            |
| GET     | `/api/absensi/rekap-muhafiz`                         | Yes   | Rekap bulanan muhafiz                 |
| PATCH   | `/api/absensi/:id`                                   | Yes   | Update absensi santri                 |
| PATCH   | `/api/absensi/muhafiz/:id`                           | Yes   | Update absensi muhafiz                |
| DELETE  | `/api/absensi/:id`                                   | Yes   | Delete absensi santri                 |
| DELETE  | `/api/absensi/muhafiz/:id`                           | Yes   | Delete absensi muhafiz                |
| POST    | `/api/setoran`                                       | Yes   | Create setoran                        |
| GET     | `/api/setoran/all`                                   | Yes   | List semua setoran                    |
| GET     | `/api/setoran/santri/:id_santri`                     | Yes   | Riwayat setoran santri                |
| PATCH   | `/api/setoran/:id`                                   | Yes   | Update setoran                        |
| DELETE  | `/api/setoran/:id`                                   | Yes   | Soft delete setoran                   |
| PATCH   | `/api/setoran/:id/restore`                           | Yes   | Restore setoran                       |
| GET     | `/api/sekolah/all`                                   | Yes   | List semua sekolah                    |
| GET     | `/api/sekolah`                                       | Yes   | Profil sekolah                        |
| PATCH   | `/api/sekolah`                                       | Yes   | Update profil sekolah                 |
| GET     | `/api/display/:token/halaqah`                        | -     | Public: list halaqah                  |
| GET     | `/api/display/:token/absensi/halaqah/:halaqahId`     | -     | Public: absensi halaqah              |
| GET     | `/api/display/:token/setoran/all`                    | -     | Public: semua setoran                 |
| GET     | `/api/display/:token/santri`                         | -     | Public: list santri                   |
| GET     | `/api/display/:token/santri/:id`                     | -     | Public: detail santri + statistik    |
| GET     | `/health` atau `/api/health`                         | -     | Health check                          |

---
