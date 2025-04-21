document.addEventListener("DOMContentLoaded", function () {
  const fechaEl = document.getElementById("ultima-actualizacion");
  if (!fechaEl) return;

  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];

  const hoy = new Date();
  const mes = meses[hoy.getMonth()];
  const año = hoy.getFullYear();
  fechaEl.textContent = `Actualizado en ${mes} ${año}`;
});
