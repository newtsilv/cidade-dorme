# Discussion Voting Resolution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge voting into discussion, resolve votes when everyone votes or skips, and show a cinematic elimination/no-elimination screen.

**Architecture:** Keep authoritative vote resolution on the server. Reuse the existing `DAY_DISCUSSION`, `RESOLUTION`, `lastVoteEliminatedPlayerId`, and votes state; stop routing through the separate `VOTING` phase in the live loop. Add UI overlays for resolution and allow vote selection during discussion with confirmation.

**Tech Stack:** TypeScript, Vitest, Socket.IO, Next.js App Router, Zustand, Framer Motion, Tailwind CSS.

---

### Task 1: Server Flow

**Files:**
- Modify: `src/features/game/game-machine.ts`
- Modify: `server/src/game/game-service.ts`

- [ ] Change `nextPhase('DAY_DISCUSSION')` to return `RESOLUTION`.
- [ ] Allow `game:vote` during `DAY_DISCUSSION`.
- [ ] Resolve votes when `DAY_DISCUSSION` advances.
- [ ] End discussion immediately when all living players voted or all living players skipped.
- [ ] Keep `VOTING` type for compatibility but do not use it in the normal loop.

### Task 2: UI Flow

**Files:**
- Modify: `src/features/game/components/GameClient.tsx`
- Modify: `src/components/voting/VotePanel.tsx`
- Create: `src/components/game/VoteResolutionOverlay.tsx`

- [ ] Show `VotePanel` during `DAY_DISCUSSION`.
- [ ] Rename the skip button context to `Pular discussão/votação`.
- [ ] Show a full-screen resolution overlay during `RESOLUTION` with the eliminated player card or a no-elimination message.
- [ ] Keep the selected vote border and confirmation.

### Task 3: Verification

**Files:**
- Modify tests as needed.

- [ ] Run `npm test`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run server:typecheck`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
