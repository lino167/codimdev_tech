# codimdev: uma prancheta de projeto em que o site é riscado em traço fino e a barrinha carmim o põe no ar

Este arquivo é a especificação completa do site da codimdev. Funciona sozinho: quem ler só ele consegue construir o site sem a conversa que o originou. Tudo o que não está aqui não existe no site. Quando um fato não estiver escrito, ele fica `[preencher]` e **nunca** é inventado.

## Antes de começar: pergunte

Antes de escrever código, leia `AGENTS.md`, `src/` e `git log` (o projeto já existe em Astro). Depois pergunte, uma coisa por vez e em linguagem simples:

1. O que a pessoa quer agora: **construir o site inteiro**, construir só uma página ou parte, ou só rever um texto.
2. Se faltar algo da lista `[preencher]` no fim, peça agora.
3. O material de cada cena (a resposta curta é: **quase nada depende de arquivo externo**):
   - Peça principal, miniaturas de serviço, carregador, 404, transições: **feitos em código** (SVG, CSS, GSAP). Não pedem material.
   - Logo (SVG) e 23 ícones: **já existem** no Design System da codimdev (artefato "Codimdev"). O SVG original da logo manda; se faltar, não redesenhe: pare e peça.
   - Recorte do Zacarias (moletom bege, fundo transparente, 840 × 1050 px): **já existe** no Livro da marca. Sem ele, a cena "Quem faz" fica só com as cotas em traço e a legenda, marcada como provisória.
   - Projetos: cada um aparece com uma **miniatura desenhada em traço** do que entrega. Capturas de tela reais são opcionais (`[preencher]`); sem elas, a miniatura em traço fica.
   - Fotografia de banco de imagem, vídeo e imagem gerada por IA: **não entram** em nenhuma cena.

## A ideia

- A página é uma **prancheta de projeto**: fundo algodão com grade fina; um site é riscado em traço fino de grafite, etapa por etapa, e a **barrinha inclinada carmim** (a assinatura da logo) é o cursor que desenha e, no fim, acende a luz de "no ar". O site de quem faz sites não explica o processo: ele **é** o processo.
- **A régua:** cada seção tem um gesto; seção que vira bloco parado ainda não está pronta.
- **Eixo:** o processo (do bruto ao pronto). **A frase da peça:** "Uma conversa… vira protótipo… vira código… passa nos testes… e vai ao ar."
- **Os quatro atos:** o antes (prancheta em branco e o problema do dono) → o processo (a peça principal, presa por cinco telas) → a virada (a luz acende e a página escurece, uma única vez) → o depois (serviços, projetos, combinado, o rosto de quem faz e o convite).
- **O site tem várias páginas.** A página inicial é o trailer; cada página tem uma função e o mesmo traço.

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

Nada de branco puro nem de preto puro nos fundos. Carmim **nunca** como fundo de seção, em vários botões juntos ou para indicar erro. Contraste: carmim sobre algodão 5,2:1; carmim sobre trama 4,6:1; carmim sobre grafite só em texto de 24 px ou mais e na barrinha. A paleta inteira troca num lugar só (`styles/tokens.css`); o tema escuro do Design System existe, mas **fica fora da primeira versão**.

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
- **Textura:** grade fina de 24 × 24 px em `--linha` a 50% de opacidade, atrás de tudo, e a **barra de quatro colunas em mono** no topo de cada página (fio grafite de 2 px em cima). No pé de cada página, uma **linha carmim de 3 px com a barrinha** à esquerda.
- **A barrinha:** retângulo de 18 × 12 px, cantos de 2 px, `transform: skewX(-36deg)`, cor carmim. É o cursor, o marcador de lista, o "visto" e a luz de status. Sempre pequena e sempre carmim.
- Transições de cor de **150 ms**; o sublinhado do link só aparece no hover.
- Ícones: os 23 próprios do Design System (traço de 1,75 px, grade 24 px). Tamanhos: 24 px padrão, 20 px em botão, 32 ou 48 px em cartão. **Um detalhe carmim por ícone.** Os de serviço (`site`, `sistema`, `design`, `codigo`, `dados`, `ajustes`, `mensagem`, `etiqueta` e afins) levam o detalhe; os de interface (`seta`, `check`, `fechar`, `menu`, `mais`, `busca`, `email`, `celular`, `calendario`, `relogio`, `download`, `externo`, `usuario`) não. No código, o traço usa `currentColor`. Ícones de `video` e `automacao` **não são usados**.

#### Cabeçalho e rodapé (todas as páginas)

- **Cabeçalho** (fixo, 72 px; 56 px depois de 40 px de rolagem, com fundo algodão a 92% e fio embaixo; some ao descer passada meia tela e volta ao subir): logo horizontal à esquerda; `[ Serviços ]  [ Projetos ]  [ Como funciona ]  [ Sobre ]` em mono 13 px, entre colchetes (os colchetes em `--grafite-suave`); botão "Pedir orçamento" (carmim) à direita. Sobre a cena escura, o cabeçalho e o botão trocam de cor (texto algodão; botão algodão com texto grafite). Até 960 px, os links viram um botão `[ Menu ]` que abre uma folha algodão de tela cheia com os links em IBM Plex Sans 600, 48 px, e o botão de orçamento em largura total (Esc fecha; a rolagem trava).
- **Rodapé:** a logo horizontal em escala grande e proporcional (altura mínima igual à do "o" de respiro em todos os lados), quatro colunas de links (Serviços, Projetos, Como funciona, Sobre, Orçamento, Privacidade; Instagram `@codimdev`; e-mail), a linha em mono "codimdev · desenvolvimento web · 2026" e, **sozinha numa linha abaixo, "feito por um piauiense"** (nada mais: sem cidade, sem bandeira, sem detalhe). A linha carmim com a barrinha fecha a página. "Voltar ao topo" leva a barrinha de volta ao cursor da abertura.

### 00 — Carregador

- Tela algodão com a grade. O **símbolo da logo** (o primeiro subcaminho do SVG oficial, em grafite) é **desenhado em traço fino** (`stroke-dashoffset`) conforme o **progresso real** chega: bytes das fontes e do JS e do CSS que já vieram (Resource Timing), nunca um timer; o número nunca volta. Tempo mínimo de **1,1 s**; limite de 9 s em rede lenta (a página segue com o que tiver).
- Embaixo do símbolo, o contador em mono 12 px caixa alta: "JÁ JÁ · 64%" (atributo `aria-label` "Carregando a página", `role="progressbar"`).
- Em 100%, a barrinha carmim risca o símbolo na diagonal e **trava no lugar** (clique de 120 ms); a tela se abre para cima em 0,7 s (`power3.inOut`) sobre o primeiro quadro da abertura, sem quadro em branco no meio. Rolagem travada durante a carga, sem esconder a barra.
- Antes do JS, o símbolo já aparece em CSS (traço completo e apagado, depois de 0,4 s; com cache nem aparece). O `<html>` começa com a classe `is-loading` e um temporizador de segurança de 10 s a remove sozinho.
- Movimento reduzido ou sem WebGL/JS: a página aparece direto, sem carregador.

### Páginas e cenas

#### Página inicial (`/`)

**01 · Abertura** (ato 1, 100 svh)

- **Gesto:** barra mono de quatro colunas no topo: "codimdev · Desenvolvimento web · Blumenau, SC · 2026". Grade fina ao fundo. A barrinha-cursor **escreve o título** letra a letra (32 ms por letra) e pousa; à direita, uma janela de navegador em traços tracejados fica **esboçada, esperando** (opacidade 35%).
- **Texto:** título "Seu site deveria vender. Não só existir." (**vender** em carmim) · apoio "Landing pages, sites e sistemas web para empresas. Eu desenho e programo a mesma peça, do protótipo ao site no ar." · botões "Pedir orçamento" (carmim) e "Ver projetos" (secundário) · nota em mono 12 px "Orçamento pelo WhatsApp · resposta em até 24 horas úteis".
- **Passagem:** a barrinha desce riscando a grade até a primeira frase da cena 02.
- **Celular:** título em 3 linhas, a janela em traços vira uma faixa de 160 px abaixo dos botões; botões em largura total.

**02 · O que escapa** (ato 1)

- **Gesto:** três frases do dono em `--grafite-suave`, uma por vez, entrando por tempo; a barrinha carmim **risca na diagonal** a parte que falha ("perde o lead", "espantando cliente", "não é sistema de gestão") e a frase escurece para grafite.
- **Texto:** "Seu anúncio paga o clique. Sua página perde o lead." · "Seu formulário está espantando cliente." · "Planilha não é sistema de gestão." · apoio "Eu começo pelo que está custando venda, não pelo que é bonito."
- **Passagem:** a última barrinha vira cursor e desce até a janela em traços, que **sobe ao centro** (escala 0,6 → 1).

**03 · Do briefing ao site no ar** (ato 2, **a peça principal**, presa por 5 telas)

- **O que se vê:** uma janela de navegador desenhada em SVG (viewBox 1200 × 720) no centro da tela, com leve perspectiva (`perspective: 1600px`, `rotateX(8deg) rotateY(-10deg)` que **acalma para 0** a cada etapa). Traço de 1,5 px em grafite; sem sombra até a etapa 3. A etapa atual fica em 100% de opacidade; as anteriores em 35%.
- **Estrutura da cena:** `<section data-peca>` fixada com ScrollTrigger (`pin: true`, `end: "+=500%"`, `scrub: 0.6`, `anticipatePin: 1`). Abertura nos primeiros 6% do pin (a janela sobe e se firma) e respiro final nos últimos 4%. Cinco marcos a 20% da rolagem cada, depois de descontados os 10%.
- **Etapas:**

| Etapa | Rótulo              | Parte da frase       | O que se vê                                                                                                                                                                                                                                                 | Fato                                                                                                            |
| ----- | ------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 1     | Etapa 1 · Conversa  | "Uma conversa…"      | Dois balões em traço (retângulos de 4 px com 3 linhas cada) e, ao lado, uma folha em proporção A4 com o cabeçalho "PROPOSTA" em mono. Três linhas se escrevem por tempo: "Escopo", "Prazo", "Preço".                                                        | "Proposta por escrito antes de começar: escopo, prazo, preço e o que não está incluso. Nada começa sem aceite." |
| 2     | Etapa 2 · Protótipo | "…vira protótipo…"   | A janela se desenha (moldura, barra de endereço) e ganha o wireframe: bloco de herói, três cartões e rodapé, com `X` nos espaços de imagem. A barrinha-cursor clica nas abas "01 02 03" e as três telas trocam em 150 ms.                                   | "Você clica nas telas antes de qualquer código. São 2 rodadas de ajuste."                                       |
| 3     | Etapa 3 · Código    | "…vira código…"      | Os blocos ganham preenchimento `--trama` e texto real (Plex Sans e Inter). À direita, um painel (38% da largura) com 9 linhas de código em mono se escreve a 40 caracteres por segundo, com a barrinha como cursor de texto. A `sombra-suave` aparece aqui. | "Design e código pela mesma pessoa, sem ruído entre etapas."                                                    |
| 4     | Etapa 4 · Testes    | "…passa nos testes…" | A janela encolhe de 100% para 38% de largura até virar um celular em traço (cantos de 4 px). Três linhas em mono ganham um `check` de 20 px, uma a cada 0,25 s: "celular", "velocidade", "formulário".                                                      | "Versão de celular, velocidade e formulários testados."                                                         |
| 5     | Etapa 5 · No ar     | "…e vai ao ar."      | A barra de endereço escreve um domínio ilustrativo ("suaempresa.com.br") a 30 caracteres por segundo. A **luz de status** (a barrinha carmim, 18 × 12 px) acende com um pulso (escala 1 → 1,6 → 1 em 0,8 s) ao lado do rótulo "NO AR" em mono.              | "Site no ar, um guia curto de uso e 15 dias para pequenos ajustes." `[confirmar os 15 dias]`                    |

- **Texto:** título da cena "Uma conversa vira protótipo, vira código e vai ao ar." (**ar** em carmim), no alto e fora do pin. Dentro do pin, abaixo da janela, uma barra mono "ETAPA 3 · CÓDIGO" (barra flutuante, também mostrada no celular) e a parte da frase da etapa em Plex Sans 600, 36 px: **entra palavra por palavra** saindo do desfoque (`filter: blur(6px)` → 0, 0,5 s, stagger 0,06 s) depois da troca e **sai antes da próxima**. Um fato real de 1 a 2 linhas em Inter 16 px, em `--grafite-suave`.
- **Aviso:** no canto inferior direito da janela, a etiqueta em mono "Ilustração".
- **Celular (390 px):** o pin vira 400% (4 marcos úteis); a janela ocupa 100% da largura menos 40 px; o painel de código da etapa 3 desce para baixo da janela; a etapa 4 vira o próprio celular centralizado a 60%.
- **Movimento reduzido:** sem pin; as cinco etapas viram cinco cartões em coluna, já formados, cada um com a janela no estado final daquela etapa.
- **Passagem:** a janela firma, a luz acende e a página escurece (cena 04).

**04 · No ar** (ato 3, fundo `--grafite`, a única cena escura)

- **Gesto:** o fundo vai de algodão para grafite em 600 ms ao final do pin (`scrub` nos últimos 4%). A luz de status pulsa uma vez; a janela, já site, **recua de escala** (1 → 0,55) e sobe para o canto. As cores de texto trocam para `--algodao` e `#A3A4AA`. Ao rolar adiante, o fundo **volta** a algodão.
- **Texto:** título "Pronto. Agora o site trabalha para você." (IBM Plex Sans 600, 64 px, algodão; carmim claro `#EC5A4D` só em **trabalha**) · apoio "Cada tela existe para vender, informar ou poupar tempo." · sem botão.
- **Passagem:** a janela encolhe e vira o ícone do primeiro cartão de serviço.

**05 · Serviços** (ato 4)

- **Gesto:** cinco cartões em `--trama` (grade de 3 + 2 colunas no desktop; 1 coluna no celular), cada um com o ícone de serviço (detalhe carmim). Ao entrar (gatilho a 85% da altura da tela), cada cartão **desenha em traço uma miniatura** do que entrega (1,0 s, stagger 0,12 s) e firma: funil e botão; árvore de páginas; antes e depois com uma alça; painel com gráfico; componentes em grade.
- **Texto:** eyebrow "Serviços" · título "Cinco serviços. Uma pessoa só." (**só** em carmim) · apoio "Escopo, prazo e preço por escrito antes de começar." · cartões: "Landing pages focadas em conversão" ("Páginas rápidas para campanhas de tráfego pago, onde você mede o retorno em leads e vendas."), "Sites institucionais" ("Posicionamento profissional, SEO básico e contato por WhatsApp e formulário."), "Redesign e otimização de conversão" ("Eu refaço o site ou sistema que está lento, ruim no celular ou perdendo venda."), "Interfaces, dashboards e MVPs" ("Área de membros, portais de clientes e painéis administrativos sob medida."), "Design system" ("Padronização de telas e componentes para acelerar as entregas do seu time.") · link "Ver os cinco serviços" para `/servicos`; cada cartão leva à página do serviço.
- **Números:** 5 serviços. Sem preço.
- **Passagem:** o último traço vira a linha do índice de projetos.

**06 · Projetos** (ato 4)

- **Gesto:** **índice numerado em mono** (`[01] Kraflo CMMS`, `[02] Kraflo OS Bot`, `[03] Tenua`); passar o mouse num nome acende a prévia ao lado (a miniatura em traço troca em 150 ms e ganha cor, com o carmim só na barrinha). No celular, três cartões.
- **Texto:** título "Projetos autorais, chamados de autorais." · apoio "Fiz estes projetos para mostrar como eu trabalho. O primeiro cliente entra aqui." · etiqueta "Autoral" em cada um · link "Ver todos os projetos" para `/projetos`.
- **Passagem:** a prévia some e a barrinha vira o marcador da lista de regras.

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

**10 · Rodapé:** como descrito acima.

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

- **Cada clicável** tem repouso, hover (**só com mouse**, `@media (hover: hover)`), foco e clique:
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

- **Stack (já instalada):** Astro 7 em **modo estático** (várias páginas, `output: 'static'`), Tailwind 4, **ilhas de React 19 só onde houver estado** (formulário, peça principal), GSAP 3.15.0 (ScrollTrigger, SplitText), Lenis 1.3.26. **Sem WebGL e sem three.js**: a marca é plana e de traço fino; a peça principal é SVG + CSS. Versões travadas (`npm install -E`). Hospedagem estática (Hostinger, Netlify ou Cloudflare Pages).
- **Remover da base atual** (era da identidade antiga e **não vale**): `src/lib/mundo/` inteiro (símbolo dos dois C, título em pontos), `Hero.astro`, os tokens e as fontes de Archivo Condensada e JetBrains Mono, os textos "CodimDev"/"Tudo conectado" e qualquer menção a "automação".
- **Reaproveitar** (a lógica serve; troque tokens e textos): `src/lib/movimento/carga.ts` (registro de fontes por `FontFace`), `loader.ts` (progresso real, mínimo 1,1 s, limite de 9 s), `suave.ts` (Lenis no ticker do GSAP), `revelar.ts` (entradas por tempo) e `nav.ts` (barra que some e volta).
- **Estrutura:** `src/pages/` com uma rota por página listada; `src/components/` com `Cabecalho`, `Rodape`, `FaixaConvite`, `Cartao`, `Miniatura` (as miniaturas em SVG, uma por serviço e projeto), `Janela` (a janela em traços); `src/lib/dados.ts` (**todo o conteúdo que muda**: contatos, serviços, projetos, perguntas, etapas); `src/i18n/pt.ts` (todos os textos visíveis; nenhum texto fora dele; `en.ts` fica para depois); `src/styles/` com `tokens.css` e um CSS por seção, em `@layer components`.
- **Personalização por `data-*`** (para trocar sem mexer no JavaScript): `data-linhas` (título que sobe de máscara), `data-revelar` e `data-delay` (bloco que entra por tempo e com atraso), `data-tema="escuro"` (seção sobre fundo grafite: o cabeçalho troca de cor), `data-peca` e `data-etapa="1..5"` (peça principal), `data-miniatura="funil|paginas|antes-depois|painel|componentes"`, `data-destaque` (a palavra em carmim do título).
- **Módulos (comportamento; o arquivo da base atual entre parênteses):**
  - **Carregador:** símbolo desenhado por traço conforme o progresso real, contador mono, a barrinha trava, a tela se abre (`loader.ts`, `carga.ts`).
  - **Rolagem suave:** Lenis com `lerp 0.09` movido pelo ticker do GSAP; links `#` rolam por ele (`suave.ts`).
  - **Revelar:** linhas que sobem de máscara (1,1 s `expo.out`, stagger 0,085) e blocos por opacidade + 30 px, gatilho a 88% da tela, uma vez (`revelar.ts`).
  - **Cabeçalho:** `is-scrolled` depois de 40 px, some ao descer passada meia tela, troca de cor sobre `data-tema="escuro"`, folha de menu no celular (`nav.ts`).
  - **Peça principal:** ScrollTrigger com pin de 500% (400% no celular), `scrub: 0.6`, cinco marcos; cada etapa uma timeline curta; o texto de cada etapa por tempo.
  - **Escrita:** efeito de digitação reutilizável (caracteres por segundo configurável, cursor = a barrinha).
  - **Traço:** `desenharTraco(svg)` mede cada `<path>` (`getTotalLength`) e anima `stroke-dashoffset`.
  - **Formulário:** valida, monta a mensagem e abre o WhatsApp ou o e-mail.
- **Ordem de inicialização:** fontes carregadas (`FontFace`) → carregador → Lenis → ScrollTrigger → peça principal (pin) → revelar → cabeçalho → `ScrollTrigger.refresh()` dois quadros depois e de novo em `document.fonts.ready`.
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

- **15 dias** de ajustes depois da entrega: confirmar (aparece nas mensagens-modelo, mas a Plataforma deixava em aberto).
- **Domínio:** `codimdev.com.br` está no Design System; confirmar que está registrado e apontando para a hospedagem.
- **Capturas de tela reais** dos projetos (opcional; sem elas, valem as miniaturas em traço).
- **Medição de visitas:** decidir se entra (e então atualizar `/privacidade`).
- **CNPJ ou MEI** na página de privacidade, quando existir.
- **Prazo e escopo exatos** de cada serviço (o que está incluso em "SEO básico" e "pronta para medir"): confirmar antes de publicar.
- Depoimento: nenhum por enquanto; a seção não entra.
