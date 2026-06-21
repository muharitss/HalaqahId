import fs from 'fs';

let f = 'src/features/santri/pages/index.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace(/from '\.\.\/setoran\/hooks\/useSetoran'/g, 'from "../../setoran/hooks/useSetoran"');
c = c.replace(/progres: any/g, 'progres: any'); // Just placeholder to not be empty
fs.writeFileSync(f, c, 'utf8');

// Fix 'item' and 'santri' implicit any
c = c.replace(/\(item\) =>/g, '(item: any) =>');
c = c.replace(/\(santri\) =>/g, '(santri: any) =>');
c = c.replace(/progres\)/g, 'progres: any)');

fs.writeFileSync(f, c, 'utf8');
console.log('Fixed santri/pages/index.tsx');

let absensiTable = 'src/features/absensi/components/RekapAbsensiTable.tsx';
let ac = fs.readFileSync(absensiTable, 'utf8');
ac = ac.replace(/\(item\) =>/g, '(item: any) =>');
fs.writeFileSync(absensiTable, ac, 'utf8');
console.log('Fixed RekapAbsensiTable.tsx');

let halaqahSelector = 'src/features/setoran/components/HalaqahSelector.tsx';
let hc = fs.readFileSync(halaqahSelector, 'utf8');
hc = hc.replace(/\(name\) =>/g, '(name: any) =>');
fs.writeFileSync(halaqahSelector, hc, 'utf8');
console.log('Fixed HalaqahSelector.tsx');

