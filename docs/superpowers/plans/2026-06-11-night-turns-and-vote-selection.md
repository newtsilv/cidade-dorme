# Night Turns And Vote Selection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make night actions happen in visible role-by-role turns with confirmation, and show a selected border before confirming votes.

**Architecture:** Extend shared game state with `nightTurn`, add pure helpers for night turn ordering, then update the server game service to advance night subturns. Update React panels to show public narration to everyone, actionable cards only to the active role, and confirmation states before emitting socket events.

**Tech Stack:** TypeScript, Vitest, Socket.IO, Next.js App Router, Zustand, Framer Motion, Tailwind CSS.

---

### Task 1: Pure Night Turn Helpers

**Files:**
- Modify: `src/features/game/types.ts`
- Modify: `src/features/game/game-machine.ts`
- Modify: `src/features/game/rules.test.ts`

- [ ] Add `NightTurn` type and `nightTurn?: NightTurn` to `GameState`.
- [ ] Add tests for active night role selection and skipping roles with no living player.
- [ ] Implement `NIGHT_TURN_DURATIONS`, `getFirstNightTurn`, `getNextNightTurn`, and `roleForNightTurn`.
- [ ] Run `npm test -- src/features/game/rules.test.ts`.

### Task 2: Server Night Turn Orchestration

**Files:**
- Modify: `server/src/game/game-service.ts`

- [ ] Store `nightTurn` in internal game state.
- [ ] Start `NIGHT` with first living actionable role.
- [ ] Let only the active night role submit an action.
- [ ] After a confirmed action or timer expiry, advance to the next night turn.
- [ ] Resolve night only after all night turns complete.
- [ ] Run `npm run server:typecheck`.

### Task 3: UI Confirmation And Vote Border

**Files:**
- Modify: `src/components/game/NightActionPanel.tsx`
- Modify: `src/components/voting/VotePanel.tsx`
- Modify: `src/features/game/components/GameClient.tsx`

- [ ] Show narration for everyone based on `nightTurn`.
- [ ] Let only the active role see clickable target cards.
- [ ] On card click, highlight selected target and show “Tem certeza?” confirmation.
- [ ] Add selected border in voting before confirming vote.
- [ ] Run `npm run typecheck`, `npm run lint`, and `npm test`.
