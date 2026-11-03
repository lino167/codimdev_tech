// A nav some ao rolar para baixo (depois de meia tela) e volta ao rolar para cima, com um véu claro atrás.
export function animarNav(nav) {
  let ultimo = window.scrollY;

  const atualizar = () => {
    const y = window.scrollY;
    const meio = window.innerHeight / 2;
    if (y > meio && y > ultimo + 6) nav.classList.add('is-oculta');
    else if (y < ultimo - 6 || y <= meio) nav.classList.remove('is-oculta');
    nav.classList.toggle('is-veu', y > meio && !nav.classList.contains('is-oculta'));
    if (Math.abs(y - ultimo) > 6) ultimo = y;
  };

  window.addEventListener('scroll', atualizar, { passive: true });
  atualizar();
}
