// Pinta las tarjetas a partir de proyectos/lista.json (lo genera generar-lista.mjs).
const lista = document.getElementById('lista');
document.getElementById('anio').textContent = new Date().getFullYear();

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const seguro = (url) => (/^https?:\/\//.test(url || '') ? url : '');

function tarjeta(p) {
  const imgs = p.imagenes || [];
  const portada = imgs.length
    ? `<button class="portada" type="button" aria-label="Ampliar captura de ${esc(p.titulo)}">
        <img src="${esc(imgs[0])}" alt="Captura de ${esc(p.titulo)}" loading="lazy" width="1600" height="1000">
      </button>`
    : '';
  const miniaturas = imgs.length > 1
    ? `<div class="miniaturas">${imgs.map((src, i) => `<button type="button" data-src="${esc(src)}" aria-label="Captura ${i + 1} de ${imgs.length}"${i ? '' : ' aria-current="true"'}><img src="${esc(src)}" alt="" loading="lazy"></button>`).join('')}</div>`
    : '';
  const ligas = [
    seguro(p.enlace) && `<a href="${esc(p.enlace)}" target="_blank" rel="noopener">Ver en vivo ↗</a>`,
    seguro(p.repo) && `<a href="${esc(p.repo)}" target="_blank" rel="noopener">Código ↗</a>`,
  ].filter(Boolean).join('');
  return `<article class="tarjeta">
    ${portada}
    ${miniaturas}
    <div class="cuerpo">
      <div class="meta mono"><span>${esc(p.tipo)}</span><span>${esc(p.anio)}</span></div>
      <h3>${esc(p.titulo)}</h3>
      <p>${esc(p.descripcion)}</p>
      <ul class="chips">${(p.tecnologias || []).map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      ${ligas ? `<div class="ligas">${ligas}</div>` : ''}
    </div>
  </article>`;
}

// Miniatura → cambia la imagen grande; imagen grande → se abre ampliada.
const visor = document.getElementById('visor');
lista.addEventListener('click', (e) => {
  const mini = e.target.closest('.miniaturas button');
  const grande = e.target.closest('.portada');
  if (mini) {
    const t = mini.closest('.tarjeta');
    t.querySelector('.portada img').src = mini.dataset.src;
    t.querySelectorAll('.miniaturas button').forEach((b) => b.removeAttribute('aria-current'));
    mini.setAttribute('aria-current', 'true');
  } else if (grande) {
    const img = grande.querySelector('img');
    visor.querySelector('img').src = img.src;
    visor.querySelector('img').alt = img.alt;
    visor.showModal();
  }
});
visor.addEventListener('click', () => visor.close());

fetch('proyectos/lista.json', { cache: 'no-store' })
  .then((r) => (r.ok ? r.json() : Promise.reject()))
  .then((proyectos) => {
    document.getElementById('conteo').textContent = `${String(proyectos.length).padStart(2, '0')} proyectos`;
    lista.innerHTML = proyectos.length
      ? proyectos.map(tarjeta).join('')
      : '<p class="vacio">Pronto habrá proyectos aquí.</p>';
  })
  .catch(() => {
    lista.innerHTML = '<p class="vacio">No se pudieron cargar los proyectos. Corre <code>node generar-lista.mjs</code>.</p>';
  });
