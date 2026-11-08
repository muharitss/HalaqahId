# HalaqahId — Platform Manajemen Halaqah & Tahfidz Al-Qur'an (Frontend)

Modern, high-performance enterprise frontend application for Islamic schools, pesantren, and tahfidz institutions to manage Quran memorization (tahfidz), attendance, multi-tenant academic tracking, examinations, and rubrics.

---

## 🌟 Tech Stack & Architecture

- **Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui component library, Lucide React icons
- **State & Data Fetching**: TanStack Query (React Query v5), Zustand
- **Architecture**: Modular Feature-Driven Architecture (Feature-Sliced inspired)
- **Forms & Validation**: React Hook Form, Zod
- **Reports & PDF**: @react-pdf/renderer
- **Charts**: Recharts

---

## 🚀 Key Modules (Phase 1 Completed)

1. **Multi-Tenant & Organization**
   - Tenant & School management with custom branding (logo, colors, app name)
   - Dynamic Terminology Engine (`<Term />`) adapted to each institution type
   - Multi-school switching for users associated with multiple institutions

2. **User & Role Management (RBAC)**
   - Granular permission system (Superadmin, Kepala Muhafidz, Muhafiz, Wali Santri)
   - Impersonation support for administrator troubleshooting
   - Audit trail and security logs

3. **Santri & Halaqah Management**
   - Santri directory with NIS generation, status tracking, and halaqah assignment history
   - Parent/Guardian (Wali Santri) portal with OTP/verification login and progress viewer
   - Sesi and halaqah scheduling

4. **Setoran & Examination (Ujian)**
   - Daily tahfidz/ziyadah & muraja'ah recording with digital mushaf viewer
   - Multi-rubrik assessment criteria and dynamic scoring templates
   - Single-pass and multi-question examination simulator and evaluation

---

## 🛠️ Development & Build

### Prerequisites
- Node.js >= 18
- npm or pnpm

### Getting Started
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run ESLint check
npm run lint

# Production Build
npm run build
```

---

## 📄 License
Private & Confidential — Halaqah.id
