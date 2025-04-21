function scrollToSeccion(id, e) {
  if (e) e.preventDefault();
  const target = document.getElementById(id);
  if (!target) return;

  const navbar = document.querySelector('.navbar');
  const offset = navbar ? navbar.offsetHeight : 70;

  const top = target.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top,
    behavior: 'smooth'
  });
}
