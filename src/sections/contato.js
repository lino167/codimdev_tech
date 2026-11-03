import './contato.css';
import letreiro from '../brand/letreiro.svg?raw';

// Contatos ainda não confirmados ficam null e aparecem como [preencher] (lista de pendências).
export const CONTATO = {
  email: null,
  whatsapp: null, // só dígitos, com DDI e DDD: '5547...'
  linkedin: null,
  github: 'https://github.com/lino167',
  cidade: 'Blumenau, SC · atendimento remoto no Brasil e no exterior',
};

// Fotos que flutuam atrás da frase (eco do túnel). x/y em % da seção, w em vw, prof de 0 (longe) a 1 (perto).
export const flutuantes = [
  { src: 'r02', x: 6, y: 8, w: 11, prof: 0.9 },
  { src: 'r08', x: 24, y: 4, w: 6, prof: 0.3 },
  { src: 'r10', x: 41, y: 10, w: 5, prof: 0.1 },
  { src: 'r05', x: 62, y: 4, w: 6, prof: 0.45 },
  { src: 'r01', x: 78, y: 9, w: 13, prof: 1 },
  { src: 'r14', x: 3, y: 42, w: 6, prof: 0.2 },
  { src: 'r11', x: 12, y: 64, w: 13, prof: 0.95 },
  { src: 'r07', x: 34, y: 78, w: 6, prof: 0.35 },
  { src: 'r09', x: 50, y: 70, w: 6, prof: 0.05 },
  { src: 'r16', x: 64, y: 80, w: 9, prof: 0.6 },
  { src: 'r13', x: 83, y: 58, w: 10, prof: 0.75 },
  { src: 'r18', x: 91, y: 32, w: 5, prof: 0.15 },
  { src: 'r04', x: 74, y: 30, w: 5, prof: 0.25 },
  { src: 'r15', x: 27, y: 36, w: 5, prof: 0.08 },
];

const foto = (f) => {
  const blur = ((1 - f.prof) * 6).toFixed(1);
  const op = (0.45 + f.prof * 0.55).toFixed(2);
  return `<img class="ceu__foto" src="/trabalhos/real/${f.src}.webp" alt="" loading="lazy" data-prof="${f.prof}"
    style="left:${f.x}%;top:${f.y}%;--w:${f.w};filter:blur(${blur}px);opacity:${op};z-index:${Math.round(f.prof * 10)}" />`;
};

const pendente = (rotulo) => `<span class="pendente">[preencher ${rotulo}]</span>`;
const linkOu = (url, texto, rotulo) =>
  url ? `<a class="sublinha" href="${url}" rel="noopener" target="_blank">${texto}</a>` : pendente(rotulo);

export const contato = () => `
<section class="contato" id="contato" aria-labelledby="contato-frase">
  <div class="ceu" aria-hidden="true">${flutuantes.map(foto).join('')}</div>
  <figure class="depoimento">
    <blockquote>
      <p id="contato-frase" class="titulo">Você fala direto com quem desenha e programa. Sem intermediário e sem reunião <em>desnecessária.</em></p>
    </blockquote>
    <figcaption>Lino, CodimDev</figcaption>
  </figure>
</section>`;

export const rodape = () => {
  const zap = CONTATO.whatsapp ? `https://wa.me/${CONTATO.whatsapp}` : null;
  const acao = zap ?? (CONTATO.email ? `mailto:${CONTATO.email}` : '#contato');
  return `
<footer class="rodape">
  <div class="rodape__colunas">
    <div class="rodape__col">
      <p class="rodape__chamada titulo">Tem um projeto em mente?</p>
      <a class="pilula pilula--vermelho pilula--grande" href="${acao}">Conversar sobre o projeto</a>
    </div>
    <div class="rodape__col">
      ${CONTATO.email ? `<a class="sublinha" href="mailto:${CONTATO.email}">${CONTATO.email}</a>` : pendente('e-mail')}
      ${zap ? `<a class="sublinha" href="${zap}">WhatsApp</a>` : pendente('WhatsApp')}
      <p>${CONTATO.cidade}</p>
    </div>
    <ul class="rodape__col rodape__redes">
      <li>${linkOu(CONTATO.linkedin, 'LinkedIn', 'LinkedIn')}</li>
      <li>${linkOu(CONTATO.github, 'GitHub', 'GitHub')}</li>
    </ul>
  </div>
  <p class="rodape__linha"><span>© 2026 CodimDev · Tudo conectado.</span><a class="sublinha" href="#topo">Voltar ao topo ↑</a></p>
  <div class="rodape__marca" aria-hidden="true"><div class="rodape__marca-in">${letreiro}</div></div>
</footer>`;
};
