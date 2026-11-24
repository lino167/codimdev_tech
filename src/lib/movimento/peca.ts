// Cena 03, a peça principal: a PILHA DE PLACAS. O palco fica preso por 5 telas (4 no celular) e a rolagem leva a câmera
// por cinco placas de uma janela de navegador, empilhadas em 3D: conversa, protótipo, código, testes e no ar.
//
// - A ROLAGEM dirige só o que é contínuo: a órbita da câmera (a rotação do conjunto), a barra de etapa e, nos últimos
//   8%, a virada: as placas descem e se achatam numa janela só, a câmera fica de frente e o palco escurece.
// - O que é POR TEMPO (a placa nova que desce e se encaixa, a escrita, o cursor clicando, as marcas de teste, o pulso
//   da luz) dispara uma vez quando a etapa muda e roda sozinho; o texto da etapa sai e entra palavra por palavra.
// - Os primeiros 6% do pin são a abertura (a primeira placa se firma) e os últimos 8%, a virada.
// Todo texto vem de pt.ts, pelos atributos data-* que o Peca.astro escreve. Movimento reduzido ou sem JS: nada disto
// roda e o CSS mostra só a última placa, achatada, e a lista de etapas.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Etapa {
  rotulo: string;
  frase: string;
  fato: string;
}
interface Dados {
  etapas: Etapa[];
  codigo: string[];
  proposta: { titulo: string; linhas: string[] };
  endereco: string;
  checklist: string[];
}

const ABERTURA = 0.06; // fatia do pin antes da primeira etapa
const VIRADA = 0.08; // fatia do pin depois da última: as placas se achatam e o palco escurece
const SP = 120; // distância entre as placas, em px, ao longo do eixo Z
const QUEDA = 300; // de quanto acima a placa nova começa a descer
const CPS_CODIGO = 40; // caracteres por segundo ao escrever o código
const CPS_ENDERECO = 30;
const ESCURO = '#18191D';
const CLARO = '#F5F4EF';
const TRAMA = '#E9E7E0';

const limitar = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

export function peca({ reduzido }: { reduzido: boolean }) {
  const sec = document.querySelector<HTMLElement>('[data-peca]');
  if (!sec || reduzido) return;
  const palco = sec.querySelector<HTMLElement>('[data-palco]');
  const conjunto = sec.querySelector<HTMLElement>('[data-conjunto]');
  const placas = Array.from(sec.querySelectorAll<HTMLElement>('[data-placa]'));
  const rotulo = sec.querySelector<HTMLElement>('[data-rotulo]');
  const frase = sec.querySelector<HTMLElement>('[data-frase]');
  const fato = sec.querySelector<HTMLElement>('[data-fato]');
  const trilha = sec.querySelector<HTMLElement>('[data-trilha]');
  if (!palco || !conjunto || placas.length !== 5 || !rotulo || !frase || !fato || !trilha) return;
  const dados = JSON.parse(sec.dataset.dados ?? '{}') as Dados;
  if (!dados.etapas?.length) return;
  sec.classList.add('peca--animada');

  // dentro de cada placa
  const q = <T extends Element>(i: number, sel: string) => placas[i].querySelector<T>(sel) as T;
  const qa = <T extends Element>(i: number, sel: string) => Array.from(placas[i].querySelectorAll<T>(sel));
  const riscos = (i: number, raiz = '.placa__svg') => qa<SVGElement>(i, `${raiz} .risco`);
  const propostaTitulo = q<SVGTextElement>(0, '[data-proposta-titulo]');
  const propostaLinhas = qa<SVGTextElement>(0, '[data-proposta-linha]');
  const abas = qa<SVGGElement>(1, '[data-aba]');
  const cursor = q<SVGGElement>(1, '[data-g="cursor"]');
  const telas = {
    telaA: q<SVGGElement>(1, '[data-g="telaA"]'),
    telaB: q<SVGGElement>(1, '[data-g="telaB"]'),
    telaC: q<SVGGElement>(1, '[data-g="telaC"]'),
  };
  const linhasCodigo = qa<SVGTextElement>(2, '[data-linha]');
  const checks = qa<SVGGElement>(3, '[data-check]');
  const endereco = q<SVGTextElement>(4, '[data-endereco]');
  const pulso = q<SVGGElement>(4, '[data-pulso]');
  gsap.set(pulso, { svgOrigin: '916 47' });
  gsap.set(cursor, { x: 860, y: 220 });

  // a câmera: `cam` é o índice (contínuo) da placa em foco; `sp` é a distância entre as placas (vai a 0 na virada)
  const S = { cam: 0, sp: SP };
  const render = () => {
    const achata = 1 - S.sp / SP; // 0 = pilha aberta, 1 = tudo achatado
    placas.forEach((placa, i) => {
      const chega = limitar(S.cam - i + 1, 0, 1); // 0 = ainda não chegou, 1 = no lugar
      const d = Math.max(0, S.cam - i); // quantas placas atrás da que está em foco
      // a anterior fica a 35%, a antepenúltima some devagar: o texto de baixo continua legível
      const rastro = d < 1 ? 1 - 0.65 * d : d < 2 ? 0.35 - 0.23 * (d - 1) : Math.max(0, 0.12 * (3 - d));
      const base = chega * (rastro + (1 - rastro) * achata);
      gsap.set(placa, {
        z: (i - S.cam) * S.sp + (1 - chega) * QUEDA * (1 - achata),
        opacity: base,
        zIndex: i,
      });
    });
  };

  const digitar = (el: Element, texto: string, cps: number, tl: gsap.core.Timeline, em: number) => {
    const o = { n: 0 };
    tl.to(
      o,
      {
        n: texto.length,
        duration: texto.length / cps,
        ease: 'none',
        onUpdate: () => {
          el.textContent = texto.slice(0, Math.round(o.n));
        },
      },
      em,
    );
    return texto.length / cps;
  };
  const desenhar = (tl: gsap.core.Timeline, alvos: SVGElement[], em: number, duracao = 0.5, passo = 0.08) =>
    tl.fromTo(
      alvos,
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: duracao, stagger: passo, ease: 'power2.inOut' },
      em,
    );

  // o que roda por tempo em cada etapa (uma vez, quando a placa chega)
  let seq: gsap.core.Timeline | null = null;
  const ATRASO = 0.55; // a placa desce primeiro; o conteúdo começa quando ela está quase no lugar
  const sequencia = (i: number) => {
    seq?.kill();
    const tl = gsap.timeline({ delay: ATRASO });
    seq = tl;
    switch (i) {
      case 0: {
        propostaTitulo.textContent = '';
        propostaLinhas.forEach((t) => (t.textContent = ''));
        const r = riscos(0);
        gsap.set(r, { strokeDashoffset: 1 });
        desenhar(tl, r.slice(0, 7), 0.15, 0.45, 0.07);
        digitar(propostaTitulo, dados.proposta.titulo, 24, tl, 0.2);
        dados.proposta.linhas.forEach((texto, k) => {
          const base = 0.8 + k * 0.7;
          digitar(propostaLinhas[k], texto, 20, tl, base);
          desenhar(tl, r.slice(7 + k * 2, 9 + k * 2), base + 0.15, 0.4, 0.1);
        });
        break;
      }
      case 1: {
        const centro = (k: number) => ({ x: 1019 + k * 44, y: 40 });
        const ativar = (k: number) => {
          abas.forEach((a, n) => {
            gsap.to(a.querySelector('.aba'), { fill: n === k ? TRAMA : 'rgba(0,0,0,0)', duration: 0.15 });
          });
        };
        const tela = (qual: keyof typeof telas) => {
          (Object.keys(telas) as (keyof typeof telas)[]).forEach((n) =>
            gsap.to(telas[n], { opacity: n === qual ? 1 : 0, duration: 0.15, ease: 'none', overwrite: 'auto' }),
          );
        };
        const clique = () => tl.to(cursor, { scale: 0.8, duration: 0.07, yoyo: true, repeat: 1, ease: 'none' });
        gsap.set(cursor, { x: 860, y: 230, opacity: 0 });
        gsap.set([telas.telaB, telas.telaC], { opacity: 0 });
        tl.to(cursor, { opacity: 1, duration: 0.2 }, 0.1).to(
          cursor,
          { ...centro(0), duration: 0.7, ease: 'power3.inOut' },
          0.2,
        );
        clique().call(() => ativar(0));
        tl.to(cursor, { ...centro(1), duration: 0.5, ease: 'power3.inOut' }, '+=0.35');
        clique().call(() => {
          ativar(1);
          tela('telaB');
        });
        tl.to(cursor, { ...centro(2), duration: 0.5, ease: 'power3.inOut' }, '+=0.45');
        clique().call(() => {
          ativar(2);
          tela('telaC');
        });
        tl.to(cursor, { ...centro(0), duration: 0.6, ease: 'power3.inOut' }, '+=0.5');
        clique().call(() => {
          ativar(0);
          tela('telaA');
        });
        break;
      }
      case 2: {
        linhasCodigo.forEach((t) => (t.textContent = ''));
        let t = 0.1;
        dados.codigo.forEach((linha, k) => {
          t += digitar(linhasCodigo[k], linha, CPS_CODIGO, tl, t) + 0.05;
        });
        break;
      }
      case 3: {
        const caminhos = checks.map((c) => c.querySelector<SVGElement>('path.risco') as SVGElement);
        const celular = riscos(3, '[data-g="celular"]');
        gsap.set(caminhos, { strokeDashoffset: 1 });
        gsap.set(celular, { strokeDashoffset: 1 });
        desenhar(tl, celular, 0, 0.9, 0);
        caminhos.forEach((c, k) =>
          tl.fromTo(
            c,
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.35, ease: 'power2.out' },
            0.8 + k * 0.25,
          ),
        );
        break;
      }
      default: {
        endereco.textContent = '';
        digitar(endereco, dados.endereco, CPS_ENDERECO, tl, 0.1);
        tl.fromTo(pulso, { scale: 1 }, { scale: 1.7, duration: 0.4, yoyo: true, repeat: 1, ease: 'power2.out' }, 0.7);
      }
    }
  };

  // o texto da etapa: sai antes da próxima e entra palavra por palavra, saindo do desfoque
  let atual = -1;
  let troca: gsap.core.Tween | null = null;
  const trocarTexto = (i: number, primeira = false) => {
    troca?.kill();
    const entrar = () => {
      const e = dados.etapas[i];
      rotulo.textContent = e.rotulo;
      fato.textContent = e.fato;
      frase.replaceChildren(
        ...e.frase.split(' ').flatMap((palavra, k, todas) => {
          const s = document.createElement('span');
          s.className = 'pal';
          s.textContent = palavra;
          return k < todas.length - 1 ? [s, document.createTextNode(' ')] : [s];
        }),
      );
      gsap.fromTo(
        frase.querySelectorAll('.pal'),
        { opacity: 0, filter: 'blur(6px)', y: 8 },
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' },
      );
      gsap.fromTo([rotulo, fato], { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.1, overwrite: 'auto' });
    };
    if (primeira) return entrar();
    troca = gsap.to([frase, rotulo, fato], {
      opacity: 0,
      duration: 0.2,
      ease: 'power1.in',
      onComplete: () => {
        gsap.set([frase, rotulo, fato], { opacity: 1 });
        entrar();
      },
    });
  };

  const ir = (i: number, primeira = false) => {
    if (i === atual) return;
    atual = i;
    if (primeira) {
      S.cam = i;
      render();
    } else {
      gsap.to(S, { cam: i, duration: 0.9, ease: 'power3.inOut', onUpdate: render, overwrite: 'auto' });
    }
    sequencia(i);
    trocarTexto(i, primeira);
  };

  // o que é contínuo: a câmera dá a volta, a barra de etapa anda e, no fim, tudo se achata e o palco escurece
  const rolagem = gsap.timeline({ defaults: { ease: 'none' } });
  rolagem
    .fromTo(
      conjunto,
      { rotationX: 56, rotationZ: -30, scale: 0.86, y: -50 },
      { rotationX: 46, rotationZ: -20, duration: 1 - VIRADA },
      0,
    )
    .fromTo(trilha, { '--p': 0 }, { '--p': 1, duration: 1 - ABERTURA - VIRADA }, ABERTURA)
    .to(S, { sp: 0, duration: VIRADA, ease: 'power2.inOut', onUpdate: render }, 1 - VIRADA)
    .to(conjunto, { rotationX: 0, rotationZ: 0, scale: 0.82, y: 0, duration: VIRADA, ease: 'power2.inOut' }, 1 - VIRADA)
    .to(
      palco,
      { backgroundColor: ESCURO, color: CLARO, duration: VIRADA * 0.6, ease: 'power1.inOut' },
      1 - VIRADA * 0.6,
    );

  gsap.set(qa<SVGGElement>(1, '.aba'), { fill: 'rgba(0,0,0,0)' });
  gsap.set(riscos(0), { strokeDashoffset: 1 });
  [...linhasCodigo, ...propostaLinhas, propostaTitulo, endereco].forEach((t) => (t.textContent = ''));
  render();

  ScrollTrigger.create({
    trigger: palco,
    start: 'top top',
    end: () => `+=${window.innerWidth <= 700 ? 400 : 500}%`,
    pin: true,
    scrub: 0.6,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    animation: rolagem,
    onUpdate: (self) => {
      const p = self.progress;
      const f = limitar((p - ABERTURA) / (1 - ABERTURA - VIRADA), 0, 1);
      ir(Math.min(dados.etapas.length - 1, Math.floor(f * dados.etapas.length)));
      // a nav lê este atributo: no fim do pin o palco é escuro
      palco.dataset.tema = p > 1 - VIRADA * 0.5 ? 'escuro' : 'claro';
    },
  });
  ir(0, true);
}
