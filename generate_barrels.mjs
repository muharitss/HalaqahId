import fs from 'fs';
import path from 'path';

const featuresDir = 'src/features';
if (fs.existsSync(featuresDir)) {
    const features = fs.readdirSync(featuresDir);
    for (const feature of features) {
        const featurePath = path.join(featuresDir, feature);
        if (fs.statSync(featurePath).isDirectory()) {
            let exports = '';
            
            // Check if there is a pages folder
            const pagesPath = path.join(featurePath, 'pages');
            if (fs.existsSync(pagesPath)) {
                const pagesFiles = fs.readdirSync(pagesPath);
                for (const file of pagesFiles) {
                    if (file === 'index.tsx') {
                        exports += `export { default } from './pages';\n`;
                    }
                }
            }

            if (exports) {
                fs.writeFileSync(path.join(featurePath, 'index.ts'), exports, 'utf8');
                console.log(`Generated default export index.ts for ${feature}`);
            }
        }
    }
}
