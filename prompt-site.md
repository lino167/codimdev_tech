# codimdev — o prompt do site (v3: o portfólio como filme)

Especificação para construir o site. Leia antes: `briefing.md` (fatos), `historia.md` (a direção) e `AGENTS.md` (regras). Onde este arquivo e o `AGENTS.md` divergirem, vale o `AGENTS.md`. Versão anterior: `arquivo/prompt-site-v2.md` (não usar).

## 1. Regras que não mudam

- Grafia `codimdev`, tudo minúsculo. Logo só o de `src/lib/marca/logo.ts`. Textos só em `src/i18n/pt.ts`; contatos e links em `src/lib/dados.ts`. Fatos reais ou `[preencher]`; sem preço, sem cliente, sem depoimento inventado. Os projetos são autorais e o site diz isso.
- Serviços: os cinco do `briefing.md`. Não se fala de vídeo, motion, identidade visual, redes sociais, tráfego pago, app nativo nem automação.
- Voz do artesão, primeira pessoa, sem exclamação nem emoji; no máximo um sotaque do Piauí por sala, nunca em serviço, combinado, formulário ou privacidade.
- Cantos de 4 px; carmim só na barrinha, no botão principal e em uma palavra por título (nunca fundo de seção); nada de branco ou preto puro. Celular conferido em 390 px; `npm run check:fast` antes de cada commit.
- Fontes só pelo `carga.ts` (`FontFace`). `<html class="is-loading">` e o guarda de 10 s do `Base.astro` não saem. Movimento reduzido ou sem JS: tudo já formado.
- **WebGL liberado só onde precisar** (o hero). Sem foto de banco. O que não for o hero é HTML, CSS e GSAP.

## 2. Stack

Astro 7 estático e várias páginas; Tailwind 4 só pelos tokens; GSAP 3.15 + ScrollTrigger; Lenis 1.3; **`ogl`** para o WebGL do hero; View Transitions API com fallback para as trocas de página. Versões travadas. Hospedagem estática na Hostinger (fluxo atual: workflow publica o `dist/` na branch `hostinger`, deploy manual pela API).

## 3. O hero de partículas (sala Início)

**Arquivos:** `src/lib/hero/` (`particulas.ts` o motor, `alvos.ts` as posições-alvo, `profundidade.ts` o mapa de profundidade, `interacao.ts` mouse e câmera) e `src/components/Hero.astro`.

- **Dois alvos de pontos:** (a) o **logo** `codimdev` (a máscara vem do `Path2D` do SVG oficial, desenhado num canvas; os pontos do trecho carmim usam `--color-carmim`); (b) o **retrato** do Zacarias (de `public/img/zacarias.webp`, com o alfa como máscara, a cor da foto e uma **profundidade** calculada: o alfa suavizado em vários passes dá o relevo e a luminância refina). Quando houver foto maior e mapa real, o `profundidade.ts` carrega o mapa e o resto não muda.
- **Linha do tempo** (GSAP sobre uniforms do shader): 0 a 1,6 s as partículas entram voando pelas bordas e **escrevem o nome** (da esquerda para a direita, `near-first`); 0,3 s de pausa; 1,8 s de **morfismo com redemoinho** até o retrato; depois o retrato **respira** (movimento mínimo, `rest 0.0015`). Contagem: **300 mil** no computador, **120 mil** no celular; se o FPS médio ficar abaixo de 40 nos primeiros 2 s, vai para a metade, e depois para a foto.
- **Interação (computador):** as partículas perto do mouse **se afastam** (raio 11% da altura, força 0,037, com profundidade) e voltam; a câmera tem **parallax** suave (fov 10, `follow 0.11`). No celular, o toque faz o mesmo e o giroscópio não é usado.
- **Recuo ao rolar:** a rolagem aproxima o `recede` (câmera se afasta, desfoque sobe, o retrato esmaece) enquanto a sala de Projetos entra; só a câmera é dirigida pela rolagem.
- **Texto:** "Seu site deveria **vender**. Não só existir." (a palavra em carmim), apoio, botões "Pedir orçamento" e "Ver projetos"; entra por tempo depois do morfismo. O texto é HTML sobre o canvas (acessível; o canvas é `aria-hidden`).
- **Quedas, nesta ordem:** sem WebGL2, movimento reduzido, `saveData` ou aparelho fraco → a foto do recorte, parada, com o texto; erro de shader → o mesmo. Nunca tela vazia; o carregador só sai quando o hero está pronto ou caiu para a foto.
- **Fundo do hero:** `--color-grafite`; partículas em tons de algodão (`--color-algodao`).

## 4. As salas

Rotas: `/` (início), `/projetos`, `/projetos/kraflo-cmms`, `/projetos/kraflo-os-bot`, `/projetos/tenua`, `/sobre`, `/contato`, `/privacidade`, `/404`. Cabeçalho: logo à esquerda; "Projetos", "Sobre", "Contato" à direita; botão "Pedir orçamento". Menu em folha de tela cheia no celular. Troca de página: o título da sala que entra chega em 0,5 s e a anterior recua; sem flash.

- **Projetos:** título "Projetos"; filtros (Todos, Sites, Sistemas); troca de vista (grade, lista); uma linha por projeto com nome e descrição curta ("Projeto autoral"); no hover (só com mouse) a linha se acende na paleta do projeto e a miniatura aparece.
- **Caso:** título grande; resumo em uma frase; "sobre" em 2 ou 3 linhas; ficha (Ano, Cliente "Projeto autoral", Trabalho, Papel, Link); o **botão do rosto** (o recorte do Zacarias em círculo; rótulo "Apresentação · eu te explico o caso") que abre o texto da explicação num painel; galeria de imagens 16:10; navegação "Anterior" e "Próximo". **Paleta própria:** `--bg`, `--fg`, `--accent` do caso entram ao abrir e saem ao voltar (a transição de cor dura 0,6 s).
- **Sobre:** quem sou, a frase grande, o lema, os cinco serviços em linhas, o como funciona em cinco passos (conversa, protótipo, código, testes, no ar), origem e trajetória do `briefing.md`, botão "Pedir orçamento".
- **Contato:** links (WhatsApp, e-mail, Instagram) e o **compositor do orçamento**: nome, o que você precisa (cinco opções dos serviços), uma mensagem; consentimento; "Enviar" abre o WhatsApp ou o e-mail com o texto pronto (sem servidor). Privacidade em painel.

## 5. Os casos (fatos)

Kraflo CMMS (sistema de manutenção industrial), Kraflo OS Bot (bot de ordens de serviço), Tenua (site de portfólio para um ateliê fictício). Todos autorais. Ano, link, prints (16:10, modo escuro) e as duas cores de cada um: `[preencher]` até virem do Zacarias.

## 6. Ordem de construção (uma sala por vez; commit e conferência a cada uma)

1. Limpeza do código antigo e o esqueleto novo (Base, carregador, cabeçalho, rodapé, tokens).
2. **Hero de partículas** (esta etapa).
3. Projetos e os três casos.
4. Sobre.
5. Contato, privacidade e 404.
6. Transições entre salas, `?pronto`, desempenho, acessibilidade, celular e a conferência final.

## 7. Conferência (cada sala)

Sem erro no console; 390 px sem letra cortada; teclado e foco visíveis; movimento reduzido mostra a foto parada; `npm run check:fast` passa; para o hero: FPS médio acima de 40 nos primeiros 2 s no computador, e o carregador sai em até 4 s.
