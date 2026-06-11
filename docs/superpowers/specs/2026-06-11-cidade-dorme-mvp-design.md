# Cidade Dorme Multiplayer MVP Design

## Objetivo

Criar um MVP web multiplayer inspirado em Cidade Dorme/Mafia/Werewolf para amigos criarem ou entrarem em uma sala, escolherem nome e avatar, receberem cargos aleatorios e jogarem rodadas com fases sincronizadas em tempo real.

O MVP prioriza fluxo jogavel, separacao clara de responsabilidades e base expansivel. Persistencia em banco fica fora do MVP inicial; o estado das salas e partidas fica em memoria no backend.

## Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, Zustand, Socket.IO Client.
- Backend: Node.js, Fastify, Socket.IO, TypeScript.
- Persistencia: memoria no servidor durante o MVP.
- Banco futuro: PostgreSQL ou Supabase quando houver necessidade de historico, contas ou salas persistentes.

## Arquitetura

O projeto sera um monorepo simples com dois processos:

- `src/`: aplicacao Next.js com paginas, componentes, features e socket client.
- `server/`: servidor Fastify + Socket.IO com salas, partidas, timers e regras autoritativas.

O cliente renderiza estado e envia intencoes. O servidor valida acoes, avanca fases, resolve mortes, calcula vitoria e emite eventos. Componentes React nao devem conter regras centrais do jogo. O servidor tambem e responsavel por filtrar informacoes sensiveis antes de emitir estado publico.

## Estrutura De Pastas

```txt
src/
  app/
    page.tsx
    lobby/page.tsx
    room/[roomId]/page.tsx
    game/[roomId]/page.tsx
  components/
    ui/
    lobby/
    game/
    chat/
    voting/
    character/
  features/
    lobby/
      components/
      hooks/
      services/
      types.ts
    game/
      components/
      hooks/
      services/
      game-machine.ts
      roles.ts
      rules.ts
      types.ts
    chat/
      components/
      hooks/
      types.ts
  lib/
    socket.ts
    utils.ts
  styles/
    globals.css

server/
  src/
    index.ts
    socket/
      events.ts
      handlers.ts
    rooms/
      room-service.ts
      room-types.ts
    game/
      game-service.ts
      game-machine.ts
      roles.ts
      rules.ts
      game-types.ts
    chat/
      chat-service.ts
    utils/
      ids.ts
```

Arquivos de regra podem existir no frontend para tipagem e apresentacao, mas a versao autoritativa fica no servidor. Quando necessario, tipos e constantes podem ser movidos depois para um pacote compartilhado. O frontend so recebe o proprio cargo durante a partida; cargos dos outros jogadores aparecem apenas no fim do jogo.

## Modelo Visual

O tema sera escuro, misterioso e divertido, inspirado em jogo de cartas. A UI principal usa cartas para representar jogadores, cargos, alvos e votos.

Elementos visuais principais:

- Mesa escura com cartas em leque ou grade responsiva.
- Cartas com imagem placeholder substituivel pelo usuario no futuro.
- Bordas, brilho e sombra diferentes por estado: vivo, morto, selecionavel, selecionado, host, votou.
- Animacoes com Framer Motion para entrada de cartas, revelacao de cargo, troca de fase e eliminacao.
- Layout responsivo: cartas menores e rolagem horizontal/grade compacta em celular.

Durante a noite, a tela muda para um modo cinematico escuro, inicialmente preto ou quase preto. O texto central informa a acao atual, por exemplo: "O assassino acorda". Quando o jogador atual pode agir, os alvos aparecem como cartas flutuantes selecionaveis. Assassino escolhe vitima, medico escolhe protecao e detetive escolhe um palpite de quem e assassino.

## Fluxo De Produto

### Tela Inicial

O jogador informa nome, escolhe avatar/aparencia e pode criar sala ou entrar com codigo. A criacao da sala torna esse jogador host.

### Lobby

Mostra jogadores conectados como cartas, indicando host. O host ve o botao de iniciar jogo. O jogo exige minimo de 4 jogadores. Todos podem sair da sala.

### Revelacao De Cargos

Quando o host inicia, o servidor sorteia cargos automaticamente. Cada jogador recebe seu cargo via evento privado. A tela mostra uma carta de cargo com animacao de revelacao. Nenhum jogador recebe o cargo dos outros nessa fase. O "Narrador/Sistema" nao e um cargo sorteado para jogador no MVP; ele aparece como texto/estado da interface para conduzir fases.

### Jogo Principal

A tela mostra fase atual, timer sincronizado, lista de vivos e mortos, chat, painel de acao ou votacao e historico curto da rodada.

### Noite

O servidor conduz as acoes noturnas. No MVP, todas as acoes especiais podem ser coletadas durante a fase `NIGHT`, com UI filtrada por cargo:

- Assassino escolhe um jogador vivo para eliminar.
- Medico escolhe um jogador vivo para proteger.
- Detetive escolhe um jogador vivo como palpite de assassino e recebe apenas "acertou" ou "errou".
- Cidadao ve mensagem de espera.
- Mentiroso ve mensagem de espera e tenta ser eliminado na votacao.

O servidor resolve as acoes ao fim da noite. Se a vitima do assassino foi protegida pelo medico, ninguem morre. O detetive recebe resultado privado informando apenas se o palpite dele estava certo ou errado; ele nao recebe o cargo exato do alvo. Se acertar, ainda precisa convencer a cidade e tentar eliminar o assassino na votacao.

Ao amanhecer, a fase seguinte deve deixar claro quem morreu durante a noite. Se ninguem morreu, a interface informa que a cidade acordou sem vitimas. Essa revelacao aparece no inicio do dia/resolucao com destaque visual em forma de carta eliminada.

### Dia E Discussao

Todos os jogadores vivos podem conversar durante dia/discussao. Mortos podem assistir, mas nao interferem. Jogadores vivos podem clicar em pular. Se todos pularem, o timer termina e a fase avanca.

### Votacao

Jogadores vivos votam em outro jogador vivo. A UI mostra quem ja votou sem revelar necessariamente em quem votou. Se todos votarem, o timer termina. O jogador mais votado e eliminado. Empate no MVP resulta em nenhuma eliminacao por votacao. Se o eliminado por votacao for o Mentiroso, o jogo acaba imediatamente com vitoria solo dele.

### Resolucao

Mostra animacao e resumo: morte da noite, eliminacao por voto e efeitos relevantes. O servidor atualiza vivos/mortos e verifica vitoria. A morte da noite deve aparecer explicitamente assim que a cidade acorda, antes ou junto do resumo de resolucao.

### Fim De Jogo

Mostra grupo vencedor, revela todos os cargos e oferece botao para jogar novamente. Jogar novamente reutiliza sala e jogadores conectados, resetando cargos e estado.

## Maquina De Estados

Estados:

- `LOBBY`
- `REVEAL_ROLES`
- `NIGHT`
- `DAY_DISCUSSION`
- `VOTING`
- `RESOLUTION`
- `GAME_OVER`

Duracoes iniciais:

- `REVEAL_ROLES`: 10 segundos.
- `NIGHT`: 45 segundos.
- `DAY_DISCUSSION`: 90 segundos.
- `VOTING`: 45 segundos.
- `RESOLUTION`: 10 segundos.

Cada fase define acoes permitidas, quem pode agir, condicao de avanco e eventos emitidos. O timer roda no servidor e emite atualizacoes regulares para os clientes.

## Regras Do MVP

- Minimo de 4 jogadores para iniciar.
- Apenas host pode iniciar.
- Cargos sao sorteados automaticamente.
- Cada jogador ve apenas o proprio cargo ate o fim do jogo.
- Mortos nao votam, nao pulam e nao fazem acoes noturnas.
- Mortos podem assistir ao jogo.
- Se todos os vivos votarem, a votacao termina.
- Se todos os vivos pularem a discussao, a discussao termina.
- Cidadaos vencem quando todos os assassinos forem eliminados.
- Assassinos vencem quando estiverem em quantidade maior ou igual aos nao-assassinos vivos.
- Mentiroso vence sozinho se for eliminado por votacao.
- A vitoria do Mentiroso por votacao tem prioridade sobre as outras condicoes na mesma resolucao.
- Se o Mentiroso morrer durante a noite, ele nao vence e passa a assistir como morto.

Distribuicao inicial de cargos:

- 4 jogadores: 1 assassino, 1 detetive, 1 medico, 1 cidadao.
- 5 a 6 jogadores: 1 assassino, 1 detetive, 1 medico, 1 mentiroso, restante cidadaos.
- 7 ou mais jogadores: 2 assassinos, 1 detetive, 1 medico, 1 mentiroso, restante cidadaos.

## Eventos Socket.IO

Cliente para servidor:

- `room:create`
- `room:join`
- `player:updateAvatar`
- `player:leave`
- `game:start`
- `game:nightAction`
- `game:vote`
- `game:skip`
- `chat:message`

Servidor para cliente:

- `room:updated`
- `game:started`
- `game:roleAssigned`
- `game:phaseChanged`
- `game:timerUpdated`
- `game:playerEliminated`
- `game:voteUpdated`
- `game:ended`
- `chat:messageReceived`
- `error`

Eventos que revelam informacao sensivel devem ser emitidos somente para o socket correto. `game:roleAssigned` e resultado do detetive sao privados.

## Tipos Principais

```ts
type Player = {
  id: string
  name: string
  avatar: string
  role?: RoleId
  isAlive: boolean
  isHost: boolean
  socketId: string
}

type PublicPlayer = Omit<Player, 'role' | 'socketId'> & {
  role?: RoleId
}

type Room = {
  id: string
  code: string
  hostId: string
  players: Player[]
  status: 'lobby' | 'playing' | 'finished'
  createdAt: string
}

type GameState = {
  roomId: string
  phase: GamePhase
  players: PublicPlayer[]
  round: number
  timer: number
  votes: Record<string, string>
  nightActions: NightAction[]
  winner?: 'citizens' | 'assassins' | 'liar'
}

type Role = {
  id: RoleId
  name: string
  description: string
  team: 'citizens' | 'assassins' | 'solo'
  actionType: 'kill' | 'protect' | 'guess-assassin' | 'none'
}
```

Em estado publico, `PublicPlayer.role` so e preenchido em `GAME_OVER`. Antes disso, cada cliente guarda o proprio cargo separadamente a partir do evento privado `game:roleAssigned`.

## Componentes Principais

- `PlayerCard`: carta de jogador com avatar, nome, status e estados visuais.
- `AvatarSelector`: seletor inicial de aparencia.
- `RoomCodeBox`: codigo da sala com botao de copiar.
- `GameTimer`: timer sincronizado.
- `PhaseBanner`: banner animado de fase.
- `ChatBox`: mensagens e input controlado por permissao.
- `VotePanel`: cartas votaveis e status de quem votou.
- `RoleRevealCard`: carta animada de cargo.
- `NightActionPanel`: tela escura com alvos flutuantes.
- `GameResultModal`: fim de jogo e revelacao de cargos.
- `PlayerList`: vivos e mortos.
- `SkipButton`: pular discussao.

## Estado Local Do Frontend

Zustand armazenara dados locais e derivados de UI:

- jogador local e sala atual;
- cargo proprio;
- estado publico da sala e partida;
- mensagens de chat;
- conexao do socket;
- selecoes temporarias de voto ou acao.

O estado local nao decide resultados do jogo. Resultados sempre chegam do servidor.

## Backend Em Memoria

O backend mantem um mapa de salas em memoria. Cada sala contem jogadores, socket ids, estado da partida, timer ativo e mensagens recentes. Ao reiniciar o servidor, todas as salas somem.

Responsabilidades do backend:

- criar e entrar em salas;
- atualizar host quando necessario;
- remover/desconectar jogadores;
- validar minimo de jogadores;
- sortear cargos;
- emitir cargos privados;
- controlar fases e timers;
- validar acoes por cargo e vida;
- resolver noite, votacao e vitoria;
- transmitir chat permitido.

## Tratamento De Erros

Erros de regra retornam pelo evento `error` com mensagem amigavel, por exemplo:

- sala nao encontrada;
- nome invalido;
- sala cheia, se limite for definido depois;
- apenas host pode iniciar;
- minimo de jogadores nao atingido;
- acao indisponivel para o cargo ou fase;
- jogador morto nao pode agir.

No frontend, erros aparecem como toast ou alerta discreto.

## Testes E Verificacao

O MVP deve ter testes unitarios para regras puras:

- distribuicao de cargos;
- condicao de vitoria;
- prioridade de vitoria do Mentiroso quando eliminado por votacao;
- resolucao de noite;
- palpite do Detetive retornando apenas acerto ou erro;
- resolucao de votos;
- permissao de acoes por fase/cargo.

Tambem deve haver verificacao manual do fluxo multiplayer com duas ou mais abas: criar sala, entrar, iniciar, revelar cargos, conversar, agir, votar e encerrar jogo.

## Fora Do Escopo Inicial

- Banco de dados e persistencia entre reinicios.
- Autenticacao de usuarios.
- Redis ou escalabilidade multi-instancia.
- Imagens finais das cartas.
- Chat de mortos separado.
- Narrador humano.
- Regras avancadas de empate ou cargos adicionais.

## Configuracao Esperada

O usuario precisara rodar dois processos locais ou um script combinado:

- servidor Socket.IO/Fastify em uma porta, por exemplo `4000`;
- Next.js em outra porta, por exemplo `3000`;
- variavel `NEXT_PUBLIC_SOCKET_URL` apontando para o backend.

Nenhuma aplicacao externa precisa ser configurada no MVP em memoria.
