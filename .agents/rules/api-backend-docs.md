---
trigger: always_on
---

# Backend API Documentation & Contract Rule

Kapan pun agent diminta membuat, mengubah, me-refactor, atau mengintegrasikan fitur di frontend yang memerlukan komunikasi jaringan atau pemanggilan API backend, agent **WAJIB** mengikuti aturan ini:

## 1. Dilarang Menebak Kontrak API (Zero Guesswork)
Agent dilarang keras berasumsi atau menebak:
- Path endpoint URL (misal menebak `/api/setorans` padahal `/api/setoran`)
- HTTP method (misal memakai `PUT` padahal `PATCH`)
- Parameter URL (path params) dan query params (misal `:id` vs `:slug`)
- Struktur request payload body (nama field, required vs optional, enum values)
- Struktur envelope response (contoh: data terbungkus `{ success, message, data, pagination }`)

## 2. Sumber Kebenaran Tunggal (Single Source of Truth)
Dokumentasi OpenAPI dan skema resmi backend berada pada repository backend di folder:
`../halaqahid-be/src/modules/<nama-modul>/docs/`
(atau path absolut `/home/muharits/Programmer/halaqah/halaqahid-be/src/modules/<nama-modul>/docs/`)

Setiap modul backend memiliki dua file utama:
1. `<nama-modul>.docs.ts`: Mendefinisikan semua path endpoint, HTTP method, path/query parameters, auth security, dan response status codes.
2. `<nama-modul>.schemas.ts`: Mendefinisikan request body schemas, response schemas, daftar field wajib (`required`), tipe data, dan nilai `enum`.

## 3. Langkah Kerja Wajib Sebelum Menulis Kode
Sebelum menulis atau mengedit file di frontend (`src/features/<feature>/api/`, `src/features/<feature>/types/`, atau Zod validation):
1. **Identifikasi Modul**: Tentukan modul backend terkait (contoh: fitur santri -> `santri`, setoran -> `setoran`, absensi -> `absensi`, dsb).
2. **Baca Dokumentasi Backend**: Gunakan tool `read_file` untuk membaca file:
   - `../halaqahid-be/src/modules/<nama-modul>/docs/<nama-modul>.docs.ts`
   - `../halaqahid-be/src/modules/<nama-modul>/docs/<nama-modul>.schemas.ts`
3. **Cek Route Realitas Jika Ragu**: Jika terdapat kejanggalan atau ketidakpastian, baca `../halaqahid-be/src/modules/<nama-modul>/<nama-modul>.route.ts`.
4. **Petakan Kontrak ke Frontend**:
   - Tipe data TypeScript di `src/features/<feature>/types/` harus mencerminkan skema request dan response backend secara presisi (termasuk enum dan nullable fields).
   - Service di `src/features/<feature>/api/services/` harus menggunakan HTTP method dan path yang sesuai dengan dokumentasi backend.
   - Skema Zod di `src/features/<feature>/modules/.../validation/` harus selaras dengan field `required` dan batasan tipe data pada backend.
