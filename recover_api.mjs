import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Re-checkout the actual services from git
const actualServices = [
    'src/features/kepala-muhafidz/kelola-halaqah/services/halaqahManagementService.ts',
    'src/features/kepala-muhafidz/kelola-muhafiz/services/muhafizService.ts',
    'src/features/kepala-muhafidz/laporan-setoran/services/laporanService.tsx',
    'src/features/muhafidz/absensi/services/absensiService.ts',
    'src/features/muhafidz/kelola-santri/services/santriService.ts',
    'src/features/muhafidz/progres-santri/services/progresService.ts',
    'src/features/muhafidz/setoran/services/setoranService.ts',
    'src/features/superadmin/sekolah/services/sekolahService.ts',
    'src/features/auth/services/authService.ts',
    'src/features/dashboard/services/dashboardService.ts',
    'src/features/display/services/displayService.ts'
];

for (const file of actualServices) {
    try {
        execSync(`git checkout HEAD -- ${file}`);
        console.log(`Recovered ${file}`);
    } catch(e) {
        // console.log(`Not found in HEAD: ${file}`);
    }
}

// Now move them to their correct new places
const mappings = [
    { from: 'src/features/kepala-muhafidz/kelola-halaqah/services/halaqahManagementService.ts', to: 'src/features/halaqah/api/halaqahManagementService.ts' },
    { from: 'src/features/kepala-muhafidz/kelola-muhafiz/services/muhafizService.ts', to: 'src/features/muhafiz/api/muhafizService.ts' },
    { from: 'src/features/kepala-muhafidz/laporan-setoran/services/laporanService.tsx', to: 'src/features/setoran/api/laporanService.tsx' },
    { from: 'src/features/muhafidz/absensi/services/absensiService.ts', to: 'src/features/absensi/api/absensiService.ts' },
    { from: 'src/features/muhafidz/kelola-santri/services/santriService.ts', to: 'src/features/santri/api/santriService.ts' },
    { from: 'src/features/muhafidz/progres-santri/services/progresService.ts', to: 'src/features/santri/api/progresService.ts' },
    { from: 'src/features/muhafidz/setoran/services/setoranService.ts', to: 'src/features/setoran/api/setoranService.ts' },
    { from: 'src/features/superadmin/sekolah/services/sekolahService.ts', to: 'src/features/sekolah/api/sekolahService.ts' },
    { from: 'src/features/auth/services/authService.ts', to: 'src/features/auth/api/authService.ts' },
    { from: 'src/features/dashboard/services/dashboardService.ts', to: 'src/features/dashboard/api/dashboardService.ts' },
    { from: 'src/features/display/services/displayService.ts', to: 'src/features/display/api/displayService.ts' }
];

for (const { from, to } of mappings) {
    if (fs.existsSync(from)) {
        // Also fix the import inside the file if needed! (We will run fix_api_imports.mjs later)
        fs.mkdirSync(path.dirname(to), { recursive: true });
        fs.renameSync(from, to);
        console.log(`Moved ${from} to ${to}`);
    }
}
