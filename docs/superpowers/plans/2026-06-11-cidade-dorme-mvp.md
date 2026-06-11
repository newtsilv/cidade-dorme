# Cidade Dorme MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a playable multiplayer Cidade Dorme MVP with rooms, lobby, role assignment, phases, chat, night actions, voting, and win conditions.

**Architecture:** Use a simple two-process app: Next.js App Router frontend under `src/` and Fastify + Socket.IO backend under `server/`. Rules, roles, and game-machine functions stay pure and testable; Socket.IO handlers orchestrate state and emit filtered public snapshots.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Framer Motion, Zustand, Socket.IO, Fastify, Vitest.

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `vitest.config.ts`

- [ ] Create the package scripts and dependencies for a two-process app.
- [ ] Configure TypeScript, Next.js, Tailwind, and Vitest.
- [ ] Run `npm install`.
- [ ] Run `npm run typecheck` and expect no type errors after source files exist.

### Task 2: Shared Game Types And Pure Rules

**Files:**
- Create: `src/features/game/types.ts`
- Create: `src/features/game/roles.ts`
- Create: `src/features/game/rules.ts`
- Create: `src/features/game/game-machine.ts`
- Create: `src/features/game/rules.test.ts`
- Mirror server exports in `server/src/game/` by re-exporting frontend pure modules or duplicating only server-only orchestration.

- [ ] Write failing Vitest tests for role distribution, detective guesses, night resolution, vote resolution, liar victory priority, and standard win conditions.
- [ ] Implement `assignRoles`, `resolveNight`, `resolveVote`, `checkWinner`, `sanitizePlayers`, and phase helpers.
- [ ] Run `npm test -- src/features/game/rules.test.ts` and expect all tests to pass.

### Task 3: Fastify Socket Server

**Files:**
- Create: `server/src/index.ts`
- Create: `server/src/rooms/room-service.ts`
- Create: `server/src/socket/events.ts`
- Create: `server/src/socket/handlers.ts`
- Create: `server/src/game/game-service.ts`
- Create: `server/src/chat/chat-service.ts`
- Create: `server/src/utils/ids.ts`

- [ ] Implement in-memory room storage with create, join, leave, host transfer, and public room snapshots.
- [ ] Implement authoritative game orchestration: start game, private role assignment, phase timers, night actions, detective private result, discussion skip, voting, resolution, and game over.
- [ ] Implement Socket.IO events from the spec with validation and friendly `error` events.
- [ ] Run `npm run server:typecheck` and expect no type errors.

### Task 4: Frontend State And Socket Client

**Files:**
- Create: `src/lib/socket.ts`
- Create: `src/features/lobby/types.ts`
- Create: `src/features/chat/types.ts`
- Create: `src/features/game/store.ts`
- Create: `src/features/game/hooks/useSocketEvents.ts`

- [ ] Implement a typed Socket.IO client using `NEXT_PUBLIC_SOCKET_URL`.
- [ ] Implement Zustand store for local player, room, game state, own role, messages, errors, and selected avatar.
- [ ] Register socket listeners for room, game, timer, vote, elimination, chat, role, detective result, and errors.
- [ ] Run `npm run typecheck` and expect no type errors.

### Task 5: UI Foundation And Card Components

**Files:**
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/styles/globals.css`
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Input.tsx`
- Create: `src/components/character/AvatarSelector.tsx`
- Create: `src/components/game/PlayerCard.tsx`
- Create: `src/components/game/RoleRevealCard.tsx`
- Create: `src/components/game/PhaseBanner.tsx`
- Create: `src/components/game/GameTimer.tsx`

- [ ] Build a dark, card-game visual system with responsive layout.
- [ ] Add placeholder card artwork areas that are easy to replace later.
- [ ] Use Framer Motion for card entry, role reveal, and phase transitions.
- [ ] Run `npm run lint` and expect no lint errors.

### Task 6: Lobby Flow

**Files:**
- Create: `src/app/lobby/page.tsx`
- Create: `src/app/room/[roomId]/page.tsx`
- Create: `src/features/lobby/components/LobbyClient.tsx`
- Create: `src/components/lobby/RoomCodeBox.tsx`
- Create: `src/components/game/PlayerList.tsx`

- [ ] Implement create room and join room from home.
- [ ] Implement lobby with real-time player cards, host marker, start button only for host, minimum-player messaging, and leave button.
- [ ] Navigate to game route when `game:started` arrives.
- [ ] Verify manually with two browser tabs.

### Task 7: Game Screens, Chat, Night Actions, Voting

**Files:**
- Create: `src/app/game/[roomId]/page.tsx`
- Create: `src/features/game/components/GameClient.tsx`
- Create: `src/components/chat/ChatBox.tsx`
- Create: `src/components/voting/VotePanel.tsx`
- Create: `src/components/game/NightActionPanel.tsx`
- Create: `src/components/game/SkipButton.tsx`
- Create: `src/components/game/GameResultModal.tsx`

- [ ] Render phase-aware game UI.
- [ ] During `NIGHT`, show a black cinematic screen and floating selectable player cards for assassin, doctor, and detective.
- [ ] During discussion, enable chat and skip for living players.
- [ ] During voting, show vote cards and who has voted without revealing vote targets.
- [ ] During resolution, show night death or no-death message and vote elimination.
- [ ] During game over, reveal all roles and winner.

### Task 8: Verification

**Files:**
- Modify: `README.md`

- [ ] Document setup, scripts, `.env`, and the limitation that rooms are in memory.
- [ ] Run `npm test`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Manually test four-player flow using multiple tabs or browser profiles.
