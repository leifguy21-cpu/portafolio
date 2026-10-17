// Lee cada subcarpeta de proyectos/ (info.json + portada.*) y escribe proyectos/lista.json.
// Las carpetas que empiezan con "_" (como _plantilla) se ignoran.
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';

const raiz = 'proyectos';
const proyectos = [];

for (const carpeta of readdirSync(raiz, { withFileTypes: true })) {
  if (!carpeta.isDirectory() || carpeta.name.startsWith('_')) continue;
  const dir = `${raiz}/${carpeta.name}`;
  if (!existsSync(`${dir}/info.json`)) { console.warn(`Sin info.json: ${dir}`); continue; }
  const info = JSON.parse(readFileSync(`${dir}/info.json`, 'utf8'));
  // Todas las imágenes de la carpeta, en orden de nombre (1.jpg, 2.jpg...); la primera es la portada.
  const imagenes = readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp|svg)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))
    .map((f) => `${dir}/${f}`);
  proyectos.push({ ...info, imagenes });
}

proyectos.sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99) || String(b.anio).localeCompare(String(a.anio)));
writeFileSync(`${raiz}/lista.json`, JSON.stringify(proyectos, null, 2));
console.log(`${proyectos.length} proyecto(s) en ${raiz}/lista.json`);
