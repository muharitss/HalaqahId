import fs from 'fs';
import path from 'path';

function walk(dir, files = []) {
    const list = fs.readdirSync(dir);
    for (let file of list) {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) {
            walk(full, files);
        } else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
            files.push(full);
        }
    }
    return files;
}

const allFiles = walk('src');

const replaceRules = [
    { from: /@\/components\/forms/g, to: '@/components/custom/forms' },
    { from: /@\/components\/layout/g, to: '@/components/custom/layout' },
    { from: /@\/components\/theme/g, to: '@/components/custom/theme' },
    { from: /@\/components\/typed-text/g, to: '@/components/custom/typed-text' },
    { from: /@\/hooks\/use-mobile/g, to: '@/utils/use-mobile' },
    { from: /@\/context\/ThemeContext/g, to: '@/store/ThemeContext' },
    { from: /@\/components\/features\/tahfidz-ai\/TahfidzAi/g, to: '@/features/tahfidz-ai/components/TahfidzAi' },
    
    // Pages mappings
    { from: /@\/pages\/settings\/InfoSection/g, to: '@/features/settings/pages/InfoSection' },
    { from: /@\/pages\/settings\/TrashSection/g, to: '@/features/settings/pages/TrashSection' },
    { from: /@\/pages\/settings/g, to: '@/features/settings/pages' },
    { from: /@\/pages\/muhafidz\/NoHalaqah/g, to: '@/features/halaqah/pages/NoHalaqah' },

    // Features mappings
    { from: /@\/features\/kepala-muhafidz\/dashboard/g, to: '@/features/dashboard' },
    { from: /@\/features\/kepala-muhafidz\/kelola-halaqah/g, to: '@/features/halaqah' },
    { from: /@\/features\/kepala-muhafidz\/kelola-muhafiz/g, to: '@/features/muhafiz' },
    { from: /@\/features\/kepala-muhafidz\/kelola-sesi/g, to: '@/features/halaqah' },
    { from: /@\/features\/kepala-muhafidz\/laporan-setoran/g, to: '@/features/setoran' },
    { from: /@\/features\/kepala-muhafidz\/profil-sekolah/g, to: '@/features/sekolah' },
    { from: /@\/features\/kepala-muhafidz\/pages\/KepalaMuhafidzRoot/g, to: '@/layouts/KepalaMuhafidzRoot' },
    
    { from: /@\/features\/muhafidz\/absensi/g, to: '@/features/absensi' },
    { from: /@\/features\/muhafidz\/kelola-santri/g, to: '@/features/santri' },
    { from: /@\/features\/muhafidz\/progres-santri/g, to: '@/features/santri' },
    { from: /@\/features\/muhafidz\/setoran/g, to: '@/features/setoran' },
    { from: /@\/features\/muhafidz\/pages\/MuhafidzRoot/g, to: '@/layouts/MuhafidzRoot' },
    
    { from: /@\/features\/superadmin\/dashboard/g, to: '@/features/dashboard' },
    { from: /@\/features\/superadmin\/sekolah/g, to: '@/features/sekolah' },
    { from: /@\/features\/superadmin\/pages\/SuperadminRoot/g, to: '@/layouts/SuperadminRoot' },

    // Services mappings (these are tricky, need exact matches)
    { from: /@\/services\/absensiService/g, to: '@/features/absensi/api/absensiService' },
    { from: /@\/services\/akunService/g, to: '@/features/muhafiz/api/akunService' },
    { from: /@\/services\/muhafizService/g, to: '@/features/muhafiz/api/muhafizService' },
    { from: /@\/services\/halaqahService/g, to: '@/features/halaqah/api/halaqahService' },
    { from: /@\/services\/sesiService/g, to: '@/features/halaqah/api/sesiService' },
    { from: /@\/services\/progresService/g, to: '@/features/santri/api/progresService' },
    { from: /@\/services\/santriService/g, to: '@/features/santri/api/santriService' },
    { from: /@\/services\/sekolahService/g, to: '@/features/sekolah/api/sekolahService' },
    { from: /@\/services\/authService/g, to: '@/features/auth/api/authService' },
    { from: /@\/services\/displayService/g, to: '@/features/display/api/displayService' },
    { from: /@\/services\/halaqahManagementService/g, to: '@/features/halaqah/api/halaqahManagementService' },
    { from: /@\/services\/laporanService/g, to: '@/features/setoran/api/laporanService' },
    { from: /@\/services\/setoranService/g, to: '@/features/setoran/api/setoranService' },
    { from: /@\/services\/dashboardService/g, to: '@/features/dashboard/api/dashboardService' },
];

for (const file of allFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    for (const rule of replaceRules) {
        content = content.replace(rule.from, rule.to);
    }
    
    // Also fix any `../services/xxx` relative imports inside features
    content = content.replace(/from\s+['"]\.\.\/services\/([^'"]+)['"]/g, 'from "../api/$1"');
    content = content.replace(/from\s+['"]\.\.\/\.\.\/services\/([^'"]+)['"]/g, 'from "../../api/$1"');

    // Fix relative imports pointing to old folders (basic attempt)
    // E.g. from '../../kelola-santri/types' -> from '@/features/santri/types'
    content = content.replace(/from\s+['"]\.\.\/\.\.\/kelola-santri\/types['"]/g, 'from "@/features/santri/types"');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated imports in ${file}`);
    }
}
