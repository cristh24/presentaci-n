const fs   = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

// ── Lee index.html (fuente única = localhost) ──────────────
let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// ── Única corrección necesaria: url() con ruta absoluta ────
html = html.replace(/url\('\/img-portadas\//g, "url('img-portadas/");

// ── Crea carpeta dist ──────────────────────────────────────
if (!fs.existsSync(DIST)) fs.mkdirSync(DIST);
fs.writeFileSync(path.join(DIST, 'index.html'), html, 'utf8');

// ── Copia assets ──────────────────────────────────────────
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const f of fs.readdirSync(src)) {
    const s = path.join(src, f), d = path.join(dest, f);
    if (fs.statSync(s).isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

copyDir(path.join(ROOT, 'img'),                                    path.join(DIST, 'img'));
copyDir(path.join(ROOT, 'img-portadas'),                           path.join(DIST, 'img-portadas'));
copyDir(path.join(ROOT, 'img colegios'),                           path.join(DIST, 'img colegios'));
copyDir(path.join(ROOT, 'img ingenieritos eduardo de habich'),     path.join(DIST, 'img ingenieritos eduardo de habich'));
copyDir(path.join(ROOT, 'img banda'),                              path.join(DIST, 'img banda'));
copyDir(path.join(ROOT, 'logo'),                                   path.join(DIST, 'logo'));
copyDir(path.join(ROOT, 'inicial'),                                path.join(DIST, 'inicial'));
copyDir(path.join(ROOT, 'primaria'),                               path.join(DIST, 'primaria'));

for (const f of ['secundaria.png', 'enla.PNG']) {
  const src = path.join(ROOT, f);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(DIST, f));
}

console.log('✅  Build OK  →  dist/index.html');
