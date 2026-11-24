# codimdev: uma página que dois cursores constroem na sua frente, e que termina numa pessoa só

Este arquivo é a especificação completa do site da codimdev (**versão 2, cinematográfica**). Funciona sozinho: quem ler só ele consegue construir o site sem a conversa que o originou. Tudo o que não está aqui não existe no site. Quando um fato não estiver escrito, ele fica `[preencher]` e **nunca** é inventado.

## Antes de começar: pergunte

Antes de escrever código, leia `AGENTS.md`, `src/` e `git log` (o projeto já existe em Astro). Depois pergunte, uma coisa por vez e em linguagem simples:

1. O que a pessoa quer agora: **construir o site inteiro**, construir só uma página ou parte, ou só rever um texto.
2. **Qual motor dos cursores:** escrito do zero (**recomendado**: dois cursores, o repositório pode ficar público) ou o motor do modelo Kairo da Profitize adaptado (exige repositório **privado**, porque a licença proíbe publicar o código). Sem resposta, escreva do zero.
3. Se faltar algo da lista `[preencher]` no fim, peça agora.
4. O material de cada cena. A resposta curta: **o que dá impacto vem de código; as fotos e os prints dão o resto**.
   - Cursores, motor de construção, HUD, ⌘K, tema, placas em 3D, roda, carregador, 404 e transições: **feitos em código** (SVG, CSS 3D, GSAP). Não pedem material.
   - Logo (SVG) e 23 ícones: **já existem** no Design System da codimdev. O SVG original da logo manda; se faltar, não redesenhe: pare e peça.
   - **Recorte do Zacarias** (moletom bege, fundo transparente, 840 × 1050): já existe em `public/img/zacarias.webp`. **Mais 4 fotos** dele existem no repositório da marca (`imagens/zacarias/`): peça-as para o Sobre. Sem elas, o mesmo recorte serve.
   - **Prints do Kraflo CMMS, do Kraflo OS Bot e do Tenua**, em modo escuro, 16:10: peça-os para a roda de projetos. Sem eles, cada cartão mostra a miniatura em traço do produto.
   - Fotografia de banco de imagem, vídeo e imagem gerada por IA: **não entram**.

## A ideia

- A página **se constrói na frente de quem a visita**. Dois cursores de editor multiplayer, **`design`** e **`código`**, desenham e preenchem cada bloco. No fim eles **se fundem numa barrinha carmim**, com a etiqueta "uma pessoa só": é o diferencial da codimdev virando imagem. O site de quem faz sites não conta o processo: ele acontece na tela.
- **A régua:** cada seção tem um gesto; seção parada ainda não está pronta. **O cursor é parte da cena:** o mouse do visitante também reage (profundidade no hero, seleção do editor no hover).
- **Eixo:** o processo. **A frase da peça:** "Uma conversa… vira protótipo… vira código… passa nos testes… e vai ao ar."
- **Os quatro atos:** o antes (a prancheta vazia que dois cursores começam a desenhar) → o processo (a peça de cinco placas em 3D) → a virada (a luz acende, os cursores se fundem, o palco escurece) → o depois (serviços, projetos numa roda 3D, combinado, o rosto, o convite).
- **De onde vem cada mecânica** (estudo de 31 Sites of the Day da Awwwards e dos modelos da Profitize): o motor dos dois cursores, do **Kairo**; a pilha de placas em 3D, do **Bilda**; a roda de projetos, do **Works Wheel** e do **Margem**; o nome gigante que se desenha em contorno e enche, do **Traço**; o HUD com dados reais, do **Carter Ogunsola**; o rosto na frente do nome, do **Linno**. É a mecânica, escrita para a marca; nenhum código ou texto é copiado.

---

## Parte 1: O site

### Marca e tom

- **Quem:** codimdev, estúdio de desenvolvimento web de uma pessoa só, o **Zacarias** (Zacarias Lino Ramos Filho), de Guadalupe, no Piauí, morando em Blumenau, SC, com atendimento online para o Brasil. Aberto em novembro de 2026, **ainda sem clientes pagantes: todos os projetos são autorais, e o site diz isso com todas as letras.**
- **Grafia:** `codimdev`, tudo junto e minúsculo, em qualquer lugar, inclusive em título e no começo de frase. **Nunca** "CodimDev", "Codim Dev" ou "CODIMDEV".
- **Para quem:** empresas que vendem, captam ou operam pela internet: de pequenas e médias empresas e prestadores de serviço a startups e times de tecnologia. Quem decide tem pouco tempo e cobra resultado. Fala-se de retorno (mais lead, mais venda, menos retrabalho), com prazo e escopo por escrito; o termo técnico só aparece se perguntarem (exceção: a linha de ferramentas em mono na página Sobre e nas páginas de projeto).
- **O que vende:** cinco serviços: (1) landing pages focadas em conversão, (2) sites institucionais, (3) redesign e otimização de conversão (CRO/UX), (4) interfaces de sistemas web, dashboards e MVPs, (5) design system e componentização. **Não fala** de vídeo, motion, identidade visual, gestão de redes sociais, tráfego pago, aplicativo nativo nem de **automação**. **Não mostra preço**: o valor sai por escrito na proposta, pelo WhatsApp.
- **Voz (o artesão):** direto, calmo, cumpre o que combinou. Primeira pessoa do singular ("eu desenho", "eu entrego"); o visitante é "você". Frases curtas, uma ideia por frase. **Sem exclamação, sem caixa alta, sem emoji.** Fale do problema que resolve antes da tecnologia.
  - Palavras que usa: resolver, vender, entregar, prazo, escopo, página, sistema.
  - **Proibido:** inovador, disruptivo, solução completa, alavancar, "transforme seu negócio", "presença digital", "cases de sucesso".
  - Frase-modelo: "Seu site deveria vender. Não só existir."
- **O sotaque do Piauí** (sutil): de ritmo e de vocabulário, nunca de ortografia. Nada de "mermão", "num sei" ou frase escrita como se fala. No máximo **um por cena**, e **some onde há dinheiro, prazo ou lei**: serviços, combinado, formulário, mensagem de erro e privacidade. Lugares fixos:

  | Onde                        | Texto                                           | Palavra       |
  | --------------------------- | ----------------------------------------------- | ------------- |
  | Carregador                  | "Já já · 64%"                                   | já já         |
  | Virada (cena 4)             | "Pronto. Agora o site trabalha para você."      | pronto        |
  | Convite final (cena 9)      | "…antes de começar. Pode chamar sem se avexar." | sem se avexar |
  | Sobre (S4)                  | "Comecei pela peleja que eu conhecia."          | peleja        |
  | Sobre (S6, uma vez no site) | "…a gente se entende, visse?"                   | visse         |
  | 404                         | "Eita. Essa página não está no ar."             | eita          |

  Evitar: "arretado", "pense num…", "égua", "vixe", "cabra da peste", escrita fonética, estereótipos (seca, jegue, cangaço).

- **Contatos (em `lib/dados.ts`, um lugar só):** WhatsApp `5547996496281` (link `https://wa.me/5547996496281`), e-mail `contato@codimdev.com.br`, Instagram `@codimdev` (`https://instagram.com/codimdev`). Resposta em até **24 horas úteis**.

#### Cores (tokens do Design System; tema claro no site)

| Token             | Hex       | Papel                                                                                   |
| ----------------- | --------- | --------------------------------------------------------------------------------------- |
| `--algodao`       | `#F5F4EF` | fundo da página inteira                                                                 |
| `--trama`         | `#E9E7E0` | cartões e janelas                                                                       |
| `--cru`           | `#DEDCD4` | hover do botão secundário, selos                                                        |
| `--linha`         | `#D6D4CC` | fios de 1 px, divisórias, a grade de fundo                                              |
| `--grafite`       | `#18191D` | texto principal e a cena escura (substitui o preto)                                     |
| `--grafite-suave` | `#5C5D63` | legendas e etiquetas                                                                    |
| `--carmim`        | `#C42A1F` | botão principal, links, **uma palavra por título**, o traço do símbolo e o pingo do "i" |
| `--no-carmim`     | `#FFFFFF` | texto sobre carmim                                                                      |
| `--floresta`      | `#2F6E54` | só confirmação dentro de telas de produto desenhadas                                    |
| `--erro`          | `#8E1B12` | mensagem de erro, sempre com texto e ícone                                              |

Nada de branco puro nem de preto puro nos fundos. Carmim **nunca** como fundo de seção, em vários botões juntos ou para indicar erro. Contraste: carmim sobre algodão 5,2:1; carmim sobre trama 4,6:1; carmim sobre grafite só em texto de 24 px ou mais e na barrinha. A paleta inteira troca num lugar só (`styles/tokens.css`); o tema escuro do Design System entra pelo botão de tema do cabeçalho e pela paleta de comandos.

#### Tipos (arquivo local, todos livres para uso comercial)

| Papel              | Família           | Uso                              | Tamanho / entrelinha / tracking                                 |
| ------------------ | ----------------- | -------------------------------- | --------------------------------------------------------------- |
| Título             | IBM Plex Sans 600 | título de página                 | 64 px / 68 px / -1,6 px (no celular: `clamp(40px, 11vw, 64px)`) |
| Título de seção    | IBM Plex Sans 600 | seções                           | 36 px / 42 px / -0,7 px                                         |
| Subtítulo          | IBM Plex Sans 400 | chamadas curtas                  | 22 px / 30 px                                                   |
| Corpo              | Inter 400         | texto corrido                    | 16 px / 24 px                                                   |
| Botão              | Inter 500         | rótulo de botão                  | 15 px / 20 px                                                   |
| Código e etiquetas | IBM Plex Mono 400 | rótulos, contadores, ferramentas | 12 px / 16 px, caixa alta com 0,06em nas etiquetas              |

Os arquivos `.woff2` (latim) vão em `public/fonts/`, gerados por `scripts/fontes.py` ou copiados de `@fontsource/ibm-plex-sans`, `@fontsource/inter` e `@fontsource/ibm-plex-mono`. **Nenhum `@font-face` solto nem pré-carregamento**: quem registra as fontes é o carregador, por `FontFace`, a partir dos bytes que mediu (o `@font-face` só fica no `<noscript>`).

#### Forma

- Cantos de **4 px** em tudo (botões, campos, cartões, janelas). **Nada de pílula**, gradiente, brilho ou sombra azulada.
- Superfícies planas separadas por fios de 1 px (`--linha`) e por um tom a mais de fundo (`--trama`). A única sombra do site é a `sombra-suave` (`0 8px 24px rgba(24, 25, 29, 0.08)`), **só na janela do produto** da peça principal.
- Espaço em múltiplos de 4 px (`space-1` 4, `space-2` 8, `space-3` 12, `space-4` 16, `space-6` 24, `space-8` 32). Largura máxima de 1200 px com 24 px de margem lateral.
- **Textura:** grade fina de 24 × 24 px em `--linha` a 50% de opacidade, atrás de tudo. No pé de cada página, uma **linha carmim de 3 px com a barrinha** à esquerda.
- **A barrinha:** retângulo de 18 × 12 px, cantos de 2 px, `transform: skewX(-36deg)`, cor carmim. É o cursor, o marcador de lista, o "visto" e a luz de status. Sempre pequena e sempre carmim.
- Transições de cor de **150 ms**; o sublinhado do link só aparece no hover.
- Ícones: os 23 próprios do Design System (traço de 1,75 px, grade 24 px). Tamanhos: 24 px padrão, 20 px em botão, 32 ou 48 px em cartão. **Um detalhe carmim por ícone.** Os de serviço (`site`, `sistema`, `design`, `codigo`, `dados`, `ajustes`, `mensagem`, `etiqueta` e afins) levam o detalhe; os de interface (`seta`, `check`, `fechar`, `menu`, `mais`, `busca`, `email`, `celular`, `calendario`, `relogio`, `download`, `externo`, `usuario`) não. No código, o traço usa `currentColor`. Ícones de `video` e `automacao` **não são usados**.

#### Cabeçalho e rodapé (todas as páginas)

- **Cabeçalho** (fixo, 72 px; 56 px depois de 40 px de rolagem, com fundo algodão a 92% e fio embaixo; some ao descer passada meia tela e volta ao subir): logo horizontal à esquerda; `[ Serviços ]  [ Projetos ]  [ Como funciona ]  [ Sobre ]` em mono 13 px, entre colchetes (os colchetes em `--grafite-suave`); à direita, o **botão de tema** (sol e lua, 44 px), o atalho `⌘K` (só no computador, em mono) e o botão "Pedir orçamento" (carmim). Sobre a cena escura, o cabeçalho e o botão trocam de cor (texto algodão; botão algodão com texto grafite). Até 960 px, os links viram um botão `[ Menu ]` que abre uma folha algodão de tela cheia com os links em IBM Plex Sans 600, 48 px, e o botão de orçamento em largura total (Esc fecha; a rolagem trava).
- **Rodapé:** a logo horizontal em escala grande e proporcional (altura mínima igual à do "o" de respiro em todos os lados), quatro colunas de links (Serviços, Projetos, Como funciona, Sobre, Orçamento, Privacidade; Instagram `@codimdev`; e-mail), a linha em mono "codimdev · desenvolvimento web · 2026" e, **sozinha numa linha abaixo, "feito por um piauiense"** (nada mais: sem cidade, sem bandeira, sem detalhe). A linha carmim com a barrinha fecha a página. "Voltar ao topo" leva a barrinha de volta ao cursor da abertura.

### 00 — Carregador

- Tela algodão com a grade. O **símbolo da logo** (o primeiro subcaminho do SVG oficial, em grafite) é **desenhado em traço fino** (`stroke-dashoffset`) conforme o **progresso real** chega: bytes das fontes e do JS e do CSS que já vieram (Resource Timing), nunca um timer; o número nunca volta. Tempo mínimo de **1,1 s**; limite de 9 s em rede lenta (a página segue com o que tiver).
- Embaixo do símbolo, o contador em mono 12 px caixa alta: "JÁ JÁ · 64%" (atributo `aria-label` "Carregando a página", `role="progressbar"`).
- Em 100%, a barrinha carmim risca o símbolo na diagonal e **trava no lugar** (clique de 120 ms); a tela se abre para cima em 0,7 s (`power3.inOut`) sobre o primeiro quadro da abertura, sem quadro em branco no meio. Rolagem travada durante a carga, sem esconder a barra.
- Antes do JS, o símbolo já aparece em CSS (traço completo e apagado, depois de 0,4 s; com cache nem aparece). O `<html>` começa com a classe `is-loading` e um temporizador de segurança de 10 s a remove sozinho.
- Movimento reduzido ou sem JavaScript: a página aparece direto, sem carregador e sem cursores.

### O motor: dois cursores

- **Quem são:** dois cursores de editor multiplayer, em SVG, com etiqueta em mono de 11 px (`design` em `--grafite-suave`, `código` em `--grafite`; fundo `--trama`, fio de 1 px, cantos de 4 px). **Nenhuma cor extra:** o carmim fica só para a linha-guia e para a fusão final.
- **O que `design` faz:** desenha a **caixa de seleção** (fio de 1 px, quatro alças quadradas de 6 px, a medida ao vivo em mono, "420 × 24") e depois o **esboço** do bloco (tracejado cinza, o mesmo `6 6` das placas).
- **O que `código` faz:** **digita** o texto (um caractere a cada 28 ms), **acende** o título letra a letra (de `--grafite-suave` para `--grafite`, 34 ms por letra), **revela** a foto (preto e branco para a cor, 0,9 s), **desenha** o contorno do nome gigante e o **enche** de baixo para cima (1,6 s), e liga as interações.
- **A dupla:** em cada bloco `design` vai primeiro e `código` depois; quem termina segue para o próximo. Eles nunca ocupam o mesmo bloco ao mesmo tempo.
- **Atributos no HTML** (o conteúdo é HTML de verdade desde o começo; o motor só lê):
  - `data-camada="quadro|titulo|texto|bloco|foto|nome"` marca cada bloco que será construído;
  - `data-montagem` agrupa as camadas de uma montagem, que começa quando o topo da seção passa de **62%** da tela;
  - `data-duplica` numa lista: o primeiro filho nasce do zero; cada um dos outros sai de uma **cópia que `código` arrasta**, com o cursor de copiar, até a vaga, e o conteúdo é trocado;
  - `data-ajusta="dx,dy"`: o bloco nasce deslocado (metade no celular) e `design` o arrasta de volta, com a **linha-guia carmim** (1 px, 80 px de comprimento, aparece por 0,4 s);
  - `data-teste="1,0"` num grupo de botões: depois de montado, `código` clica no botão 1 e volta ao 0. `data-tocado` (posto quando a pessoa mexe) cancela o teste.
- **Rolou no meio:** a montagem acelera 5× e o que sai da tela fecha na hora; nenhum cursor volta para cima atrás do que ninguém vê.
- **Entradas e saídas:** os dois cursores entram pelas bordas depois do carregador, rodeiam o símbolo (1,2 s) e se espalham. Entre seções, ficam na borda do bloco em que terminaram.
- **O fim:** com o convite na tela (ou com a página toda montada), os dois **caminham até o centro e se fundem** numa barrinha carmim (0,8 s, `power3.inOut`); a etiqueta vira "uma pessoa só". Em computador, essa barrinha passa a **seguir o mouse** (mola suave, 0,18 s de atraso), discreta, como cursor da página; em celular, fica como luz de status no convite.
- **Segurança e fallback:** `?pronto` na URL, `prefers-reduced-motion`, ausência de JavaScript ou o motor não subir em 5 s: a página abre **já montada**, sem cursores. Nada fica escondido esperando animação.
- **Celular:** os dois cursores continuam, com a metade da velocidade de cursor e sem a barrinha seguindo o dedo.

### O HUD, o Tour e os extras

- **HUD fixo no pé da página** (faixa de 40 px, `--trama`, fio em cima, mono 12 px). **Só dados reais**:
  - `carregou em 0,9 s`: o LCP, lido com `PerformanceObserver`;
  - `60 fps`: a média dos últimos 2 s medida por `requestAnimationFrame`;
  - `JS 38 KB`: a soma de `transferSize` dos scripts da Resource Timing;
  - `2 cursores · 1 pessoa`;
  - `37/37 camadas`, com uma barra de progresso fina.
    Se o navegador não mede algo, mostra "—". **Nunca** mostre número de visitantes online ou qualquer dado que o site não meça.
- **Controles do HUD (à direita):** **Tour** (a página rola sozinha e para em cada seção até ela ficar construída; qualquer toque ou tecla do visitante interrompe), `1×` `2×` (velocidade do motor) e **montar de novo** (limpa e refaz a construção). No fim do Tour: "Montada por 2 cursores em 38 s", com o tempo medido.
- **Seleção ao passar o mouse:** todo clicável ganha a seleção do editor (fio grafite de 1 px com as quatro alças) no hover (só com mouse) e no foco.
- **Tema claro e escuro:** botão no cabeçalho; troca os tokens (os escuros do Design System) com um **círculo que se abre do ponto do clique** (`document.startViewTransition` e `clip-path`; sem suporte, troca direta). Respeita `prefers-color-scheme` na primeira visita e lembra a escolha.
- **Paleta de comandos (⌘K ou Ctrl K):** diálogo acessível (`role="dialog"`, foco preso, Esc fecha) com o campo "Ir para…". Itens: as páginas, "Mudar tema", "Fazer o tour", "Montar de novo", "Chamar no WhatsApp". Navegação por setas e Enter.
- **Transição entre páginas:** uma máscara que corta a tela (200 ms, `@view-transition`).

### Páginas e cenas

#### Página inicial (`/`)

**01 · Abertura, o hero** (ato 1, 100 svh)

- **Composição:** sem barra de colunas no topo (a logo gigante vem logo abaixo do cabeçalho), grade fina ao fundo. **O nome gigante**: a logo horizontal oficial, **de borda a borda** no pé do hero (largura 100% menos as margens, proporcional, nunca esticada). **O Zacarias recortado** em primeiro plano, grande (altura de cerca de 78% da tela no computador), **na frente do nome**, cortando-o. O título à esquerda; os botões e a nota abaixo.
- **Gesto (por tempo, depois do carregador):** os dois cursores entram; `design` desenha o **contorno** do nome gigante (traço de 2 px, 1,4 s) e `código` o **enche de baixo para cima** (1,6 s). O Zacarias **sobe de um desfoque** (`filter: blur(18px)` para 0, 1,1 s, `expo.out`). `código` **escreve o título** (34 ms por letra), com um cursor-barrinha piscando no fim do texto, e depois o apoio e os botões sobem.
- **Reação ao mouse (só computador):** o Zacarias se desloca até 14 px na direção oposta ao mouse e o nome gigante, até 6 px (profundidade); o conjunto tem mola de 0,35 s. Sem mouse, nada se mexe.
- **Texto:** título "Seu site deveria vender. Não só existir." (**vender** em carmim) · apoio "Landing pages, sites e sistemas web para empresas. Eu desenho e programo a mesma peça, do protótipo ao site no ar." · botões "Pedir orçamento" (carmim) e "Ver projetos" (secundário) · nota em mono "Orçamento pelo WhatsApp · resposta em até 24 horas úteis" · legenda da foto "Zacarias, desenvolvedor e designer".
- **Celular:** o título (em 3 linhas) vem primeiro; o Zacarias fica embaixo dele com 56% da altura, sobre o nome gigante; os botões em largura total; sem reação ao mouse.
- **Passagem:** os cursores descem com a rolagem até a primeira frase da cena 02.

**02 · O que escapa** (ato 1)

- **Gesto:** três frases do dono em `--grafite-suave`; `design` **risca** a parte que falha com o traço carmim (3 px, na diagonal, 0,9 s) e `código` escurece a frase. Texto, abaixo.
- **Texto:** "Seu anúncio paga o clique. Sua página perde o lead." · "Seu formulário está espantando cliente." · "Planilha não é sistema de gestão." · apoio "Eu começo pelo que está custando venda, não pelo que é bonito."

**03 · Do briefing ao site no ar** (ato 2, **a peça principal: a pilha de camadas**, presa por 5 telas)

- **O que se vê:** cinco **placas** de uma janela de navegador (cada uma um SVG de 1200 × 720 com moldura, barra de endereço e o conteúdo da etapa), empilhadas em **3D por CSS** (`perspective: 2200px`, `transform-style: preserve-3d`), em vista isométrica (`rotateX(58deg) rotateZ(-32deg)`), separadas em 140 px ao longo do eixo Z. A placa da etapa atual fica a 100% de opacidade; as outras a 35%. Cada placa tem uma **aba** no canto com o rótulo em mono ("01 · conversa").
- **Estrutura:** palco fixado com ScrollTrigger (`pin: true`, `end: "+=500%"`, `scrub: 0.6`, `anticipatePin: 1`); abertura nos primeiros 6% (a primeira placa se firma) e respiro final nos últimos 4%. A rolagem dirige só a câmera (a rotação e a altura do conjunto) e a barra de etapa; o resto roda por tempo.
- **Etapas** (cada uma traz uma placa nova, que sobe e se encaixa por cima das anteriores, 0,7 s, `power3.out`):

| Etapa | Rótulo         | Parte da frase       | O que se vê                                                                                                                                                             | Fato                                                                                                            |
| ----- | -------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 1     | 01 · conversa  | "Uma conversa…"      | Placa 1: balões em traço e a folha de proposta em proporção A4. `código` escreve "PROPOSTA", "Escopo", "Prazo", "Preço" (24 e 20 caracteres por segundo).               | "Proposta por escrito antes de começar: escopo, prazo, preço e o que não está incluso. Nada começa sem aceite." |
| 2     | 02 · protótipo | "…vira protótipo…"   | Placa 2: a página em blocos tracejados e três abas "1 2 3". `design` clica nas abas e as telas trocam em 150 ms (página, grade de cartões, formulário).                 | "Você clica nas telas antes de qualquer código. São 2 rodadas de ajuste."                                       |
| 3     | 03 · código    | "…vira código…"      | Placa 3: os blocos ganham preenchimento `--trama` e texto real; ao lado, um painel de código se escreve a 40 caracteres por segundo, com `código` como cursor de texto. | "Design e código pela mesma pessoa, sem ruído entre etapas."                                                    |
| 4     | 04 · testes    | "…passa nos testes…" | Placa 4: a janela vira celular (cantos de 4 px) e três marcas ganham um `check` de 20 px, uma a cada 0,25 s: "celular", "velocidade", "formulário".                     | "Versão de celular, velocidade e formulários testados."                                                         |
| 5     | 05 · no ar     | "…e vai ao ar."      | Placa 5: a barra de endereço escreve "suaempresa.com.br" (30 caracteres por segundo) e a luz de status (a barrinha) pulsa (escala 1 → 1,7 → 1, 0,8 s).                  | "Site no ar, um guia curto de uso e 15 dias para pequenos ajustes." `[confirmar os 15 dias]`                    |

- **O texto:** título da cena "Uma conversa vira protótipo, vira código e vai ao ar." (**ar** em carmim), no alto, fora do pin. Dentro do pin, abaixo da pilha: o rótulo da etapa em mono, a parte da frase em IBM Plex Sans 600 (36 px; **entra palavra por palavra** saindo do desfoque, 0,5 s, stagger 0,06, e sai antes da próxima) e o fato em Inter 16 px. Uma **barra de etapa** com cinco marcas e a barrinha andando.
- **A virada (últimos 4%):** as placas **descem e se achatam** numa janela só (distância Z 140 px → 0, 0,6 s); a câmera fica de frente (`rotateX/Z` → 0); o palco vai de algodão para `--grafite`; a janela recua (escala 0,62). Os cursores se fundem (cena 04).
- **Aviso:** a etiqueta em mono "Ilustração" no canto de cada placa.
- **Celular (390 px):** pin de 400%; a pilha fica menor e o texto da etapa, logo abaixo, é o que se lê; a janela ocupa a largura toda.
- **Movimento reduzido ou sem JS:** sem pin e sem 3D; uma janela pronta e as cinco etapas em lista.

**04 · No ar** (ato 3, fundo `--grafite`, a única cena escura)

- **Gesto:** o palco escurece (600 ms); **os dois cursores se fundem** numa barrinha carmim, e a etiqueta troca para "uma pessoa só". Ao rolar adiante, o fundo **volta** a algodão.
- **Texto:** título "Pronto. Agora o site trabalha para você." (IBM Plex Sans 600, 64 px, algodão; carmim claro `#EC5A4D` só em **trabalha**) · apoio "Cada tela existe para vender, informar ou poupar tempo." · sem botão.
- **Passagem:** a janela encolhe e vira o ícone do primeiro cartão de serviço.

**05 · Serviços** (ato 4)

- **Gesto:** cinco cartões em `--trama` (grade de 3 + 2 colunas no desktop; 1 coluna no celular), cada um com o ícone de serviço (detalhe carmim), **construídos pelos cursores** (o primeiro nasce do zero; os outros saem de cópias arrastadas por `código`). Ao entrar (gatilho a 85% da altura da tela), cada cartão **desenha em traço uma miniatura** do que entrega (1,0 s, stagger 0,12 s) e firma: funil e botão; árvore de páginas; antes e depois com uma alça; painel com gráfico; componentes em grade.
- **Texto:** eyebrow "Serviços" · título "Cinco serviços. Uma pessoa só." (**só** em carmim) · apoio "Escopo, prazo e preço por escrito antes de começar." · cartões: "Landing pages focadas em conversão" ("Páginas rápidas para campanhas de tráfego pago, onde você mede o retorno em leads e vendas."), "Sites institucionais" ("Posicionamento profissional, SEO básico e contato por WhatsApp e formulário."), "Redesign e otimização de conversão" ("Eu refaço o site ou sistema que está lento, ruim no celular ou perdendo venda."), "Interfaces, dashboards e MVPs" ("Área de membros, portais de clientes e painéis administrativos sob medida."), "Design system" ("Padronização de telas e componentes para acelerar as entregas do seu time.") · link "Ver os cinco serviços" para `/servicos`; cada cartão leva à página do serviço.
- **Números:** 5 serviços. Sem preço.
- **Passagem:** o último traço vira a linha do índice de projetos.

**06 · Projetos** (ato 4)

- **Gesto:** os três projetos autorais numa **roda 3D**: um tambor de cartões (CSS 3D, `rotateY` por cartão num raio de 520 px) que **gira com a rolagem**; cada giro traz o próximo projeto para a frente, ampliado, e os outros se afastam e escurecem. Passar o mouse num cartão mostra a seleção do editor e o nome; clicar abre a página do projeto. Cada cartão é uma **tela do projeto em modo escuro (16:10)** com a etiqueta "Autoral" em mono. Sem os prints, o cartão mostra a miniatura em traço do produto (painel, bot, vitrine).
- **No celular:** a roda vira um trilho lateral com encaixe (`scroll-snap`), um cartão por vez.
- **Texto:** título "Projetos autorais, chamados de autorais." · apoio "Fiz estes projetos para mostrar como eu trabalho. O primeiro cliente entra aqui." `[confirmar o tom]` · cartões "Kraflo CMMS", "Kraflo OS Bot", "Tenua" · link "Ver todos os projetos" para `/projetos`.
- **Passagem:** a roda para no último cartão e a barrinha vira o marcador da lista de regras.

**07 · O combinado** (ato 4)

- **Gesto:** cinco regras; cada uma é marcada por uma barrinha que **cai no lugar** (translateY -12 px → 0, 0,4 s) quando entra; no fim, a barrinha "assina" a última linha com um traço de 80 px.
- **Texto:** título "O combinado fica por escrito." · "Proposta com escopo, prazo, preço e o que não está incluso. Nada começa sem aceite." · "50% para começar, 50% na entrega, por Pix ou link." · "2 rodadas de revisão por etapa. Pedido fora do escopo vira orçamento novo." · "Domínio, hospedagem e contas ficam no seu nome." · "Um projeto por vez, para cumprir o prazo." · link "Ver como funciona" para `/como-funciona`.
- **Números:** 50%, 2 rodadas.
- **Passagem:** a assinatura desliza até a margem do retrato.

**08 · Quem faz** (ato 4)

- **Gesto:** o recorte do Zacarias sobre algodão (largura de 360 px no desktop, 70% no celular), **sem filtro, sombra ou gradiente**. À volta, **cotas de desenho técnico** em traço fino com a palavra "design" de um lado e "código" do outro; a barrinha fica no meio. As cotas se desenham ao entrar (0,9 s).
- **Texto:** título "Design e código pela mesma pessoa." · apoio "Não tem agência no meio. Você fala comigo do primeiro contato até o site no ar." · legenda "Zacarias, desenvolvedor e designer · de Guadalupe, PI, em Blumenau, SC" · link "Conheça a minha história" para `/sobre`.
- **Passagem:** a faixa grafite sobe por baixo da foto.

**09 · Convite final** (ato 4, faixa `--grafite`, **uma vez por página**)

- **Gesto:** faixa grafite com o botão carmim. Ao entrar, a luz de status acende. Formulário curto de três campos (nome, WhatsApp, "O que você precisa"); o formulário completo está em `/orcamento`.
- **Texto:** título "Vamos ver o que um site resolve no seu caso?" · apoio "Escopo, prazo e preço por escrito antes de começar. Pode chamar sem se avexar." · botão "Chamar no WhatsApp" · alternativa "ou escreva para contato@codimdev.com.br" · nota "Resposta em até 24 horas úteis".
- **Passagem:** a linha carmim com a barrinha corre até o rodapé.

**10 · Rodapé:** como descrito acima, com o **nome gigante** de borda a borda: ele se **desenha em contorno e enche de baixo para cima, ligado à rolagem** (fecha o que o hero abriu). O resto do rodapé fica embaixo dele.

#### Serviços (`/servicos`)

- **Gesto:** cada um dos cinco cartões **desenha a sua miniatura** ao entrar, em lista de uma coluna no celular e duas colunas no desktop; clicar leva à página do serviço.
- **Texto:** título "Cinco serviços. Uma pessoa só." · apoio "Do protótipo ao site no ar, eu desenho e programo a mesma peça." · cada cartão: ícone, nome, uma frase (as da cena 05) e o link "Ver o serviço". Fecha com a faixa do convite.

#### Páginas dos cinco serviços (`/servicos/[serviço]`)

Estrutura igual em todas: barra mono de 4 colunas, eyebrow, título, apoio, **a miniatura do serviço desenhada em grande** (gesto: se desenha ao entrar), "O problema" (2 frases), "O que eu entrego" (4 itens com a barrinha como marcador), "Para quem é" (1 frase), "Como começa" (liga a `/como-funciona`), 3 perguntas comuns (sanfona; `<details>`, um item aberto por vez no desktop) e a faixa do convite.

1. **`/servicos/landing-page`** · título "Landing page que transforma clique em contato." · apoio "Para quem anuncia no Google ou na Meta e precisa que cada clique vire contato ou venda." · problema: "Seu anúncio paga o clique. Sua página perde o lead. Uma página lenta, ou feita para qualquer visitante, joga o dinheiro fora." · entrego: "Uma página feita para a sua campanha, com um só caminho do clique ao contato." / "Protótipo navegável aprovado por você antes do código." / "Formulário e botão de WhatsApp testados, e versão de celular." / "Página rápida e pronta para você medir leads e vendas." · para quem: "Loja, curso, clínica ou agência que investe em tráfego pago." · perguntas: "Já tenho uma página e o anúncio funciona mais ou menos." → "A página nova é feita para a campanha e mostra o caminho do clique ao contato. A gente compara o que está perdendo." · "Quanto custa?" → "O valor sai por escrito na proposta, pelo WhatsApp, depois que eu entender a campanha." · "Quanto tempo leva?" → "O prazo vai por escrito na proposta, antes de qualquer pagamento."
2. **`/servicos/site-institucional`** · "Um site que passa confiança e é encontrado." · apoio "Para clínicas, escritórios, indústrias e empresas B2B que precisam parecer profissionais para quem pesquisa e compara." · problema: "Seu cliente pesquisa antes de chamar. Site velho, ou nenhum, faz a empresa parecer amadora." · entrego: "Um site sob medida, com a sua cara, e não um modelo igual ao de todo mundo." / "SEO básico, para o Google entender o que você faz." / "Contato por WhatsApp e formulário em todas as páginas." / "Rápido no celular." · para quem: "Quem é indicado no boca a boca e quer ser encontrado." · perguntas: "Site não traz cliente para o meu tipo de negócio." → "O site responde o que o seu cliente pesquisa e leva direto ao WhatsApp." · "Eu preciso dar o conteúdo?" → "Você me conta o negócio na conversa inicial; eu organizo e escrevo com você. Logo, fotos e textos que você já tiver ajudam." · "Domínio e hospedagem ficam com quem?" → "Com você. Domínio, hospedagem e contas ficam no seu nome."
3. **`/servicos/redesign-e-conversao`** · "Refazer só o que está custando venda." · apoio "Para quem já tem site ou sistema e ele não rende." · problema: "Visita sobrando e venda faltando: site lento, ruim no celular, formulário ou checkout que perdem gente." · entrego: "Um diagnóstico do que está custando venda, por prioridade." / "Redesign começando pelo que mais pesa, e só mexendo no que importa." / "Telas novas em protótipo clicável antes do código." / "O formulário e o caminho de compra refeitos." · para quem: "Empresa com site ou sistema antigo, com checkout ou formulário." · perguntas: "Refazer tudo é caro e arriscado." → "Por isso começo pelo que está custando venda. Nada é refeito sem você ver o protótipo antes." · "Você mexe no meu sistema atual?" → "Eu olho o que existe e combino por escrito o que muda e o que fica." · "Quanto custa?" → "Sai por escrito na proposta, depois que eu ver o site."
4. **`/servicos/interfaces-e-sistemas`** · "Do protótipo clicável ao MVP." · apoio "Área de membros, portais de clientes, painéis administrativos e produtos digitais para validar." · problema: "Você tem a ideia e o negócio, mas não tem a interface. Meses de espera atrasam o teste com usuário real." · entrego: "Protótipo navegável que você clica antes de qualquer código." / "Interface e código do painel, do portal ou do MVP, sob medida." / "Telas pensadas para quem usa com pressa." / "O que sai do escopo vira orçamento novo, por escrito." · para quem: "Startups e empresas que precisam validar um produto digital." · perguntas: "Posso contratar uma agência ou um time interno." → "Pode. Aqui você fala direto com quem faz, e o protótipo aprovado vem antes do MVP." · "Planilha não é sistema de gestão?" → "Planilha vai bem até certo ponto. Quando erro e retrabalho aparecem, vale um sistema feito para o seu processo." · "Quanto custa?" → "Sai por escrito na proposta."
5. **`/servicos/design-system`** · "Telas iguais, entrega mais rápida." · apoio "Para empresas que já têm time de tecnologia e telas sem padrão." · problema: "Cada squad desenha a sua tela. Resultado: retrabalho, telas diferentes e entrega lenta." · entrego: "Componentes e regras de uso que o seu time continua usando." / "Tokens de cor, tipo e espaço documentados." / "Biblioteca de componentes pronta para o código." / "Entrega fechada, por escrito, sem parar o seu time." · para quem: "Times que já têm designer e dev e querem padrão." · perguntas: "Já temos designer e dev, para que mais um?" → "Eu entro como reforço pontual, com entrega fechada." · "Preciso trocar a ferramenta do time?" → "Não. A gente parte do que vocês já usam." · "Quanto custa?" → "Sai por escrito na proposta."

#### Projetos (`/projetos`)

- **Gesto:** índice numerado e três cartões; cada cartão traz a **miniatura em traço** do que o projeto entrega (painel, bot, vitrine), em preto e branco, que **ganha cor no hover** (a barrinha e o `check` em carmim). Etiqueta "Autoral" em mono.
- **Texto:** título "Projetos autorais, chamados de autorais." · apoio "Todos estes projetos são meus. Nenhum foi feito para cliente pagante, e eu prefiro dizer isso a inventar caso de sucesso." · cartões: "Kraflo CMMS · sistema web · Autoral", "Kraflo OS Bot · bot de Telegram · Autoral", "Tenua · site de portfólio · Autoral".

#### Páginas de projeto (`/projetos/[nome]`)

Estrutura: barra mono, eyebrow "Projeto · Autoral", título, a miniatura grande (se desenha ao entrar), "O problema", "O que eu fiz" (lista com a barrinha), "Ferramentas" (uma linha em mono 12 px), link para o GitHub (`externo`), e a faixa do convite.

1. **`/projetos/kraflo-cmms`** · "Kraflo CMMS" · "Gestão de manutenção industrial num sistema só." · problema: "Equipes de manutenção controlam ordens de serviço e estoque de peças em papel e planilha, e perdem o histórico." · o que fiz: "Ordens de serviço com histórico e auditoria." / "Painel com MTTR e métricas em tempo real." / "Estoque de peças com estoque mínimo, custo médio ponderado e baixa automática ao fechar a ordem." / "Portal de solicitação sem login, por QR code de cada equipamento." / "Manutenção preventiva automática para os próximos 90 dias." / "Assistente de IA para suporte técnico e acesso por perfil." · ferramentas: "React 18 · TypeScript · Vite · Tailwind · shadcn/ui · TanStack Query · Supabase · GitHub Actions" · link `https://github.com/lino167/Kraflo-CMMS`.
2. **`/projetos/kraflo-os-bot`** · "Kraflo OS Bot" · "Ordens de serviço pelo celular, dentro do Telegram." · problema: "O técnico está na máquina, longe do computador, e a ordem de serviço fica para depois." · o que fiz: "Fluxos guiados por botões para abrir e fechar ordens pelo celular." / "Foto do problema e registro das peças usadas." / "Vários clientes no mesmo sistema, com os dados de cada um isolados." / "Relatórios em PDF com a marca da empresa e exportação em CSV, por período." · ferramentas: "Python · python-telegram-bot · Supabase · pandas · fpdf2" · link `https://github.com/lino167/bot-os-kraflo`.
3. **`/projetos/tenua`** · "Tenua" · "Uma vitrine de marca, do design ao ar." · problema: "Um ateliê (fictício) precisava de um site de marca e de catálogo que passasse confiança." · o que fiz: "Site de marca e catálogo com design system criado no Figma." / "Verificação automática de código a cada alteração e publicação automática." / "Monitoramento de disponibilidade a cada 15 minutos." · ferramentas: "React 18 · TypeScript · Tailwind · shadcn/ui · Vercel · GitHub Actions" · link `https://github.com/lino167/tenua`. Aviso: o ateliê é fictício e a página diz isso.

#### Como funciona (`/como-funciona`)

- **Gesto:** as seis etapas se **riscam em sequência** numa linha vertical com a barrinha, cada uma entrando por tempo ao chegar à tela; ao lado, a janela em traços pequena e fixa mostra a etapa atual (a mesma linguagem da peça principal).
- **Texto:** título "Do primeiro contato ao site no ar." · apoio "Seis etapas, com a sua aprovação ao fim de cada uma." · etapas: **1. Conversa inicial.** "Por WhatsApp ou vídeo, eu entendo o seu negócio, o que você vende, para quem e onde o cliente compra hoje." **2. Proposta por escrito.** "Escopo, prazo, preço e o que não está incluso. Nada começa sem o seu aceite." **3. Entrada de 50%.** "Por Pix ou link de pagamento. A data de início só é reservada com a entrada." **4. Protótipo navegável.** "Você vê e clica nas telas antes de qualquer código. Duas rodadas de ajuste." **5. Desenvolvimento e testes.** "Código, versão de celular, velocidade e formulários testados." **6. Entrega e 50% restante.** "Site no ar, um guia curto de uso e 15 dias para pequenos ajustes." `[confirmar os 15 dias]` · seção "O combinado" (as cinco regras da cena 07) · perguntas (sanfona): "Quanto custa?" → "O valor sai por escrito na proposta, pelo WhatsApp, depois da conversa. Eu não publico tabela porque cada escopo é diferente." · "Quanto tempo leva?" → "O prazo vai por escrito na proposta." · "E se eu quiser mudar algo no meio?" → "Cada etapa tem duas rodadas de revisão. Pedido fora do escopo vira um orçamento novo, nunca um 'só mais isso'." · "De quem é o domínio?" → "Seu. Domínio, hospedagem e contas ficam no seu nome." · "Você faz tudo sozinho?" → "Sim: design e código, do protótipo ao site no ar. Por isso pego um projeto por vez." · faixa do convite.

#### Sobre (`/sobre`)

**Eixo:** a trajetória como obra. A frase: "Da obra… à fábrica… ao código… ao seu site." **Fica de fora, de propósito:** o emprego atual (empresa, cargo, "CLT", horas livres), o nome "Lino Estúdio" e os contatos pessoais do currículo.

- **S1 · Abertura.** Recorte do Zacarias sobre algodão; a barrinha-cursor escreve o título. Título "Eu sou o Zacarias. Desenho e programo a mesma peça." · apoio "Sou de Guadalupe, no Piauí, e moro em Blumenau, Santa Catarina." · legenda "Zacarias, desenvolvedor e designer".
- **S2 · De onde eu vim.** **Linha do tempo desenhada como planta**, com cotas em mono; cada parada acende ao entrar (0,5 s, stagger 0,18 s): Guadalupe (PI) → Curitiba (PR) → Ipojuca (PE) → Pecém (CE) → Guarulhos (SP) → Pomerode (SC) → Ribas do Rio Pardo (MS). Só cidades, sem nomes de empresa. Título "Do Piauí para a obra." · apoio "Passei mais de dez anos montando e consertando máquina em siderúrgica, refinaria, fábrica de papel e de tecido, do Nordeste ao Sul." · número: "mais de dez anos".
- **S3 · O que a fábrica me ensinou.** Três frases, cada uma marcada por uma barrinha. Título "Fábrica ensina o que site também precisa." · "Máquina parada custa dinheiro. Eu começo pelo que está custando venda." · "Quem usa a tela está de pé e com pressa. Eu desenho para esse dono." · "Combinado é combinado. Escopo, prazo e preço por escrito."
- **S4 · Como eu virei dev.** Três cartões em `--trama` que se firmam em ordem: formação, estudo, projetos. Título "Comecei pela peleja que eu conhecia." · "Técnico em Mecânica." · "Engenharia de Software, em andamento, na Unicesumar." · "Projetos autorais: um sistema de manutenção para equipes de fábrica (Kraflo CMMS), um bot de ordens de serviço (Kraflo OS Bot) e um site de portfólio (Tenua), com links para o GitHub." Todos com a etiqueta "Autoral".
- **S5 · Fora do código.** Faixa em `--trama` com duas etiquetas em mono, cada uma com a barrinha: `TIME · Corinthians` e `ORIGEM · Nordeste, com orgulho`. Texto: "Sou corinthiano e nordestino com orgulho." **Só texto: nenhum escudo, cor de time ou logo do clube.**
- **S6 · Como eu trabalho.** A janela em traços, pequena, repete as cinco etapas numa linha; abaixo, uma linha em mono com as ferramentas (só aqui e nas páginas de projeto): "React · Next.js · TypeScript · Tailwind · Supabase · Python · Figma". Título "Protótipo antes do código." · apoio "Você vê e clica nas telas antes de pagar a segunda parte." · link "Ver como funciona" para `/como-funciona`.
- **S7 · Convite.** Faixa grafite: "Vamos conversar sobre o seu projeto?" · "Se ficou alguma dúvida, me chama que a gente se entende, visse?" · botão "Chamar no WhatsApp".

#### Orçamento (`/orcamento`)

- **Gesto:** o formulário é uma folha em `--trama` com a grade; ao **enviar**, a barrinha risca a última linha, "fecha o traço" e a folha vira a confirmação.
- **Texto:** título "Conta o que você precisa e eu monto a proposta." · apoio "Quatro respostas bastam. Eu respondo em até 24 horas úteis."
- **Campos** (rótulo em mono 12 px, campo com fundo da página, fio `--linha`, 44 px de altura mínima, foco com contorno grafite): `nome` · `WhatsApp` (com DDD) · `O que a página ou o sistema precisa fazer` (área de texto de 4 linhas) · `Você já tem logo, fotos e textos?` (seleção: "Sim", "Em parte", "Ainda não") · `Um site que você goste, de referência` (opcional) · `Para quando você precisa?` (texto curto).
- **Como envia (sem servidor):** o botão "Enviar pelo WhatsApp" monta a mensagem com as respostas e abre `https://wa.me/5547996496281?text=…`; ao lado, o link "Prefiro e-mail" abre `mailto:contato@codimdev.com.br` com o mesmo texto. Nada é gravado em servidor.
- **Erros** (cor `--erro`, com ícone e texto): "Escreva o seu nome." · "Confira o número com DDD." · "Conte em uma frase o que você precisa." O primeiro campo inválido recebe o foco.
- **Confirmação:** "Abri o seu WhatsApp com a mensagem. Eu respondo em até 24 horas úteis." (sem sotaque, é formulário). Mostrada também se o navegador bloquear a janela, com o link para tentar de novo.

#### Privacidade (`/privacidade`)

Sem sotaque. Título "Privacidade" · "O que eu faço com os seus dados, em linguagem simples." · "Este site não usa cookies de rastreamento e não guarda o que você escreve no formulário. O formulário monta uma mensagem e abre o seu WhatsApp ou e-mail. O que você me enviar eu uso só para responder ao seu pedido." · "Para pedir que eu apague uma conversa, escreva para contato@codimdev.com.br." · "Responsável: Zacarias Lino Ramos Filho. `[preencher o CNPJ/MEI quando existir]`." Atualizar a página se um dia entrar análise de visitas.

#### 404

- **Gesto:** a janela em traços com um pedaço faltando; ao clicar ou apertar uma tecla, a barrinha fecha o traço (0,5 s) e o botão aparece.
- **Texto:** "Eita. Essa página não está no ar." · botão "Voltar ao início". `noindex`.

### Interações, movimento reduzido e celular

- **Cada clicável** tem repouso, hover (**só com mouse**, `@media (hover: hover)`), foco e clique. **No hover e no foco aparece a seleção do editor** (fio grafite de 1 px com quatro alças de 6 px em volta do elemento, 120 ms):
  - **Botão principal:** carmim com texto `--no-carmim`, 44 px mínimos; hover `opacity: 0.9`; foco com contorno de 2 px em grafite e 2 px de folga; clique desloca 1 px para baixo por 80 ms.
  - **Botão secundário:** transparente, contorno de 1 px grafite; hover fundo `--cru`; foco igual.
  - **Link:** carmim; sublinhado só no hover; foco igual.
  - **Cartão de serviço e de projeto:** repouso fio `--linha`; hover fio grafite em 150 ms e a miniatura ganha cor; foco no cartão inteiro (é um link); clique desloca 1 px.
  - **Sanfona (`<details>`):** o sinal "+" gira para "–" em 150 ms; foco visível; teclado Enter e Espaço.
  - **Campos:** hover fio `--grafite-suave`; foco contorno grafite; erro com `--erro`, ícone e texto.
- **`prefers-reduced-motion: reduce`:** sem Lenis, sem pin, sem escrita letra a letra, sem desfoque, sem transição de página; todo texto e toda miniatura aparece **já formado**; a peça principal vira cinco cartões; o carregador some; a cena 04 troca de cor por corte. Nada é escondido esperando animação.
- **Celular (390 px):** nada rola para o lado (`overflow-x: clip`); alvos de 44 px; fontes do título com `clamp`; o cabeçalho vira `[ Menu ]`; a grade de cartões vira uma coluna; o índice de projetos vira cartões; a peça principal se recompõe como descrito acima.
- **Transição entre páginas:** `@view-transition { navigation: auto; }` com um corte de 200 ms (a barrinha cruza a tela); fora de navegadores que suportam, navegação comum.

---

## Parte 2: Como construir

- **Stack (já instalada):** Astro 7 em **modo estático** (várias páginas, `output: 'static'`), Tailwind 4, **ilhas de React 19 só onde houver estado** (formulário e paleta de comandos), GSAP 3.15.0 (ScrollTrigger), Lenis 1.3.26. **Sem WebGL nem three.js na primeira versão**: as placas e a roda são **CSS 3D** e os cursores são SVG. Versões travadas (`npm install -E`). Hospedagem estática (Hostinger).
- **A base que já existe e fica** (a lógica serve; troque só o que a cena pedir): `src/lib/movimento/carga.ts` (fontes por `FontFace`), `loader.ts` (o carregador), `suave.ts` (Lenis), `revelar.ts`, `nav.ts`; `src/components/Logo.astro`, `Cabecalho.astro`, `Rodape.astro`, `Barra.astro`; `src/lib/marca/logo.ts`; `src/styles/global.css` (tokens); `src/i18n/pt.ts`; `src/lib/dados.ts`.
- **O que se reescreve:** `abertura.ts` (agora o hero com o nome gigante, a foto e a reação ao mouse), `peca.ts` (de janela plana para a **pilha de placas 3D**; cada etapa reaproveita o SVG que já existe como uma placa) e `escapa.ts` (passa a ser tarefa do motor).
- **O motor** (`src/lib/motor/`, escrito do zero, vanilla TypeScript + GSAP; veja "O motor: dois cursores"):
  - `cursores.ts`: os dois cursores em SVG (`design` e `código`), a etiqueta em mono, o movimento em curva (GSAP, `power3.inOut`), entrada e saída pelas bordas;
  - `fila.ts`: a fila de tarefas por montagem, a ordem `design` → `código` em cada bloco, a aceleração 5× quando a pessoa rola, o fechamento imediato do que saiu da tela;
  - `tarefas.ts`: uma função por tipo (`quadro`, `titulo`, `texto`, `bloco`, `foto`, `nome`, `duplica`, `ajusta`, `teste`);
  - `caixa.ts`: a caixa de seleção com as quatro alças e a medida ao vivo (também usada no hover);
  - `digita.ts`: escrita letra a letra com os caracteres em `<x-l>` (para nenhuma regra de `span` pegar);
  - `fusao.ts`: a fusão dos dois cursores na barrinha carmim e a mola que a faz seguir o mouse (desktop);
  - `hud.ts`: LCP, FPS, JS e camadas (dados reais), Tour, velocidade e "montar de novo";
  - `paleta.ts`: o ⌘K (ilha de React); `tema.ts`: o tema com o círculo; `pilha.ts` (placas 3D) e `roda.ts` (roda de projetos).
- **Estrutura de páginas e componentes:** `src/pages/` com uma rota por página listada; `src/components/` com `Hud`, `Paleta`, `Pilha`, `Roda`, `FaixaConvite`, `Cartao`, `Miniatura` (as miniaturas em SVG, uma por serviço e projeto), `Janela`; **todo o conteúdo que muda** em `src/lib/dados.ts`; todos os textos em `src/i18n/pt.ts`; um CSS por seção em `src/styles/`, em `@layer components`.
- **Personalização por `data-*`** (o HTML manda, o motor lê): `data-camada`, `data-montagem`, `data-duplica`, `data-ajusta`, `data-teste`, `data-tocado` (veja o motor); `data-linhas`, `data-revelar`, `data-delay`; `data-tema="escuro"` (seção sobre fundo grafite: o cabeçalho troca de cor); `data-peca`, `data-etapa`; `data-miniatura`; `data-destaque` (a palavra em carmim do título).
- **Ordem de inicialização:** fontes (`FontFace`) → carregador → (a tela se abre) → Lenis → pilha e roda (os pins) → `revelar` → o motor entra (cursores) → HUD, cabeçalho, tema e paleta → `ScrollTrigger.refresh()` dois quadros depois e de novo em `document.fonts.ready`.
- **Desempenho (o HUD mostra, então precisa ser verdade):** só `transform` e `opacity` são animados; JS inicial **até 120 KB comprimido**; LCP **até 2,5 s** em Fast 4G; se a média de FPS ficar **abaixo de 40**, o motor termina a construção de uma vez e para de animar.
- **Imagens:** só o recorte do Zacarias (WebP com versão de celular de 760 px, `fetchpriority="high"` se estiver acima da dobra) e, se existirem, capturas dos projetos. **Caminhos relativos** para abrir em subpasta. Tudo o mais é SVG inline.
- **SEO e acessibilidade:** um `<h1>` por página; `lang="pt-BR"`; título e descrição por página; `<link rel="canonical">`; `robots`; mapa do site; **dados estruturados** `ProfessionalService` (nome "codimdev", fundador Zacarias Lino Ramos Filho, país Brasil, cidade Blumenau/SC, `sameAs` o Instagram); `aria-hidden` nos SVG decorativos e `role="img"` + `aria-label` nas miniaturas que informam; `Pular para o conteúdo` no topo; foco visível sempre; contraste AA.
- **Erros conhecidos e a solução:**
  - fonte baixada do Google no build quebra sem internet → fontes locais;
  - SplitText mede errado se a fonte trocar depois → `ScrollTrigger.refresh()` após `document.fonts.ready`;
  - classe sem camada no CSS ganha da utilidade `hidden` → componentes em `@layer components`;
  - o último gatilho nunca chega a 55% no fim da página → `clamp()` no início do ScrollTrigger;
  - CSS importado pelo JS faz a página aparecer crua por um instante → CSS crítico do carregador inline no `<head>`;
  - `backdrop-filter` no cabeçalho prende filhos `position: fixed` (a folha do menu) → a folha fica **fora** do `<header>`;
  - quebra de linha manual (`<br>`) escondida no celular cola palavras e quebra a máscara → `text-wrap: balance` e largura máxima;
  - `npm audit fix --force` troca versões → não rodar;
  - elementos escondidos esperando a construção "piscam" antes do JS → o HTML nasce **visível** e o motor só o esconde depois de subir (classe `js-motor` posta no `<head>`, inline, e retirada em 5 s se o motor não subir);
  - `overflow: hidden`, `filter` ou `will-change` num ancestral da cena 3D achatam o `preserve-3d` → nenhum desses nos ancestrais das placas e da roda;
  - `position: fixed` dentro de um ancestral com `transform` deixa de ser fixo → cursores, HUD e paleta ficam direto no `<body>`;
  - o LCP muda até o primeiro toque ou tecla → pare de ler no primeiro input; Safari não mede LCP → mostre "—", nunca um número inventado;
  - `document.startViewTransition` não existe em todo navegador → troca direta de tema como fallback;
  - o cursor SVG por cima do conteúdo rouba cliques → `pointer-events: none`, `z-index` abaixo do cabeçalho;
  - plano grátis da Vercel não permite uso comercial → exportação estática para Hostinger, Netlify ou Cloudflare Pages.

---

## Parte 3: Conferência

- `npm run check:fast` (astro check, prettier, secretlint, floor-guard) e `npm run build` sem erro e sem aviso de arquivo faltando; console limpo do carregador ao rodapé.
- Em **1440 × 900** e **390 × 844**, página por página:
  - **Carregador:** o símbolo se desenha, o contador acompanha o download, a barrinha trava e a tela se abre sem quadro em branco.
  - **Abertura:** a barrinha escreve o título; "vender" é a única palavra em carmim.
  - **Peça principal:** as cinco etapas trocam na ordem; só a janela e a barra de etapa andam com a rolagem; o texto entra por tempo; o respiro final existe; a etiqueta "Ilustração" aparece.
  - **Virada:** a página escurece uma vez e **volta** ao algodão.
  - **Serviços e projetos:** cada miniatura se desenha ao entrar; o cartão ganha cor no hover.
  - **Sobre:** a linha do tempo acende parada a parada; **nenhuma menção** a emprego atual, CLT ou "Lino Estúdio".
  - **Formulário:** campos vazios mostram os três erros; com tudo certo, abre o WhatsApp com a mensagem.
  - **Rodapé:** só "feito por um piauiense" na linha final.
- **O motor:** com o carregador acabando, os dois cursores entram, rodeiam o símbolo e começam o hero; `design` desenha a caixa com a medida e `código` preenche; o nome gigante se desenha em contorno e enche; os cartões de serviço saem de cópias arrastadas; a linha-guia carmim aparece só nos ajustes; ao fim os dois se fundem na barrinha carmim ("uma pessoa só") e ela passa a seguir o mouse (computador).
- **Rolar rápido no meio da construção:** tudo fecha na hora e nenhum cursor volta atrás.
- **HUD:** os números são **medidos** (LCP, FPS, JS) e batem com o DevTools; sem medida, "—". Nenhum número de visitantes. **Tour** chega ao fim e mostra "Montada por 2 cursores em N s"; "montar de novo" refaz. Qualquer toque interrompe o Tour.
- **Pilha de placas:** as cinco placas entram em ordem, a câmera gira com a rolagem, o conjunto se achata na virada e a página escurece; nada fica cortado no 3D (Chrome e Safari).
- **Roda de projetos:** gira com a rolagem; no celular vira trilho com encaixe; cada cartão leva à página do projeto.
- **Tema, ⌘K e transição:** o círculo abre do ponto do clique; ⌘K abre com foco no campo, setas e Enter funcionam, Esc fecha; a máscara entre páginas dura cerca de 200 ms.
- **Desempenho:** JS inicial até 120 KB comprimido; LCP até 2,5 s em Fast 4G; sem queda abaixo de 40 FPS rolando; `?pronto`, movimento reduzido e sem JavaScript abrem a página montada.
- **Rolando devagar, depressa e de volta:** o pin não pula; os gatilhos de entrada disparam uma vez.
- **Mouse e teclado:** hovers só com mouse; Tab percorre tudo com foco visível; Esc fecha o menu; Enter e Espaço abrem a sanfona.
- **Celular:** `document.documentElement.scrollWidth` igual à largura da tela; alvos de 44 px.
- **Movimento reduzido** (emulado) e **sem JavaScript:** tudo legível; o formulário comum continua visível.
- **Subpasta:** copiar o build para `_teste/codimdev/`, servir com `python3 -m http.server` e conferir que não há nenhum 404.
- **Texto:** procurar no site inteiro por "CodimDev", "Codim Dev", "CODIMDEV", "!", "automação", "vídeo" e por qualquer preço; nenhum pode existir. Procurar também por "CLT" e "Lino Estúdio", e pelo nome de qualquer empregador atual (nenhum pode existir).
- O que não puder ser visto num navegador (por exemplo, o envio real pelo WhatsApp), **dizer com todas as letras** que ficou sem conferir.

## Personalizar

| O quê                                | Onde                                                           | Precisa de material novo?  |
| ------------------------------------ | -------------------------------------------------------------- | -------------------------- |
| Textos, números, contato             | `lib/dados.ts` e `i18n/pt.ts`                                  | não                        |
| Cores                                | `styles/tokens.css`                                            | não                        |
| Novo projeto                         | `lib/dados.ts` (entrada) + miniatura em `components/Miniatura` | opcional (captura de tela) |
| Novo serviço                         | `lib/dados.ts` + página em `pages/servicos/`                   | não                        |
| Sotaque (tirar ou pôr uma expressão) | `i18n/pt.ts` (cada linha marcada `// sotaque`)                 | não                        |
| Foto do Zacarias                     | `public/img/zacarias.webp` (+ `-m`)                            | sim                        |
| Peça principal                       | `components/Peca` (uma timeline por etapa)                     | não                        |

## [preencher]

- **Motor dos cursores:** do zero (padrão) ou o do Kairo adaptado (só com o repositório **privado**).
- **As 4 fotos extras** do Zacarias (`imagens/zacarias/` do repositório da marca) e os **prints** do Kraflo CMMS, do Kraflo OS Bot e do Tenua, em modo escuro, 16:10.

- **15 dias** de ajustes depois da entrega: confirmar (aparece nas mensagens-modelo, mas a Plataforma deixava em aberto).
- **Domínio:** `codimdev.com.br` está no Design System; confirmar que está registrado e apontando para a hospedagem.
- **Capturas de tela reais** dos projetos (opcional; sem elas, valem as miniaturas em traço).
- **Medição de visitas:** decidir se entra (e então atualizar `/privacidade`).
- **CNPJ ou MEI** na página de privacidade, quando existir.
- **Prazo e escopo exatos** de cada serviço (o que está incluso em "SEO básico" e "pronta para medir"): confirmar antes de publicar.
- Depoimento: nenhum por enquanto; a seção não entra.
