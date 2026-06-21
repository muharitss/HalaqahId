import fs from 'fs';
import path from 'path';

function fixPageImports() {
    const featuresDir = 'src/features';
    const features = fs.readdirSync(featuresDir);
    for (const feature of features) {
        const indexFile = path.join(featuresDir, feature, 'pages', 'index.tsx');
        if (fs.existsSync(indexFile)) {
            let content = fs.readFileSync(indexFile, 'utf8');
            let original = content;

            // Replace ./hooks -> ../hooks
            content = content.replace(/from\s+['"]\.\/hooks/g, 'from "../hooks');
            // Replace ./components -> ../components
            content = content.replace(/from\s+['"]\.\/components/g, 'from "../components');
            // Replace ./services -> ../api
            content = content.replace(/from\s+['"]\.\/services/g, 'from "../api');
            // Replace ./api -> ../api
            content = content.replace(/from\s+['"]\.\/api/g, 'from "../api');

            if (content !== original) {
                fs.writeFileSync(indexFile, content, 'utf8');
                console.log(`Fixed relative imports in ${indexFile}`);
            }
        }
    }
}

fixPageImports();
