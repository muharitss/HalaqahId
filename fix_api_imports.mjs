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

for (const file of allFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Fix aliases pointing to old services
    content = content.replace(/@\/features\/([a-zA-Z0-9-]+)\/services\//g, '@/features/$1/api/');
    content = content.replace(/@\/services/g, '@/features/shared/api');
    
    // Fix relative pointing to old services
    content = content.replace(/from\s+['"]\.\.\/services\/([^'"]+)['"]/g, 'from "../api/$1"');
    content = content.replace(/from\s+['"]\.\.\/\.\.\/services\/([^'"]+)['"]/g, 'from "../../api/$1"');
    content = content.replace(/from\s+['"]\.\/services\/([^'"]+)['"]/g, 'from "./api/$1"');

    // Fix specific old folder paths
    content = content.replace(/from\s+['"]\.\.\/kelola-halaqah\//g, 'from "@/features/halaqah/');
    content = content.replace(/from\s+['"]\.\.\/kelola-santri\//g, 'from "@/features/santri/');
    content = content.replace(/from\s+['"]\.\.\/kelola-muhafiz\//g, 'from "@/features/muhafiz/');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated imports in ${file}`);
    }
}
