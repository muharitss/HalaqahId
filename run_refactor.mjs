import fs from 'fs';
import path from 'path';

function walk(dir, files = []) {
    if (!fs.existsSync(dir)) return files;
    const list = fs.readdirSync(dir);
    for (let file of list) {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) {
            walk(full, files);
        } else {
            files.push(full);
        }
    }
    return files;
}

const allFiles = walk('src');

const mappings = [
    // 1. Root cleanup
    { from: 'src/api/axiosClient.ts', to: 'src/lib/axiosClient.ts' },
    { from: 'src/context/ThemeContext.tsx', to: 'src/store/ThemeContext.tsx' },
    { from: 'src/hooks/use-mobile.ts', to: 'src/utils/use-mobile.ts' },
    
    // 2. Components
    { from: 'src/components/forms', to: 'src/components/custom/forms' },
    { from: 'src/components/layout', to: 'src/components/custom/layout' },
    { from: 'src/components/theme', to: 'src/components/custom/theme' },
    { from: 'src/components/typed-text', to: 'src/components/custom/typed-text' },
    { from: 'src/components/auth', to: 'src/features/auth/components' },
    { from: 'src/components/features/tahfidz-ai', to: 'src/features/tahfidz-ai/components' },

    // 3. Services -> API
    { from: 'src/services/absensiService.ts', to: 'src/features/absensi/api/absensiService.ts' },
    { from: 'src/services/akunService.ts', to: 'src/features/muhafiz/api/akunService.ts' },
    { from: 'src/services/muhafizService.ts', to: 'src/features/muhafiz/api/muhafizService.ts' },
    { from: 'src/services/halaqahService.ts', to: 'src/features/halaqah/api/halaqahService.ts' },
    { from: 'src/services/sesiService.ts', to: 'src/features/halaqah/api/sesiService.ts' },
    { from: 'src/services/progresService.ts', to: 'src/features/santri/api/progresService.ts' },
    { from: 'src/services/santriService.ts', to: 'src/features/santri/api/santriService.ts' },
    { from: 'src/services/sekolahService.ts', to: 'src/features/sekolah/api/sekolahService.ts' },
    { from: 'src/services/index.ts', to: 'src/features/shared/api/index.ts' }, // fallback for root index
    
    // 4. Feature mappings
    { from: 'src/features/kepala-muhafidz/dashboard', to: 'src/features/dashboard' },
    { from: 'src/features/kepala-muhafidz/kelola-halaqah', to: 'src/features/halaqah' },
    { from: 'src/features/kepala-muhafidz/kelola-muhafiz', to: 'src/features/muhafiz' },
    { from: 'src/features/kepala-muhafidz/kelola-sesi', to: 'src/features/halaqah' }, // overlaps with halaqah, files will merge
    { from: 'src/features/kepala-muhafidz/laporan-setoran', to: 'src/features/setoran' },
    { from: 'src/features/kepala-muhafidz/profil-sekolah', to: 'src/features/sekolah' },
    { from: 'src/features/muhafidz/absensi', to: 'src/features/absensi' },
    { from: 'src/features/muhafidz/kelola-santri', to: 'src/features/santri' },
    { from: 'src/features/muhafidz/progres-santri', to: 'src/features/santri' },
    { from: 'src/features/muhafidz/setoran', to: 'src/features/setoran' },
    { from: 'src/features/superadmin/dashboard', to: 'src/features/dashboard' },
    { from: 'src/features/superadmin/sekolah', to: 'src/features/sekolah' },
    
    // Pages / Layouts
    { from: 'src/features/kepala-muhafidz/pages', to: 'src/layouts' },
    { from: 'src/features/muhafidz/pages', to: 'src/layouts' },
    { from: 'src/features/superadmin/pages', to: 'src/layouts' },
    { from: 'src/pages/settings', to: 'src/features/settings/pages' },
    { from: 'src/pages/muhafidz/NoHalaqah.tsx', to: 'src/features/halaqah/pages/NoHalaqah.tsx' },
];

const getTarget = (filePath) => {
    // Normalize path to forward slashes for matching
    const posixPath = filePath.split(path.sep).join('/');
    
    // 1. Direct match for specific files
    const directMatch = mappings.find(m => posixPath === m.from);
    if (directMatch) return directMatch.to;

    // 2. Directory match
    for (const m of mappings) {
        if (posixPath.startsWith(m.from + '/')) {
            let target = posixPath.replace(m.from, m.to);
            // Inside feature folders, move `services/` to `api/`
            if (target.includes('/services/')) {
                target = target.replace('/services/', '/api/');
            }
            // If the target is inside a feature, ensure its index.tsx moves to pages/
            if (target.match(/^src\/features\/[^/]+\/index\.tsx$/)) {
                target = target.replace('/index.tsx', '/pages/index.tsx'); // keep it simple, or rename
            }
            return target;
        }
    }
    
    // 3. UI Components rule (files directly in src/components go to src/components/ui)
    if (posixPath.match(/^src\/components\/[^/]+\.tsx$/)) {
        return posixPath.replace('src/components/', 'src/components/ui/');
    }

    // 4. Feature services to api fallback
    if (posixPath.match(/^src\/features\/[^/]+\/services\/.*/)) {
        return posixPath.replace('/services/', '/api/');
    }

    return posixPath; // No change
};

const moves = [];
for (const file of allFiles) {
    const target = getTarget(file);
    if (file.split(path.sep).join('/') !== target) {
        moves.push({ from: file, to: target });
    }
}

// Execute moves
for (const { from, to } of moves) {
    const toPath = path.normalize(to);
    fs.mkdirSync(path.dirname(toPath), { recursive: true });
    try {
        fs.renameSync(from, toPath);
        console.log(`Moved ${from} -> ${to}`);
    } catch(e) {
        console.error(`Failed ${from}:`, e.message);
    }
}

console.log("Cleanup empty dirs...");
function clean(d){
    if(!fs.existsSync(d))return;
    const files=fs.readdirSync(d);
    for(const f of files){
        const p=path.join(d,f);
        if(fs.statSync(p).isDirectory())clean(p);
    }
    if(fs.readdirSync(d).length===0)fs.rmdirSync(d);
}
clean('src');

console.log("Done refactoring.");
