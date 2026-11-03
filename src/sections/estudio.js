import './estudio.css';

// Foto pequena dentro da linha, logo depois da palavra que ela ilustra (fica decorativa para leitor de tela).
const foto = (src, posicao = '50% 50%') =>
  `<span class="p foto-linha" aria-hidden="true"><img src="${src}" alt="" loading="lazy" style="object-position:${posicao}" /></span>`;

// Cada palavra vira um <span class="p"> para subir em sequência; `ancora` liga a palavra a uma nota da margem.
const palavra = (t, ancora) => `<span class="p"${ancora != null ? ` data-ancora="${ancora}"` : ''}>${t}</span>`;
const frase = (texto) =>
  texto
    .split(' ')
    .map((t) => palavra(t))
    .join(' ');

// Só números reais (os mesmos aprovados no Livro da Marca e no site anterior).
const notas = [
  { texto: '1 pessoa: você fala com quem faz', tam: 19 },
  { texto: '10+ anos resolvendo problemas reais', tam: 15 },
  { texto: '3 projetos no ar', tam: 13 },
];

export const estudio = () => `
<section class="estudio" id="sobre" aria-labelledby="sobre-rotulo">
  <p class="rotulo" id="sobre-rotulo">Sobre</p>
  <div class="estudio__pagina">
    <p class="estudio__texto titulo" data-manifesto>
      ${frase('Sou o')} ${palavra('Lino.', 0)} ${frase('Desenho e')} ${palavra('programo', 1)} ${frase('sites, sistemas e marcas para negócios pequenos')}${palavra(':', 2)}
      ${frase('o ateliê')} ${foto('/trabalhos/real/linha-croche.webp', '40% 60%')} ${frase('de crochê, a empreiteira, o painel')}
      ${foto('/trabalhos/real/linha-painel.webp', '0% 0%')} ${frase('da manutenção.')}
    </p>
    <aside class="estudio__margem" aria-label="Números">
      <ul>
        ${notas
          .map(
            (n, i) =>
              `<li class="nota" data-nota="${i}" style="font-size:${n.tam}px"><span class="nota__ponto" aria-hidden="true"></span>${n.texto}</li>`,
          )
          .join('')}
      </ul>
    </aside>
    <svg class="estudio__fios" aria-hidden="true"></svg>
  </div>
  <figure class="assinatura">
    <img class="assinatura__foto" src="/trabalhos/real/avatar-lino.webp" alt="Lino" width="320" height="320" loading="lazy" />
    <figcaption>
      <strong class="titulo">Lino</strong>
      <span>Engenheiro de software, design e motion · CodimDev</span>
    </figcaption>
  </figure>
</section>`;
