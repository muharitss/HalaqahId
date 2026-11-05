---
trigger: always_on
---

# UI Components & Styling Standards (shadcn/ui)

Kapan pun agent membuat, mengubah, me-refactor, atau menambahkan komponen UI di frontend, agent **WAJIB** mematuhi standar desain dan komponen berikut:

## 1. Selalu Gunakan Komponen shadcn/ui Murni
- Semua elemen UI interaktif dan struktural harus menggunakan komponen shadcn/ui yang berlokasi di `src/components/ui/` (diimpor via `@/components/ui/*`).
- **Dilarang** membuat elemen HTML mentah ad-hoc (seperti `<button>`, `<select>`, `<dialog>`, `<table>`) jika padanan komponen shadcn/ui sudah tersedia:
  - Tombol: `import { Button } from "@/components/ui/button"`
  - Dialog / Modal: `import { Dialog, DialogContent, DialogHeader, DialogTitle, ... } from "@/components/ui/dialog"`
  - Dropdown Select: `import { Select, SelectContent, SelectItem, ... } from "@/components/ui/select"`
  - Dropdown Menu: `import { DropdownMenu, DropdownMenuContent, ... } from "@/components/ui/dropdown-menu"`
  - Label: `import { Label } from "@/components/ui/label"`
  - Input: `import { Input } from "@/components/ui/input"`
  - Checkbox: `import { Checkbox } from "@/components/ui/checkbox"`
  - Badge: `import { Badge } from "@/components/ui/badge"`
  - Table: `import { Table, TableBody, TableCell, TableHead, ... } from "@/components/ui/table"`
  - Card: `import { Card, CardHeader, CardTitle, CardContent, ... } from "@/components/ui/card"`
  - Alert: `import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"`

## 2. Standar Icon: `lucide-react`
- Standar icon resmi untuk shadcn/ui adalah `lucide-react`.
- **Wajib** menggunakan icon dari `lucide-react` untuk setiap komponen atau fitur baru.
- **Dilarang** menambah import icon baru dari FontAwesome (`@fortawesome/*`) atau library icon lainnya.

## 3. Styling & Larangan Framework CSS Lain
- Gunakan Tailwind CSS utility classes yang selaras dengan design tokens tema shadcn/ui (`bg-background`, `text-foreground`, `bg-muted`, `text-muted-foreground`, `border-border`, `text-primary`, `bg-destructive`, dsb).
- **Dilarang keras** menggunakan class dari framework komponen CSS pihak ketiga (seperti class DaisyUI: `btn`, `badge`, `modal`, `card`, dsb) meskipun plugin tersebut terpasang di project.

## 4. Toast & Notifikasi
- Standar notifikasi toast menggunakan `sonner`:
  ```ts
  import { toast } from "sonner";
  toast.success("...");
  toast.error("...");
  ```

## 5. Kompatibilitas Terminologi Dinamis (HalaqahId)
- Selalu gunakan komponen `<Term code="..." />` dari `@/components/ui/Term` atau hook `useTerminology` untuk label domain (seperti `SANTRI`, `HALAQAH`, `MUHAFIZ`, `SEKOLAH`) agar UI konsisten dengan pengaturan tenant sekolah.
