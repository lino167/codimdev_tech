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
  endereco: string;
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
  const qa = <T extends Element>(i: number, sel: string) => Array.from(placas[i].querySelectorAll<T>(sel));
  const q = <T extends Element>(i: number, sel: string) => placas[i].querySelector<T>(sel) as T;
  const bolhas = qa<HTMLElement>(0, '[data-b]');
  const abas = qa<HTMLElement>(1, '[data-aba]');
  const cursor = q<HTMLElement>(1, '[data-cursor]');
  const telas = qa<HTMLElement>(1, '[data-tela]'); // início, cardápio e contato
  const linhasCodigo = qa<HTMLElement>(2, '[data-linha]');
  const celular = q<HTMLElement>(3, '[data-celular]');
  const checks = qa<HTMLElement>(3, '[data-check]');
  const endereco = q<HTMLElement>(4, '[data-endereco]');
  const pulso = q<HTMLElement>(4, '[data-pulso]');

  // a câmera: `cam` é o índice (contínuo) da placa em foco; `sp` é a distância entre as placas (vai a 0 na virada)
  const S = { cam: 0, sp: SP };
  const render = () => {
    const achata = 1 - S.sp / SP; // 0 = pilha aberta, 1 = tudo achatado
    placas.forEach((placa, i) => {
      const chega = limitar(S.cam - i + 1, 0, 1); // 0 = ainda não chegou, 1 = no lugar
      const d = Math.max(0, S.cam - i); // quantas placas atrás da que está em foco
      // a anterior fica a 35%, a antepenúltima some devagar: o texto de baixo continua legível
      const rastro = d < 1 ? 1 - 0.72 * d : d < 2 ? 0.28 - 0.18 * (d - 1) : Math.max(0, 0.1 * (3 - d));
      const base = chega * (rastro + (1 - rastro) * achata);
      gsap.set(placa, {
        z: (i - S.cam) * S.sp + (1 - chega) * QUEDA * (1 - achata),
        opacity: base,
        zIndex: i,
      });
    });
  };

  // escreve `texto` no elemento, letra a letra, ao longo da linha do tempo
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

  // o código, colorido: cada linha vira pedaços (tag, texto entre aspas, número), revelados juntos por caractere
  const PEDACOS = /(<\/?[a-z0-9]+|\/?>|"[^"]*"|\b\d+px\b|\.[a-z-]+|[a-z-]+(?=:))/g;
  const classeDe = (texto: string) => {
    if (/^"/.test(texto)) return 's';
    if (/^\d/.test(texto)) return 'n';
    if (/^(<\/?[a-z0-9]+|\/?>|\.[a-z-]+|[a-z-]+)$/.test(texto)) return 'k';
    return '';
  };
  const preparar = (el: HTMLElement, linha: string) => {
    el.textContent = '';
    const partes = linha
      .split(PEDACOS)
      .filter(Boolean)
      .map((texto) => {
        const span = document.createElement('span');
        span.className = classeDe(texto);
        el.appendChild(span);
        return { span, texto };
      });
    return (n: number) => {
      let resto = n;
      partes.forEach(({ span, texto }) => {
        span.textContent = texto.slice(0, Math.max(0, Math.min(texto.length, resto)));
        resto -= texto.length;
      });
    };
  };

  // centro de um elemento dentro da placa, em px de layout (não muda com o 3D)
  const noPalco = (el: HTMLElement, tela: HTMLElement) => {
    let x = 0;
    let y = 0;
    let e: HTMLElement | null = el;
    while (e && e !== tela) {
      x += e.offsetLeft;
      y += e.offsetTop;
      e = e.offsetParent as HTMLElement | null;
    }
    return { x: x + el.offsetWidth / 2, y: y + el.offsetHeight / 2 };
  };

  // o que roda por tempo em cada etapa (uma vez, quando a placa chega)
  let seq: gsap.core.Timeline | null = null;
  const ATRASO = 0.55; // a placa desce primeiro; o conteúdo começa quando ela está quase no lugar
  const sequencia = (i: number) => {
    seq?.kill();
    const tl = gsap.timeline({ delay: ATRASO });
    seq = tl;
    switch (i) {
      case 0: {
        // a conversa chega mensagem por mensagem e a proposta se monta por último
        gsap.set(bolhas, { opacity: 0, y: 14 });
        tl.to(bolhas, { opacity: 1, y: 0, duration: 0.5, stagger: 0.55, ease: 'power2.out' }, 0.1);
        break;
      }
      case 1: {
        const tela = placas[1].querySelector<HTMLElement>('.placa__tela') as HTMLElement;
        const mostrar = (k: number) =>
          telas.forEach((t, n) =>
            gsap.to(t, { opacity: n === k ? 1 : 0, duration: 0.15, ease: 'none', overwrite: 'auto' }),
          );
        const ativar = (k: number) =>
          abas.forEach((a, n) => gsap.to(a, { backgroundColor: n === k ? TRAMA : 'rgba(0,0,0,0)', duration: 0.15 }));
        const alvo = (k: number) => noPalco(abas[k], tela);
        const clique = () => tl.to(cursor, { scale: 0.8, duration: 0.07, yoyo: true, repeat: 1, ease: 'none' });
        mostrar(0);
        ativar(-1);
        const ini = alvo(2);
        gsap.set(cursor, { x: ini.x + 120, y: ini.y + 160, opacity: 0, xPercent: -50, yPercent: -50 });
        tl.to(cursor, { opacity: 1, duration: 0.2 }, 0.1).to(
          cursor,
          { x: alvo(0).x, y: alvo(0).y, duration: 0.7, ease: 'power3.inOut' },
          0.2,
        );
        clique().call(() => ativar(0));
        tl.to(cursor, { x: alvo(1).x, y: alvo(1).y, duration: 0.5, ease: 'power3.inOut' }, '+=0.35');
        clique().call(() => {
          ativar(1);
          mostrar(1);
        });
        tl.to(cursor, { x: alvo(2).x, y: alvo(2).y, duration: 0.5, ease: 'power3.inOut' }, '+=0.9');
        clique().call(() => {
          ativar(2);
          mostrar(2);
        });
        tl.to(cursor, { x: alvo(0).x, y: alvo(0).y, duration: 0.6, ease: 'power3.inOut' }, '+=0.9');
        clique().call(() => {
          ativar(0);
          mostrar(0);
        });
        break;
      }
      case 2: {
        const mostrarN = linhasCodigo.map((el, k) => preparar(el, dados.codigo[k]));
        let t = 0.1;
        dados.codigo.forEach((linha, k) => {
          const o = { n: 0 };
          const dur = linha.length / CPS_CODIGO;
          tl.to(o, { n: linha.length, duration: dur, ease: 'none', onUpdate: () => mostrarN[k](Math.round(o.n)) }, t);
          t += dur + 0.05;
        });
        break;
      }
      case 3: {
        const barras = checks.map((c) => c.querySelector<HTMLElement>('.barrinha') as HTMLElement);
        const rotulos = checks.map((c) => c.querySelector<HTMLElement>('span') as HTMLElement);
        gsap.set(celular, { opacity: 0, y: 24 });
        gsap.set(barras, { scale: 0 });
        gsap.set(rotulos, { opacity: 0.35 });
        tl.to(celular, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0);
        checks.forEach((_, k) => {
          tl.to(barras[k], { scale: 1, duration: 0.3, ease: 'back.out(2.2)' }, 0.9 + k * 0.4);
          tl.to(rotulos[k], { opacity: 1, duration: 0.3 }, 0.9 + k * 0.4);
        });
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

  // estado inicial: nada do que roda por tempo aparece antes da hora
  gsap.set(bolhas, { opacity: 0 });
  gsap.set(abas, { backgroundColor: 'rgba(0,0,0,0)' });
  gsap.set(cursor, { opacity: 0 });
  gsap.set(celular, { opacity: 0 });
  linhasCodigo.forEach((el) => (el.textContent = ''));
  endereco.textContent = '';
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
