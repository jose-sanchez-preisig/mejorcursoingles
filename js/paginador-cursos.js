
const cursosPorPagina = 10;
let cursosOriginales = [];
let cursosFiltrados = [];
let paginaActual = 1;
let dataCargada = null;

async function cargarCursosJSON() {
  if (!dataCargada) {
    const res = await fetch('data/cursos-index.json');
    dataCargada = await res.json();
  }
  return dataCargada;
}

function crearCardHTML(curso) {
  const estrellas = Math.floor(curso.rating);
  const media = curso.rating - estrellas >= 0.5;
  const vacías = 5 - estrellas - (media ? 1 : 0);

  const estrellasHTML = 
    '<i class="fas fa-star"></i>'.repeat(estrellas) +
    (media ? '<i class="fas fa-star-half-alt"></i>' : '') +
    '<i class="far fa-star"></i>'.repeat(vacías);

  const bullets = curso.bullets.map(b => `<li>${b}</li>`).join('');
  const tags = curso.tags.map(t => `<span class="badge bg-light text-dark border me-1">${t}</span>`).join('');
  const comentarios = curso.comentarios_index.slice(0, 4).map(c => `
    <p class="mb-1"><i class="fa-solid fa-${c.icono} ${c.color} me-1"></i>“${c.texto}”</p>
  `).join('');

  const temp = document.createElement('div');
  temp.innerHTML = `
    <div class="col-12">
      <a href="cursos/${curso.slug}-curso-ingles-opiniones.html" class="text-decoration-none text-dark">
        <div class="card shadow-sm border-0 px-5 pt-4 pb-2 hover-shadow ${curso.nombre === 'Poliglota' ? 'card-first' : ''}" data-rating="${curso.rating}">
          <!-- Fila 1: encabezado -->
          <div class="d-flex flex-wrap justify-content-between align-items-start mb-3">
            <!-- Izquierda: Ranking + nombre -->
            <div>
              <div class="d-flex align-items-center mb-1">
                <span class="badge ${curso.nombre === 'Poliglota' ? 'bg-warning text-dark p-2' : 'bg-light border text-dark py-2 px-3'} fw-normal me-3">
                  ${curso.nombre === 'Poliglota' ? '<i class="fa-solid fa-trophy me-1"></i>' : ''}#${curso.ranking}
                </span>
                <h5 class="mb-0">${curso.nombre}</h5>
              </div>
            </div>
            <!-- Derecha: Precio + estrellas + score -->
            <div class="d-flex align-items-center justify-content-end gap-2">
              <!-- Precio estimado -->
              <span class="border border-primary text-primary ps-2 pe-1 py-1 rounded d-flex align-items-center" style="font-size: 0.8rem;">
                ${'<i class="fas fa-dollar-sign me-1" style="opacity: 1;"></i>'.repeat(curso.precio_nivel)}
                ${'<i class="fas fa-dollar-sign me-1" style="opacity: 0.3;"></i>'.repeat(3 - curso.precio_nivel)}
              </span>

              <!-- Estrellas -->                
              <div style="color: #fbbf24; font-size: 1.2rem;">
                ${estrellasHTML}
                <span class="fw-normal text-muted" style="font-size: 0.85rem;">(+${curso.opiniones.toLocaleString()})</span>
              </div>

              <!-- Puntaje -->
              <span class="bg-primary text-white fw-semibold rounded px-2 py-1" style="font-size: 1rem;">
                ${curso.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <!-- Fila 2: tres columnas -->
          <div class="row g-4 align-items-start">
            <!-- Columna 1: Logo -->
            <div class="col-12 col-md-2 d-flex justify-content-center align-items-start">
              <img loading="lazy" src="${curso.logo}" class="img-fluid rounded d-block mx-auto img-thumbnail" alt="Logo de ${curso.nombre}" style="max-height: 70px;">
            </div>

            <!-- Columna 2: Info general -->
            <div class="col-12 col-md-6">
              <p class="text-muted small mb-2">${curso.descripcion}</p>
              <ul class="small ps-3 mb-2 text-muted">${bullets}</ul>
              <div class="mb-2">${tags}</div>
            </div>
            <!-- Comentarios -->
            <div class="col-12 col-md-4 small text-muted">
              ${comentarios}
            </div>
          </div>
        </div>
      </a>
    </div> 
  `;
  return temp.firstElementChild;
}

function renderizarCursos() {
  const totalPaginas = Math.ceil(cursosFiltrados.length / cursosPorPagina);
  const contenedor = document.getElementById('contenedor-cursos');
  contenedor.innerHTML = '';

  const inicio = (paginaActual - 1) * cursosPorPagina;
  const fin = inicio + cursosPorPagina;

  const cursosMostrar = cursosFiltrados.slice(inicio, fin);
  cursosMostrar.forEach((card, i) => {
    if (typeof card === 'string') {
      const temp = document.createElement('div');
      temp.innerHTML = card;
      contenedor.appendChild(temp.firstElementChild);
    } else {
      contenedor.appendChild(card);
    }
  });

  renderizarControlesPaginacion(totalPaginas);
}

function renderizarControlesPaginacion(totalPaginas) {
  const pag = document.getElementById("paginacion");
  if (!pag) return;
  pag.innerHTML = '';

  const crearBtn = (texto, disabled, callback) => {
    const li = document.createElement('li');
    li.className = `page-item${disabled ? ' disabled' : ''}`;
    const a = document.createElement('button');
    a.className = 'page-link';
    a.textContent = texto;
    a.onclick = callback;
    li.appendChild(a);
    return li;
  };

  pag.appendChild(crearBtn('←', paginaActual === 1, () => {
    paginaActual--;
    renderizarCursos();
  }));

  for (let i = 1; i <= totalPaginas; i++) {
    const li = document.createElement('li');
    li.className = `page-item${i === paginaActual ? ' active' : ''}`;
    const a = document.createElement('button');
    a.className = 'page-link';
    a.textContent = i;
    a.onclick = () => {
      paginaActual = i;
      renderizarCursos();
    };
    li.appendChild(a);
    pag.appendChild(li);
  }

  pag.appendChild(crearBtn('→', paginaActual === totalPaginas, () => {
    paginaActual++;
    renderizarCursos();
  }));
}

document.querySelectorAll('.filter-star').forEach(btn => {
  btn.addEventListener('click', async () => {
    const min = parseFloat(btn.dataset.min);
    paginaActual = 1;

    const json = await cargarCursosJSON();
    cursosOriginales = json.map(c => crearCardHTML(c));
    cursosFiltrados = cursosOriginales.filter(card => {
      const rating = parseFloat(card.querySelector('.card').dataset.rating);
      return rating >= min;
    });

    document.querySelectorAll('.filter-star').forEach(b => {
      b.classList.remove('btn-primary', 'btn-outline-primary', 'btn-outline-secondary');
      if (b.dataset.min === btn.dataset.min) {
        b.classList.add('btn-primary');
      } else {
        b.classList.add(b.dataset.min === "0" ? 'btn-outline-secondary' : 'btn-outline-primary');
      }
    });

    renderizarCursos();
  });
});

(async () => {
  const cursosHTML = Array.from(document.querySelectorAll('#contenedor-cursos > .col-12')).map(card => card.outerHTML);
  const json = await cargarCursosJSON();
  const cursosJSON = json.slice(cursosHTML.length).map(c => crearCardHTML(c));
  cursosOriginales = [...cursosHTML, ...cursosJSON];
  cursosFiltrados = [...cursosOriginales];
  renderizarCursos();
})();
