# codimdev — a história do site (versão 2: cinematográfica)

> **Esta versão substitui a primeira**, que tinha uma peça em desenho de linha plano, sem material e sem o cursor reagindo. A nova direção vem do estudo de 31 Sites of the Day da Awwwards (24/10 a 24/11/2026) e dos modelos da Profitize (Kairo, Traço, Margem, Sopro, Blip, Linno, Bilda e outros). A marca, a voz, as páginas, o Sobre e o sotaque continuam como estavam.

## A ideia

- **Em uma frase:** a página **se constrói na frente de quem a visita**, feita por **dois cursores, "design" e "código"**, que no fim se fundem em uma barrinha carmim só: uma pessoa só. O site de quem faz sites não conta o processo: ele acontece na tela.
- **A régua:** cada seção tem um gesto; seção parada ainda não está pronta. E o cursor é parte da cena: o mouse do visitante também reage.
- **Eixo:** o processo (do bruto ao pronto). **A frase da peça:** "Uma conversa… vira protótipo… vira código… passa nos testes… e vai ao ar."
- **Os quatro atos:** o antes (a página vazia que dois cursores começam a desenhar) → o processo (a peça de camadas em 3D) → a virada (a luz acende, os cursores se fundem, o palco escurece) → o depois (serviços, projetos, combinado, o rosto, o convite).
- **De onde vem cada coisa:** o motor dos dois cursores vem do **Kairo** (o site que se monta com um enxame de cursores); a pilha de camadas em 3D, do **Bilda**; a roda de projetos, do **Works Wheel** e do **Margem**; o nome gigante que se desenha e enche, do **Traço**; o HUD com dados reais, do **Carter Ogunsola**; o rosto na frente do nome, do **Linno**. Nada é copiado: é a mecânica, escrita para a marca da codimdev.

## Os quatro atos

1. **O antes:** prancheta clara com grade; o símbolo no centro. O carregador termina e os dois cursores entram pelas bordas. "design" desenha o contorno do nome gigante e a caixa de cada bloco; "código" enche o nome de baixo para cima, escreve o título e faz o Zacarias subir de um desfoque na frente do nome.
2. **O processo:** a peça principal. Cinco **placas** (camadas) de uma janela de navegador se empilham em 3D, uma por etapa, e a rolagem passeia a câmera por elas.
3. **A virada:** as placas se achatam numa janela só, os dois cursores se fundem em uma barrinha carmim ("uma pessoa só") e o palco escurece. É o único momento escuro.
4. **O depois:** serviços, projetos numa roda 3D, o combinado, o rosto e o convite. Tudo isso também é construído pelos cursores quando chega à tela.

## O motor: dois cursores

- **Quem são:** dois cursores de editor multiplayer, com etiqueta em mono. `design` em grafite suave, `código` em grafite. Nada de cores extras: o carmim fica para a linha-guia e para a fusão final.
- **O que cada um faz:**
  - `design` desenha: a **caixa de seleção** (fio grafite de 1 px com quatro alças e a medida ao vivo, "420 × 24") e depois o **esboço** do bloco (tracejado cinza).
  - `código` preenche: **digita** o texto, **acende** o título letra a letra, **revela** a foto (de preto e branco para a cor) e liga as interações.
  - Os dois se encontram em um bloco: primeiro `design`, depois `código`. Quem termina vai para o próximo.
- **Duplicar:** nas listas (cartões de serviço, regras do combinado, projetos), só o primeiro item nasce do zero; os outros saem de uma **cópia que `código` arrasta**, com o cursor de copiar, até a vaga, e o conteúdo é trocado.
- **Ajustar:** alguns blocos nascem deslocados e `design` os arrasta até encaixar, com a **linha-guia em carmim** (o único carmim do motor, fino e curto).
- **Quando:** cada seção começa a ser construída quando o topo dela passa de 62% da tela. Quem rola rápido vê tudo fechar na hora; nenhum cursor volta para cima atrás do que ninguém vê.
- **O fim:** com o convite na tela, os dois cursores caminham até o centro e **se fundem numa barrinha carmim**, cuja etiqueta troca para "uma pessoa só". Em computador, essa barrinha passa a seguir o mouse do visitante, discreta, como cursor da página.
- **Segurança:** `?pronto` na URL, movimento reduzido ou sem JavaScript abrem a página **já montada**. O conteúdo é HTML de verdade desde o começo (SEO, leitor de tela).

## O HUD, o Tour e os extras

- **HUD no pé da página (dados reais, nunca inventados):** `carregou em 0,9 s` (LCP medido na hora) · `60 fps` (média dos últimos 2 s) · `JS 38 KB` (soma do que veio) · `2 cursores · 1 pessoa` · `37/37 camadas` com uma barra de progresso. À direita: **Tour** (rola sozinho, parando em cada seção até ela ser construída), `1×` `2×`, **montar de novo**. É a prova do argumento de venda: site rápido, medido ali. Se o navegador não mede algo, mostra "—".
- **Seleção ao passar o mouse:** todo clicável ganha a seleção do editor (fio grafite com as quatro alças) no hover e no foco: é a linguagem da página.
- **Tema claro e escuro:** um botão no cabeçalho troca os tokens (os escuros já existem na marca) com um círculo que se abre do ponto do clique.
- **Paleta de comandos (⌘K ou Ctrl K):** "Ir para…" com as páginas e as ações (mudar tema, fazer o tour, montar de novo, chamar no WhatsApp).
- **Transição entre páginas:** uma máscara que corta a tela (200 ms).
- **404 desenhado:** a janela em traços com um pedaço faltando.

## A peça principal: a pilha de camadas

- **Linguagem:** **placas em 3D** (CSS 3D, sem WebGL): cinco placas de uma janela de navegador, empilhadas ao longo do eixo Z em vista isométrica, uma por etapa. A câmera (a perspectiva do conjunto) gira e sobe com a rolagem. Cada placa é o desenho em SVG que já existe (conversa, protótipo, código, testes, no ar), agora com profundidade.
- **Presa por 5 telas** (4 no celular). Abertura (6%): a primeira placa se firma. Respiro final (4%): as placas se achatam.
- **Etapas:**

| Etapa | Rótulo         | Parte da frase       | O que se vê                                                                                                   | Fato real                                                           |
| ----- | -------------- | -------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1     | 01 · Conversa  | "Uma conversa…"      | A primeira placa entra: balões em traço e a folha de proposta; `código` escreve "Escopo", "Prazo", "Preço".   | Proposta por escrito antes de começar; nada começa sem aceite.      |
| 2     | 02 · Protótipo | "…vira protótipo…"   | A segunda placa sobe e se encaixa por cima: o wireframe tracejado; `design` clica nas abas e as telas trocam. | Você clica nas telas antes de qualquer código. 2 rodadas de ajuste. |
| 3     | 03 · Código    | "…vira código…"      | A terceira placa: a página ganha corpo e o painel de código se escreve (`código` digita).                     | Design e código pela mesma pessoa, sem ruído entre etapas.          |
| 4     | 04 · Testes    | "…passa nos testes…" | A quarta placa vira celular; três testes passam, um de cada vez.                                              | Versão de celular, velocidade e formulários testados.               |
| 5     | 05 · No ar     | "…e vai ao ar."      | A quinta placa: a barra de endereço escreve o domínio e a luz de status pulsa.                                | Guia curto de uso e 15 dias para pequenos ajustes `[confirmar]`.    |

- **A virada:** nos últimos 4%, as cinco placas descem e se achatam numa janela só; a câmera fica de frente; o palco escurece; os dois cursores se fundem.
- **Material:** nenhum (SVG e CSS 3D). A etiqueta "Ilustração" fica no canto.

## O roteiro cena a cena

### 0 — Carregador · ato 1

- **Gesto:** o símbolo da logo é desenhado em traço fino conforme os bytes chegam (progresso real); em 100% a barrinha carmim risca o símbolo e trava; a tela sobe. Contador em mono: "JÁ JÁ · 64%". _Sotaque: "já já"._
- **Passagem:** os dois cursores entram pelas bordas, rodeiam o símbolo e se espalham.

### 1 — Abertura · ato 1 (o hero)

- **Gesto:** o **nome gigante** (a logo horizontal oficial, de borda a borda no pé do hero) é desenhado em **contorno** por `design` e **enche de baixo para cima** por `código`. O **Zacarias recortado** sobe de um desfoque na frente do nome, grande (cerca de 78% da altura da tela), e reage ao mouse: leve profundidade, a foto se desloca poucos pixels e o nome atrás, um pouco menos. O título é **escrito** por `código`.
- **Texto:** título "Seu site deveria vender. Não só existir." (**vender** em carmim) · apoio "Landing pages, sites e sistemas web para empresas. Eu desenho e programo a mesma peça, do protótipo ao site no ar." · botões "Pedir orçamento" e "Ver projetos" · nota "Orçamento pelo WhatsApp · resposta em até 24 horas úteis" · legenda da foto "Zacarias, desenvolvedor e designer".
- **Passagem:** os cursores descem com a rolagem para a próxima frase.

### 2 — O que escapa · ato 1

- **Gesto:** três frases do dono; `design` **risca** a parte que falha com o traço carmim, e `código` escurece a frase. (Mesmo gesto de antes, agora feito pelos cursores.)
- **Texto:** "Seu anúncio paga o clique. Sua página perde o lead." · "Seu formulário está espantando cliente." · "Planilha não é sistema de gestão." · apoio "Eu começo pelo que está custando venda, não pelo que é bonito."

### 3 — Do briefing ao site no ar · ato 2 (a peça principal)

- Como descrito em "A peça principal": cinco placas em 3D, presa por 5 telas. Título "Uma conversa vira protótipo, vira código e vai ao ar." (**ar** em carmim).
- **Celular:** a pilha vira vertical, em 4 telas; o texto da etapa fica logo abaixo, legível.

### 4 — No ar · ato 3

- **Gesto:** as placas se achatam, o palco escurece (a única cena escura) e **os dois cursores se fundem** numa barrinha carmim. A etiqueta vira "uma pessoa só".
- **Texto:** título "Pronto. Agora o site trabalha para você." _(sotaque: pronto)_ · apoio "Cada tela existe para vender, informar ou poupar tempo."

### 5 — Serviços · ato 4

- **Gesto:** cinco cartões construídos pelos cursores (caixa → esboço → conteúdo); cada um desenha em traço a miniatura do que entrega. Hover: a seleção do editor.
- **Texto:** como antes ("Cinco serviços. Uma pessoa só.", os cinco cartões e "Escopo, prazo e preço por escrito antes de começar.").

### 6 — Projetos · ato 4

- **Gesto:** os três projetos autorais numa **roda 3D** (um tambor de cartões que gira com a rolagem; cada giro traz o próximo para a frente). Passar o mouse num cartão mostra o nome; clicar abre a página do projeto. Cada cartão é uma tela do projeto em modo escuro, com a etiqueta "Autoral".
- **Texto:** título "Projetos autorais, chamados de autorais." · apoio "Fiz estes projetos para mostrar como eu trabalho. O primeiro cliente entra aqui." `[confirmar o tom]`.
- **Material:** prints do Kraflo CMMS, do Kraflo OS Bot e do Tenua (veja "Material").

### 7 — O combinado · ato 4

- **Gesto:** as cinco regras são duplicadas por `código` (cada uma sai de uma cópia arrastada) e `design` as marca com a barrinha; no fim, "assina" a última linha.
- **Texto:** "O combinado fica por escrito." e as cinco regras de sempre.

### 8 — Quem faz · ato 4

- **Gesto:** o recorte do Zacarias com cotas de desenho técnico em traço ("design" de um lado, "código" do outro, a barrinha no meio). Os dois cursores aparecem uma última vez, um de cada lado das cotas.
- **Texto:** "Design e código pela mesma pessoa." · apoio "Não tem agência no meio. Você fala comigo do primeiro contato até o site no ar." · legenda "Zacarias, desenvolvedor e designer · de Guadalupe, PI, em Blumenau, SC".

### 9 — Convite final · ato 4 (faixa grafite)

- **Gesto:** a faixa grafite com o botão carmim; a barrinha carmim (já fundida) acende a luz de status. Formulário curto de três campos.
- **Texto:** "Vamos ver o que um site resolve no seu caso?" · "Escopo, prazo e preço por escrito antes de começar. Pode chamar sem se avexar." · "Chamar no WhatsApp".

### 10 — Rodapé · ato 4

- **Gesto:** o **nome gigante** de borda a borda, que se **desenha em contorno e enche de baixo para cima ligado à rolagem** (fecha o que o hero abriu). Embaixo, as colunas de links, o contato e, sozinha, "feito por um piauiense". A linha carmim com a barrinha fecha a página.

### 404 — extra

- **Gesto:** a janela em traços com um pedaço faltando; o cursor `código` chega e fecha o traço.
- **Texto:** "Eita. Essa página não está no ar." · botão "Voltar ao início".

**Teste dos títulos em ordem:** Seu site deveria vender. Não só existir. → Seu anúncio paga o clique. Sua página perde o lead. → Uma conversa vira protótipo, vira código e vai ao ar. → Pronto. Agora o site trabalha para você. → Cinco serviços. Uma pessoa só. → Projetos autorais, chamados de autorais. → O combinado fica por escrito. → Design e código pela mesma pessoa. → Vamos ver o que um site resolve no seu caso?

## O site tem várias páginas

A página inicial é o **trailer**: conta a história e leva a cada página. Cada página tem a sua própria função, o mesmo traço e a mesma barra de quatro colunas em mono no topo.

| Página           | Rota                                                                                                                 | Para quê                                                                                                                | Versão          |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------- |
| Início           | `/`                                                                                                                  | Contar a história (as cenas acima) e levar ao orçamento                                                                 | 1               |
| Serviços         | `/servicos`                                                                                                          | Os cinco serviços, cada um com a sua miniatura em traço                                                                 | 1               |
| Cada serviço (5) | `/servicos/landing-page`, `/site-institucional`, `/redesign-e-conversao`, `/interfaces-e-sistemas`, `/design-system` | O problema, o que eu entrego, para quem é, perguntas comuns, pedido de orçamento. Cada uma responde uma busca no Google | 1               |
| Projetos         | `/projetos`                                                                                                          | Índice numerado e cartões, todos com a etiqueta "Autoral"                                                               | 1               |
| Cada projeto     | `/projetos/[nome]`                                                                                                   | O problema, o que eu fiz, as ferramentas e o link                                                                       | 1 (3 primeiros) |
| Como funciona    | `/como-funciona`                                                                                                     | As seis etapas completas, o combinado e as perguntas de pagamento, revisão e domínio                                    | 1               |
| Sobre            | `/sobre`                                                                                                             | Quem faz e de onde veio (seção abaixo)                                                                                  | 1               |
| Orçamento        | `/orcamento`                                                                                                         | Formulário curto, WhatsApp e e-mail, e o que acontece depois                                                            | 1               |
| Privacidade      | `/privacidade`                                                                                                       | O que eu faço com os dados do formulário (LGPD)                                                                         | 1               |
| 404              | (qualquer rota errada)                                                                                               | "Eita. Essa página não está no ar."                                                                                     | 1               |
| Notas            | `/notas`                                                                                                             | Artigos que ensinam, o mesmo pilar "ensinar" do Instagram                                                               | 2               |

- **Menu:** `[ Serviços ]  [ Projetos ]  [ Como funciona ]  [ Sobre ]` e o botão "Pedir orçamento" (limite de quatro links do Design System).
- **Gesto de cada página:** Serviços e cada serviço, a miniatura se desenha em traço ao entrar. Projetos, a prévia acende no índice. Como funciona, as etapas se riscam em sequência. Sobre, a trajetória vira uma linha com cotas. Orçamento, o formulário "fecha o traço" ao enviar. Entre páginas, a barrinha cruza a tela como transição curta.

## A página Sobre

**Eixo:** a trajetória como obra, do chão de fábrica ao código. A frase: "Da obra… à fábrica… ao código… ao seu site."

- **O que entra:** a origem (Guadalupe, no Piauí), mais de dez anos de obra e fábrica em vários estados, a formação, os projetos autorais e as ferramentas.
- **O que fica de fora, de propósito:** o emprego atual (empresa, cargo, "CLT"), as horas livres, o nome "Lino Estúdio" e os contatos pessoais do currículo (telefone, e-mail, endereço).

### S1 — Abertura

- **Gesto:** o recorte do Zacarias sobre algodão; a barrinha-cursor escreve o título.
- **Texto:** título "Eu sou o Zacarias. Desenho e programo a mesma peça." · apoio "Sou de Guadalupe, no Piauí, e moro em Blumenau, Santa Catarina." · legenda "Zacarias, desenvolvedor e designer".
- **Passagem:** a barrinha desce e vira o primeiro ponto da linha do tempo.

### S2 — De onde eu vim

- **Gesto:** linha do tempo desenhada como planta, com cotas em mono. Cada parada acende ao entrar: Guadalupe, PI → Curitiba, PR → Ipojuca, PE → Pecém, CE → Guarulhos, SP → Pomerode, SC → Ribas do Rio Pardo, MS.
- **Texto:** título "Do Piauí para a obra." · apoio "Passei mais de dez anos montando e consertando máquina em siderúrgica, refinaria, fábrica de papel e de tecido, do Nordeste ao Sul." (de 2011 em diante, só cidades, sem empresas)
- **Números:** "mais de dez anos" (do currículo).
- **Passagem:** a linha chega ao ponto "2023" e a barrinha vira cursor.

### S3 — O que a fábrica me ensinou

- **Gesto:** três frases, cada uma marcada por uma barrinha. `[confirmar o tom, está na sua voz]`
- **Texto:** título "Fábrica ensina o que site também precisa." · "Máquina parada custa dinheiro. Eu começo pelo que está custando venda." · "Quem usa a tela está de pé e com pressa. Eu desenho para esse dono." · "Combinado é combinado. Escopo, prazo e preço por escrito."
- **Passagem:** a barrinha atravessa para a formação.

### S4 — Como eu virei dev

- **Gesto:** três cartões em trama que se firmam, em ordem: formação, estudo, projetos.
- **Texto:** título "Comecei pela peleja que eu conhecia." · "Técnico em Mecânica." · "Engenharia de Software, em andamento, na Unicesumar." · "Projetos autorais: um sistema de manutenção para equipes de fábrica (Kraflo CMMS), um bot de ordens de serviço (Kraflo OS Bot) e um site de portfólio (Tenua), com links para o GitHub."
- **Números:** nenhum além dos nomes. "Autoral" em todos.
- **Passagem:** os cartões descem até a linha de ferramentas.

### S5 — Como eu trabalho

- **Gesto:** a janela em traços da peça principal, pequena, repete as cinco etapas em uma linha; abaixo, uma linha em mono com as ferramentas (só aqui, para quem é de tecnologia): React, Next.js, TypeScript, Tailwind, Supabase, Python, Figma.
- **Texto:** título "Protótipo antes do código." · apoio "Você vê e clica nas telas antes de pagar a segunda parte." · link "Ver como funciona" leva a `/como-funciona`.
- **Passagem:** a linha de ferramentas vira o fio da faixa final.

### S5b — Fora do código

- **Gesto:** faixa em trama com duas etiquetas em mono, cada uma com a barrinha: `TIME · Corinthians` e `ORIGEM · Nordeste, com orgulho`.
- **Texto:** "Sou corinthiano e nordestino com orgulho." Só texto: nenhum escudo, cor de time ou logo do clube.

### S6 — Convite

- **Gesto:** faixa grafite com o botão carmim, igual à da página inicial.
- **Texto:** título "Vamos conversar sobre o seu projeto?" · apoio "Se ficou alguma dúvida, me chama que a gente se entende, visse?" · botão "Chamar no WhatsApp".
- **Passagem:** rodapé.

## O sotaque do Piauí

**Princípio:** sotaque de ritmo e de vocabulário, nunca de ortografia. Nada de "mermão", "num sei" ou frase escrita como se fala. Ele aparece nas margens, **no máximo um por cena**, e some onde há dinheiro, prazo ou lei: serviços, proposta, combinado, formulário, mensagem de erro e privacidade. A voz continua a do artesão, calma e sem exclamação; o sotaque é a pessoa por trás dela, não uma fantasia. **Você é a régua: eu sugiro, você corta o que não soar como o seu falar de Guadalupe.**

| Onde                      | Texto                                                         | Palavra                      |
| ------------------------- | ------------------------------------------------------------- | ---------------------------- |
| Carregador                | "Já já · 64%"                                                 | já já                        |
| Virada (cena 4)           | "Pronto. Agora o site trabalha para você."                    | pronto, como fecho           |
| Convite final (cena 9)    | "…antes de começar. Pode chamar sem se avexar."               | sem se avexar                |
| Quem faz (cena 8), rodapé | "de Guadalupe, PI" · "feito por um piauiense em Blumenau, SC" | a origem, sem palavra        |
| Sobre, S4                 | "Comecei pela peleja que eu conhecia."                        | peleja                       |
| Sobre, S6                 | "…me chama que a gente se entende, visse?"                    | visse (uma vez no site todo) |
| 404                       | "Eita. Essa página não está no ar."                           | eita                         |

- **Banco de palavras (dose baixa):** já já, pronto, peleja, sem se avexar, eita, visse, oxente (só no 404, se preferir no lugar de "eita").
- **Evitar:** "arretado" e "pense num…" (soam forçados para quem contrata empresa), "égua" (não é do Piauí), "vixe", "cabra da peste", escrita fonética e qualquer estereótipo (seca, jegue, cangaço).
- **Fora do site:** o mesmo vale para legendas do Instagram e respostas do WhatsApp, só no tom, nunca no fechamento de proposta.

## Direção visual

- **Paleta** (tokens do Design System; tema claro por padrão e **tema escuro disponível** pelo botão): algodão `#F5F4EF` (fundo) · trama `#E9E7E0` (cartões, janelas, placas) · cru `#DEDCD4` · linha `#D6D4CC` (fios e grade) · grafite `#18191D` (texto, cursores, a cena escura) · grafite suave `#5C5D63` (legendas, cursor `design`) · carmim `#C42A1F` (botão principal, uma palavra por título, linha-guia, a barrinha fundida). Escuro: `#141518` / `#1E1F23` / `#F2F1EC` / carmim `#EC5A4D`. Nada de branco puro nem de preto puro nos fundos.
- **Fontes** (arquivo local): IBM Plex Sans 600 e 400 · Inter 400 e 500 · IBM Plex Mono 400.
- **Tipografia como imagem:** o nome gigante (a logo oficial, de borda a borda), títulos de seção de 36 a 64 px, e rótulos em mono. A logo **não é redesenhada**: só aumentada, proporcional.
- **Tom e sotaque:** como antes (o artesão; sotaque sutil e raro).
- **Textura:** grade fina de 24 px, barra de quatro colunas em mono, cantos de 4 px, a única sombra na janela do produto e nas placas. Sem gradiente, brilho ou pílula. Carmim nunca como fundo de seção.
- **Movimento:** cursores com curva suave; traço que se desenha; letras que acendem; **CSS 3D** nas placas e na roda (sem WebGL na primeira versão; um efeito de lente na foto do hero pode vir depois); entradas por tempo (`expo.out`); uma suavização só (Lenis).

## Material

| Item                                                                | Para qual cena                            | Caminho                                     | Observação                                                                 |
| ------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------- |
| Logo e símbolo (SVG)                                                | carregador, nome gigante, rodapé, favicon | já existe (`src/lib/marca/logo.ts`)         | não redesenhar                                                             |
| Recorte do Zacarias (840 × 1050, fundo transparente)                | hero, quem faz, Sobre                     | já existe (`public/img/zacarias.webp`)      | **sem filtro, sombra ou gradiente**                                        |
| Outras 4 fotos do Zacarias                                          | Sobre, quem faz                           | `imagens/zacarias/` do repositório da marca | `[enviar]`; sem elas, usa-se o mesmo recorte                               |
| Prints do Kraflo CMMS, Kraflo OS Bot e Tenua, em modo escuro, 16:10 | roda de projetos e páginas de projeto     | `[enviar]`                                  | sem eles, cada cartão mostra a miniatura em traço do produto (já prevista) |
| Placas em 3D, cursores, HUD, ⌘K, tema                               | peça e página inteira                     | código                                      | nenhum material                                                            |
| Arquivos de fonte                                                   | todas                                     | `npm run fontes`                            | já existem                                                                 |

## [preencher]

- Os **15 dias** de ajuste depois da entrega: confirmar.
- **Prints** dos três projetos e as **fotos** extras do Zacarias (acima).
- **Medição de visitas:** decidir se entra (e então atualizar `/privacidade`). O HUD mede só no navegador do visitante e não envia nada.
- **CNPJ ou MEI** na página de privacidade, quando existir.
- O que está incluso em "SEO básico" e "pronta para medir" (páginas de serviço).
- Depoimento: nenhum por enquanto; a seção não entra.

## Decisões confirmadas

- Todas as páginas do mapa entram na primeira versão, exceto Notas (versão 2).
- WhatsApp `5547996496281`; e-mail `contato@codimdev.com.br`; Instagram `@codimdev`. Domínio `codimdev.com.br` (já na Hostinger).
- Projetos: Kraflo CMMS, Kraflo OS Bot e Tenua. Sobre com "corinthiano e nordestino com orgulho". "Ainda sem clientes pagantes" pode ir ao ar.
- Rodapé: só "feito por um piauiense" na linha final.
- **Direção 2 (esta versão):** dois cursores que constroem a página, hero com o nome gigante e o Zacarias na frente, HUD com dados reais, placas em 3D, roda de projetos, tema, ⌘K.

## Decisões em aberto

- **O motor dos cursores:** escrito do zero (recomendado: 2 cursores, repositório pode ficar público) ou o motor do Kairo adaptado (exige repositório **privado** e chave SSH na Hostinger, pela licença do modelo).
