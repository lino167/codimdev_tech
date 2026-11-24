# codimdev — a história do site

## A ideia

- **Em uma frase:** uma prancheta de projeto em que um site é riscado em traço fino de grafite, etapa por etapa, e a barrinha carmim da codimdev o acende no fim. O que o visitante rola é o que eu faço por ele.
- **A régua:** cada seção tem um gesto; seção parada ainda não está pronta.
- **Eixo:** o processo (do bruto ao pronto).
- **A frase da peça:** "Uma conversa… vira protótipo… vira código… passa nos testes… e vai ao ar."
- **Por que funciona:** o site de quem faz sites não explica o processo, ele **é** o processo. Quem rola vê um traço virar interface e sai querendo que o próprio site seja feito assim.

## Os quatro atos

1. **O antes:** uma prancheta clara com grade fina. A barrinha carmim, que é o cursor, escreve "Seu site deveria vender. Não só existir." e uma janela de navegador fica esboçada em traços, esperando. Depois, três frases que o dono já pensou ("Seu anúncio paga o clique. Sua página perde o lead.") são riscadas.
2. **O processo:** a peça principal. A janela esboçada vira conversa, protótipo, código, teste e site no ar, presa por cinco telas.
3. **A virada:** o instante em que a luz de status acende e a janela firma. É o único momento em que a página escurece.
4. **O depois:** os cinco serviços, os projetos autorais (chamados de autorais), o combinado por escrito, o rosto de quem faz e o convite para o WhatsApp.

## A peça principal

- **Linguagem:** construção em traços. Mesma ideia da "obra em traços 3D" do kit, trocando a loja de 12 × 8 m por uma **janela de navegador** (`kit/pecas/obra-tracos.ts` como motor). Em SVG e CSS 3D leve, sem WebGL: a marca é plana, de traço fino, sem brilho.
- **Etapas:**

| Etapa | Rótulo              | Parte da frase       | O que se vê                                                                                        | Fato real                                                           |
| ----- | ------------------- | -------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1     | Etapa 1 · Conversa  | "Uma conversa…"      | Balões em traço e uma folha "proposta" sendo escrita: escopo, prazo, preço                         | Proposta por escrito antes de começar; nada começa sem aceite.      |
| 2     | Etapa 2 · Protótipo | "…vira protótipo…"   | A janela em traços ganha a grade; um cursor clica e troca entre três telas                         | Você clica nas telas antes de qualquer código. 2 rodadas de ajuste. |
| 3     | Etapa 3 · Código    | "…vira código…"      | Os traços ganham preenchimento (trama) e texto real; ao lado, linhas de código em mono se escrevem | Design e código pela mesma pessoa, sem ruído entre etapas.          |
| 4     | Etapa 4 · Testes    | "…passa nos testes…" | A janela encolhe até virar celular; três marcas em mono: celular, velocidade, formulário           | Versão de celular, velocidade e formulários testados.               |
| 5     | Etapa 5 · No ar     | "…e vai ao ar."      | A barra de endereço escreve um domínio ilustrativo; a luz de status carmim acende                  | Guia curto de uso e 15 dias para ajustes `[confirmar]`.             |

- **Material:** nenhum. Tudo em código (SVG, GSAP, CSS). A janela leva o canto "Ilustração" porque o domínio e as telas são exemplo.
- **Barra flutuante:** durante a peça, no pé: "ETAPA 3 · CÓDIGO" em mono, com a barrinha andando.

## O roteiro cena a cena

### 0 — Carregador · ato 1

- **Gesto:** o símbolo da logo é desenhado em traço fino de grafite conforme os bytes chegam (progresso real, nunca timer). Em 100% a barrinha carmim risca o símbolo e trava no lugar, como um clique. O contador fica em mono: "CARREGANDO 64%".
- **Texto:** só o contador.
- **Passagem:** o traço do símbolo vira o cursor que vai escrever o título.

### 1 — Abertura · ato 1

- **Gesto:** barra de quatro colunas em mono no topo ("codimdev · Desenvolvimento web · Blumenau, SC · 2026") e grade fina ao fundo, como nos modelos de Instagram. A barrinha-cursor escreve o título; a janela em traços fica esboçada à direita.
- **Texto:** título "Seu site deveria vender. Não só existir." (**vender** em carmim) · apoio "Landing pages, sites e sistemas web para empresas. Eu desenho e programo a mesma peça, do protótipo ao site no ar." · botões "Pedir orçamento" (carmim) e "Ver projetos" (secundário) · nota em mono "Orçamento pelo WhatsApp · resposta em até 24 horas úteis".
- **Números:** 24 horas úteis.
- **Passagem:** a barrinha desce riscando a grade até a primeira frase da cena seguinte.

### 2 — O que escapa · ato 1

- **Gesto:** três frases do dono em grafite suave, uma por vez; a barrinha carmim risca, na diagonal, a parte que falha ("perde o lead", "espantando cliente", "não é sistema de gestão").
- **Texto:** "Seu anúncio paga o clique. Sua página perde o lead." · "Seu formulário está espantando cliente." · "Planilha não é sistema de gestão." · apoio "Eu começo pelo que está custando venda, não pelo que é bonito."
- **Números:** nenhum.
- **Passagem:** a última barrinha vira cursor e desce até a janela em traços, que sobe ao centro.

### 3 — Do briefing ao site no ar · ato 2 (a peça principal)

- **Gesto:** seção presa por cinco telas; a rolagem avança as cinco etapas da tabela acima. O texto de cada etapa entra por tempo; só a janela e a barra de etapa andam com a rolagem.
- **Texto:** título "Uma conversa vira protótipo, vira código e vai ao ar." (**ar** em carmim) · cada etapa: rótulo, parte da frase e o fato real da tabela.
- **Números:** 2 rodadas; 15 dias `[confirmar]`.
- **Passagem:** a janela firma, a luz acende e a página escurece (cena 4).

### 4 — No ar · ato 3

- **Gesto:** a única cena em grafite. A luz de status carmim pulsa uma vez e a janela, já site, recua de escala. O fundo volta a algodão ao rolar.
- **Texto:** título "Agora o site trabalha para você." · apoio "Cada tela existe para vender, informar ou poupar tempo." · sem botão.
- **Números:** nenhum.
- **Passagem:** a janela encolhe e vira o ícone do primeiro cartão de serviço.

### 5 — Serviços · ato 4

- **Gesto:** cinco cartões em trama com o ícone de serviço (detalhe carmim). Ao entrar, cada cartão desenha em traço uma miniatura do que entrega (funil e botão, árvore de páginas, antes e depois, painel, componentes) e firma.
- **Texto:** eyebrow "Serviços" · título "Cinco serviços. Uma pessoa só." (**só** em carmim) · apoio "Escopo, prazo e preço por escrito antes de começar." Cartões: "Landing pages focadas em conversão", "Sites institucionais", "Redesign e otimização de conversão", "Interfaces, dashboards e MVPs", "Design system" (frases do Livro da marca).
- **Números:** 5 serviços. Sem preço.
- **Passagem:** o último traço vira a linha do índice de projetos.

### 6 — Projetos · ato 4

- **Gesto:** índice numerado em mono; passar o mouse num nome acende a prévia (imagem em preto e branco que ganha cor). No celular, cartões. Etiqueta "Autoral" em todos.
- **Texto:** título "Projetos autorais, chamados de autorais." · apoio "Fiz estes projetos para mostrar como eu trabalho. O primeiro cliente entra aqui." `[confirmar o tom]` · cartões: VARN, Bio Bichos, R.S. Soluções, com o problema e o que fiz `[preencher]`.
- **Números:** nenhum.
- **Passagem:** a prévia some e a barrinha vira marcador da lista de regras.

### 7 — O combinado · ato 4

- **Gesto:** cinco regras, cada uma marcada por uma barrinha que cai no lugar; no fim, a barrinha "assina" a última linha.
- **Texto:** título "O combinado fica por escrito." · regras: "Proposta com escopo, prazo, preço e o que não está incluso. Nada começa sem aceite." · "50% para começar, 50% na entrega, por Pix ou link." · "2 rodadas de revisão por etapa. Pedido fora do escopo vira orçamento novo." · "Domínio, hospedagem e contas ficam no seu nome." · "Um projeto por vez, para cumprir o prazo."
- **Números:** 50%, 2 rodadas.
- **Passagem:** a assinatura desliza até a margem do retrato.

### 8 — Quem faz · ato 4

- **Gesto:** o recorte do Zacarias sobre algodão, cercado de cotas de desenho técnico em traço fino: "design" de um lado, "código" do outro, a barrinha no meio. Sem filtro, sombra ou gradiente na foto.
- **Texto:** título "Design e código pela mesma pessoa." · apoio "Não tem agência no meio. Você fala comigo do primeiro contato até o site no ar." · legenda "Zacarias, desenvolvedor e designer · Blumenau, SC".
- **Números:** nenhum.
- **Passagem:** a faixa grafite sobe por baixo da foto.

### 9 — Convite final · ato 4

- **Gesto:** faixa grafite com o botão carmim (uma vez na página). Ao entrar, a luz de status acende. Um formulário curto de três campos: nome, WhatsApp (erro "confira o número com DDD") e o que você precisa.
- **Texto:** título "Vamos ver o que um site resolve no seu caso?" · apoio "Escopo, prazo e preço por escrito antes de começar." · botão "Chamar no WhatsApp" · alternativa "contato@codimdev.com.br".
- **Números:** 24 horas úteis.
- **Passagem:** a linha carmim com a barrinha corre até o rodapé.

### 10 — Rodapé · ato 4

- **Gesto:** a logo horizontal em escala grande e proporcional, sobre algodão; a linha carmim com a barrinha fecha a página, como nos modelos de Instagram. "Voltar ao topo" leva a barrinha de volta ao cursor da cena 1.
- **Texto:** links (Serviços, Projetos, O combinado), Instagram `[preencher]`, "codimdev · desenvolvimento web · Blumenau, SC · 2026".

### 404 — extra

- **Gesto:** a janela em traços, com um pedaço faltando. Ao clicar ou apertar uma tecla, a barrinha fecha o traço.
- **Texto:** "Essa página não está no ar." · botão "Voltar ao início".

**Teste dos títulos em ordem:** Seu site deveria vender. Não só existir. → Seu anúncio paga o clique. Sua página perde o lead. → Uma conversa vira protótipo, vira código e vai ao ar. → Agora o site trabalha para você. → Cinco serviços. Uma pessoa só. → Projetos autorais, chamados de autorais. → O combinado fica por escrito. → Design e código pela mesma pessoa. → Vamos ver o que um site resolve no seu caso?

## Direção visual

- **Paleta** (tokens do Design System; tema claro no site): algodão `#F5F4EF` (fundo da página) · trama `#E9E7E0` (cartões e janelas) · cru `#DEDCD4` (hover e selos) · linha `#D6D4CC` (fios e grade) · grafite `#18191D` (texto e a cena escura) · grafite suave `#5C5D63` (legendas) · carmim `#C42A1F` (botão principal, link, uma palavra por título, o traço do símbolo e o pingo do "i"). Floresta `#2F6E54` e erro `#8E1B12` só em campo e confirmação. Nada de branco puro nem preto puro nos fundos.
- **Fontes** (arquivo local, sem `@font-face` solto): IBM Plex Sans 600 e 400 nos títulos e subtítulos · Inter 400 e 500 no texto e nos botões · IBM Plex Mono 400 em etiquetas, contadores e rótulos.
- **Tom:** o artesão. Frase-exemplo: "Seu site deveria vender. Não só existir." Proibidas: inovador, disruptivo, solução completa, alavancar, "transforme seu negócio", "presença digital"; exclamação, caixa alta e emoji; "CodimDev", "Codim Dev", "CODIMDEV".
- **Textura:** grade fina de 24 px em `linha`, barra de quatro colunas em mono, cantos de 4 px, sombra suave só na janela do produto, transições de cor de 150 ms. Sem gradiente, brilho ou pílula. Carmim nunca como fundo de seção.
- **Movimento:** traço que se desenha (stroke), cursor-barrinha, entradas por tempo (`expo.out`), uma suavização só (Lenis). Sem WebGL.

## Material

| Item                                       | Para qual cena     | Caminho                                | Legenda "imagem ilustrativa"?        |
| ------------------------------------------ | ------------------ | -------------------------------------- | ------------------------------------ |
| Logo e símbolo (SVG)                       | 0, rodapé, favicon | já existe no Design System             | não                                  |
| 23 ícones próprios                         | 5 e interface      | já existem no Design System            | não                                  |
| Recorte do Zacarias (840 × 1050)           | 8                  | já existe no Livro da marca            | não                                  |
| Janela em traços, miniaturas de serviço    | 1, 3, 4, 5, 404    | código                                 | a janela da cena 3 leva "Ilustração" |
| Prévias de VARN, Bio Bichos, R.S. Soluções | 6                  | capturas das prévias existentes        | não, são autorais e levam a etiqueta |
| Arquivos de fonte                          | todas              | gerar com `scripts/fontes.py` adaptado | não                                  |

## [preencher]

- Número do WhatsApp e o link do Instagram.
- Domínio e e-mail (codimdev.com.br está no Design System, falta confirmar o registro).
- Prazo de ajustes depois da entrega (15 dias aparece nas mensagens, mas a Plataforma ainda o deixava em aberto).
- Para cada projeto autoral: o problema e o que mudou, em uma frase real.
- Depoimento: nenhum por enquanto, a seção não entra.
