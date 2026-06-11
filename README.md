# Cidade Dorme

MVP web multiplayer inspirado em Cidade Dorme/Mafia/Werewolf.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Framer Motion
- Zustand
- Fastify + Socket.IO
- Estado das salas em memoria

## Configuracao

```bash
npm install
cp .env.example .env.local
npm run dev
```

O comando `npm run dev` sobe dois processos:

- Frontend: `http://localhost:3000`
- Backend Socket.IO/Fastify: `http://localhost:4000`

Variaveis principais:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
SERVER_PORT=4000
CLIENT_ORIGIN=http://localhost:3000
```

## Scripts

- `npm run dev`: roda frontend e backend juntos.
- `npm run dev:web`: roda apenas Next.js.
- `npm run dev:server`: roda apenas Fastify + Socket.IO.
- `npm test`: roda testes unitarios das regras.
- `npm run typecheck`: valida TypeScript do frontend.
- `npm run server:typecheck`: valida TypeScript do backend.
- `npm run lint`: roda ESLint.
- `npm run build`: gera build de producao do frontend.

## Limitacoes Do MVP

As salas e partidas ficam em memoria no servidor. Se o backend reiniciar, todas as salas somem. Nenhum Supabase/PostgreSQL/Redis precisa ser configurado nesta versao.

## Fluxo Manual De Teste

1. Abra quatro abas em `http://localhost:3000`.
2. Crie uma sala na primeira aba.
3. Entre com o codigo nas outras abas.
4. Inicie o jogo como host.
5. Confira revelacao de cargo privada.
6. Execute a noite com assassino, medico e detetive.
7. Converse durante o dia.
8. Vote e confira eliminacao/vitoria.
