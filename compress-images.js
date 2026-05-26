const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DIRS = [
  'img',
  'img colegios',
  'img ingenieritos eduardo de habich',
  'inicial',
  'logo',
];

const JPEG_QUALITY = 80;
const PNG_QUALITY  = 80;

function getAllImages(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllImages(full));
    } else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

async function compress(file) {
  const ext = path.extname(file).toLowerCase();
  const before = fs.statSync(file).size;
  const tmp = file + '.tmp';
  try {
    const img = sharp(file);
    if (ext === '.png') {
      await img.png({ quality: PNG_QUALITY, compressionLevel: 9 }).toFile(tmp);
    } else {
      await img.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(tmp);
    }
    const after = fs.statSync(tmp).size;
    if (after < before) {
      fs.renameSync(tmp, file);
      return { file, before, after, saved: before - after };
    } else {
      fs.unlinkSync(tmp);
      return { file, before, after: before, saved: 0 };
    }
  } catch (e) {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    console.error('  ERROR:', file, e.message);
    return { file, before, after: before, saved: 0 };
  }
}

(async () => {
  const root = __dirname;
  let images = [];
  for (const d of DIRS) images.push(...getAllImages(path.join(root, d)));

  console.log(`Comprimiendo ${images.length} imágenes...`);
  let totalBefore = 0, totalSaved = 0;

  for (const file of images) {
    const r = await compress(file);
    totalBefore += r.before;
    totalSaved  += r.saved;
    const pct = r.before > 0 ? ((r.saved / r.before) * 100).toFixed(1) : '0.0';
    const rel = path.relative(root, r.file);
    if (r.saved > 0) {
      console.log(`  ✓ ${rel.padEnd(80)} ${(r.before/1024).toFixed(0).padStart(6)} KB → ${(r.after/1024).toFixed(0).padStart(6)} KB  (-${pct}%)`);
    } else {
      console.log(`  = ${rel.padEnd(80)} ${(r.before/1024).toFixed(0).padStart(6)} KB  (ya optimizada)`);
    }
  }

  console.log('\n' + '─'.repeat(110));
  console.log(`Total antes : ${(totalBefore/1024/1024).toFixed(1)} MB`);
  console.log(`Total ahorrado: ${(totalSaved/1024/1024).toFixed(1)} MB`);
  console.log(`Total después : ${((totalBefore-totalSaved)/1024/1024).toFixed(1)} MB`);
})();
