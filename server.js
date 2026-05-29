const http = require("http");
const fs   = require("fs");
const path = require("path");

const ROOT              = __dirname;
const IMAGES_DIR        = path.join(ROOT, "img");
const INICIAL_DIR       = path.join(ROOT, "inicial");
const PRIMARIA_DIR      = path.join(ROOT, "primaria");
const COLEGIOS_DIR      = path.join(ROOT, "img colegios");
const INGENIERITOS_DIR  = path.join(ROOT, "img ingenieritos eduardo de habich");
const BANDA_DIR         = path.join(ROOT, "img banda");
const LOGOS_DIR         = path.join(ROOT, "logos imagen principal");
const LOGO_DIR          = path.join(ROOT, "logo");
const PORTADAS_DIR      = path.join(ROOT, "img-portadas");
const HTML_FILE      = path.join(ROOT, "index.html");
const SECTIONS_DIR   = path.join(ROOT, "sections");
const SLIDES_DIR     = path.join(ROOT, "slides_png", "out");
const PORT = 3000;

const IE_PHOTOS_DIR    = path.join(ROOT, "img-ies");
const COLEGIOS_NEW_DIR = path.join(ROOT, "colegios nuevos");
const CEPRE_UNI_DIR    = path.join(ROOT, "cepre uni");

const MIME = { ".png":"image/png", ".jpg":"image/jpeg", ".jpeg":"image/jpeg", ".jfif":"image/jpeg", ".gif":"image/gif" };

/* Combina shell + secciones en memoria */
function buildPresentation() {
  const shell = fs.readFileSync(HTML_FILE, "utf8");
  const files = fs.readdirSync(SECTIONS_DIR)
    .filter(f => f.endsWith(".html"))
    .sort();
  const sections = files
    .map(f => fs.readFileSync(path.join(SECTIONS_DIR, f), "utf8"))
    .join("\n\n");
  return shell.replace("<!-- %%SECTIONS%% -->", sections);
}

const server = http.createServer((req, res) => {
  /* ── Presentación principal ── */
  if (req.url === "/" || req.url === "/index.html") {
    try {
      const html = fs.readFileSync(HTML_FILE, "utf8");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
      return res.end(html);
    } catch (e) {
      res.writeHead(500);
      return res.end("Error: " + e.message);
    }
  }

  /* ── CEPRE UNI /cepre-uni/ ── */
  if (req.url.startsWith("/cepre-uni/")) {
    const name = decodeURIComponent(req.url.slice("/cepre-uni/".length).split('?')[0].split('#')[0]);
    const file = path.join(CEPRE_UNI_DIR, name);
    if (!file.startsWith(CEPRE_UNI_DIR)) { res.writeHead(403); return res.end(); }
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    const ext = path.extname(name).toLowerCase();
    const ct = { '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.pdf':'application/pdf' };
    res.writeHead(200, { "Content-Type": ct[ext] || "application/octet-stream" });
    return fs.createReadStream(file).pipe(res);
  }

  /* ── Colegios Nuevos /colegios-nuevos/ ── */
  if (req.url.startsWith("/colegios-nuevos/")) {
    const name = decodeURIComponent(req.url.slice("/colegios-nuevos/".length).split('?')[0].split('#')[0]);
    const file = path.join(COLEGIOS_NEW_DIR, name);
    if (!file.startsWith(COLEGIOS_NEW_DIR)) { res.writeHead(403); return res.end(); }
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    const ext = path.extname(name).toLowerCase();
    const ct = { '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.pdf':'application/pdf' };
    res.writeHead(200, { "Content-Type": ct[ext] || "application/octet-stream" });
    return fs.createReadStream(file).pipe(res);
  }

  /* ── Fotos IEs nuevas creadas /img-ies/ ── */
  if (req.url.startsWith("/img-ies/")) {
    const name = path.basename(decodeURIComponent(req.url.slice("/img-ies/".length)));
    const file = path.join(IE_PHOTOS_DIR, name);
    if (!file.startsWith(IE_PHOTOS_DIR)) { res.writeHead(403); return res.end(); }
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    const ext = path.extname(name).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    return fs.createReadStream(file).pipe(res);
  }

  /* ── Imágenes /img ingenieritos eduardo de habich/ ── */
  if (req.url.startsWith("/img%20ingenieritos%20eduardo%20de%20habich/")) {
    const name = decodeURIComponent(req.url.slice("/img%20ingenieritos%20eduardo%20de%20habich/".length));
    const file = path.join(INGENIERITOS_DIR, name);
    if (!file.startsWith(INGENIERITOS_DIR)) { res.writeHead(403); return res.end(); }
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    const ext = path.extname(name).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    return fs.createReadStream(file).pipe(res);
  }

  /* ── Imágenes /img banda/ ── */
  if (req.url.startsWith("/img%20banda/")) {
    const name = decodeURIComponent(req.url.slice("/img%20banda/".length));
    const file = path.join(BANDA_DIR, path.basename(name));
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    const ext = path.extname(name).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    return fs.createReadStream(file).pipe(res);
  }

  /* ── Imágenes /img logos/ ── */
  if (req.url.startsWith("/img%20logos/")) {
    const name = decodeURIComponent(req.url.slice("/img%20logos/".length));
    const file = path.join(LOGOS_DIR, path.basename(name));
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    const ext = path.extname(name).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    return fs.createReadStream(file).pipe(res);
  }

  /* ── Imágenes /logo/ ── */
  if (req.url.startsWith("/logo/")) {
    const name = decodeURIComponent(req.url.slice("/logo/".length));
    const file = path.join(LOGO_DIR, path.basename(name));
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    const ext = path.extname(name).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    return fs.createReadStream(file).pipe(res);
  }

  /* ── Imágenes /img colegios/ ── */
  if (req.url.startsWith("/img%20colegios/")) {
    const name = decodeURIComponent(req.url.slice("/img%20colegios/".length));
    const file = path.join(COLEGIOS_DIR, path.basename(name));
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    const ext = path.extname(name).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    return fs.createReadStream(file).pipe(res);
  }

  /* ── Imágenes /img/ ── */
  if (req.url.startsWith("/img/")) {
    const name = path.basename(decodeURIComponent(req.url));
    const file = path.join(IMAGES_DIR, name);
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    const ext = path.extname(name).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    return fs.createReadStream(file).pipe(res);
  }

  /* ── Imágenes /inicial/ ── */
  if (req.url.startsWith("/inicial/")) {
    const name = path.basename(decodeURIComponent(req.url));
    const file = path.join(INICIAL_DIR, name);
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    const ext = path.extname(name).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    return fs.createReadStream(file).pipe(res);
  }

  /* ── Imágenes /img-portadas/ ── */
  if (req.url.startsWith("/img-portadas/")) {
    const name = path.basename(decodeURIComponent(req.url));
    const file = path.join(PORTADAS_DIR, name);
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    const ext = path.extname(name).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    return fs.createReadStream(file).pipe(res);
  }

  /* ── Imágenes sueltas en raíz ── */
  if (/^\/([\w\-]+)\.(png|jpg|jpeg|gif)$/i.test(req.url)) {
    const file = path.join(ROOT, path.basename(decodeURIComponent(req.url)));
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    return fs.createReadStream(file).pipe(res);
  }

  /* ── Imágenes /primaria/ ── */
  if (req.url.startsWith("/primaria/")) {
    const name = path.basename(decodeURIComponent(req.url));
    const file = path.join(PRIMARIA_DIR, name);
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    const ext = path.extname(name).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    return fs.createReadStream(file).pipe(res);
  }

  /* ── Grid de slides PNG (legacy) ── */
  if (req.url === "/grid") {
    if (!fs.existsSync(SLIDES_DIR)) { res.writeHead(404); return res.end("slides not found"); }
    const slides = fs.readdirSync(SLIDES_DIR)
      .filter(f => /\.(png|PNG)$/.test(f))
      .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));
    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Grid de Diapositivas</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0f172a;font-family:sans-serif}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px;padding:24px;max-width:1400px;margin:0 auto}
.card{background:#1e293b;border-radius:8px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:.2s}
.card:hover{border-color:#f59e0b;transform:translateY(-3px)}
.card img{width:100%;display:block}
.card-f{padding:6px 10px}
.num{background:#f59e0b;color:#0f172a;font-size:10px;font-weight:700;padding:2px 6px;border-radius:3px}
header{background:#1e293b;border-bottom:3px solid #f59e0b;padding:14px 24px;color:#f1f5f9;font-size:13px;position:sticky;top:0;z-index:100}
</style></head><body>
<header>${slides.length} diapositivas — <a href="/" style="color:#f59e0b">← Presentación</a></header>
<div class="grid">${slides.map((f,i)=>`<div class="card"><img src="/slide/${f}" loading="lazy"><div class="card-f"><span class="num">Diap. ${i+1}</span></div></div>`).join("")}</div>
</body></html>`;
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(html);
  }

  /* ── Slides PNG individuales (legacy) ── */
  if (req.url.startsWith("/slide/")) {
    const file = path.join(SLIDES_DIR, path.basename(req.url));
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "Content-Type": "image/png" });
    return fs.createReadStream(file).pipe(res);
  }

  /* ── Archivos sueltos en raíz (imágenes y favicon) ── */
  if (/^\/([\w\-\s]+)\.(png|jpg|jpeg|gif|ico)$/i.test(req.url)) {
    const file = path.join(ROOT, decodeURIComponent(path.basename(req.url)));
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    const ext = path.extname(file).toLowerCase();
    const mimeTypes = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.ico': 'image/x-icon'
    };
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
    return fs.createReadStream(file).pipe(res);
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`   Presentación  → http://localhost:${PORT}/`);
  console.log(`   Grid slides   → http://localhost:${PORT}/grid`);
  console.log(`   Secciones     → ${SECTIONS_DIR}`);
});
