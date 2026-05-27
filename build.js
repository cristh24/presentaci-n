const fs   = require('fs');
const path = require('path');

const ROOT     = __dirname;
const DIST     = path.join(ROOT, 'dist');
const SECTIONS = path.join(ROOT, 'sections');

// ── Combina shell + secciones ──────────────────────────────
let html = fs.readFileSync(path.join(ROOT, 'presentacion.html'), 'utf8');
const sections = fs.readdirSync(SECTIONS)
  .filter(f => f.endsWith('.html'))
  .sort()
  .map(f => fs.readFileSync(path.join(SECTIONS, f), 'utf8'))
  .join('\n\n');
html = html.replace('<!-- %%SECTIONS%% -->', sections);

// ── Corrige rutas absolutas → relativas (GitHub Pages) ────
html = html
  .replace(/src="\/img\//g,           'src="img/')
  .replace(/href="\/img\//g,          'href="img/')
  .replace(/src="\/inicial\//g,       'src="inicial/')
  .replace(/src="\/primaria\//g,      'src="primaria/')
  .replace(/src="\/secundaria\.png/g, 'src="secundaria.png')
  .replace(/src="\/enla\.PNG/g,       'src="enla.PNG')
  .replace(/url\('\/img\//g,          "url('img/")
  .replace(/url\('\/img-portadas\//g, "url('img-portadas/");

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

copyDir(path.join(ROOT, 'img'),          path.join(DIST, 'img'));
copyDir(path.join(ROOT, 'img-portadas'), path.join(DIST, 'img-portadas'));
copyDir(path.join(ROOT, 'inicial'),      path.join(DIST, 'inicial'));
copyDir(path.join(ROOT, 'primaria'),     path.join(DIST, 'primaria'));

for (const f of ['secundaria.png', 'enla.PNG']) {
  const src = path.join(ROOT, f);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(DIST, f));
}

console.log('✅  Build OK  →  dist/index.html');
