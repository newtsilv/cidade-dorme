'use client'

import { ChatBox } from '@/components/chat/ChatBox'
import { GameResultModal } from '@/components/game/GameResultModal'
import { GameTimer } from '@/components/game/GameTimer'
import { NightActionPanel } from '@/components/game/NightActionPanel'
import { PhaseBanner } from '@/components/game/PhaseBanner'
import { PlayerList } from '@/components/game/PlayerList'
import { RoleRevealCard } from '@/components/game/RoleRevealCard'
import { SkipButton } from '@/components/game/SkipButton'
import { VotePanel } from '@/components/voting/VotePanel'
import { useSocketEvents } from '@/features/game/hooks/useSocketEvents'
import { useGameStore } from '@/features/game/store'

export function GameClient() {
  useSocketEvents()
  const { game, ownRole, playerId, messages, detectiveResult, error } = useGameStore()

  if (!game) {
    return <main className="grid min-h-screen place-items-center p-5 text-slate-300">Aguardando estado da partida...</main>
  }

  const me = game.players.find((player) => player.id === playerId)
  const votedIds = Object.keys(game.votes)
  const nightDeath = game.lastNightEliminatedPlayerId
    ? game.players.find((player) => player.id === game.lastNightEliminatedPlayerId)?.name
    : undefined
  const voteDeath = game.lastVoteEliminatedPlayerId
    ? game.players.find((player) => player.id === game.lastVoteEliminatedPlayerId)?.name
    : undefined

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-6">
      {game.phase === 'NIGHT' ? <NightActionPanel players={game.players} playerId={playerId} role={ownRole} nightTurn={game.nightTurn} /> : null}
      <GameResultModal game={game} />

      <div className="mb-5 grid gap-4 md:grid-cols-[1fr_auto]">
        <PhaseBanner phase={game.phase} />
        <GameTimer seconds={game.timer} />
      </div>

      {game.phase === 'REVEAL_ROLES' ? (
        <div className="py-10"><RoleRevealCard role={ownRole} /></div>
      ) : null}

      {game.phase === 'DAY_DISCUSSION' || game.phase === 'RESOLUTION' ? (
        <section className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-amber-200">Amanheceu</p>
          <h2 className="font-display text-3xl font-black">{nightDeath ? `${nightDeath} morreu durante a noite.` : 'A cidade acordou sem vitimas.'}</h2>
          {voteDeath ? <p className="mt-2 text-slate-300">Na votacao, {voteDeath} foi eliminado.</p> : null}
        </section>
      ) : null}

      {detectiveResult ? (
        <section className="mb-5 rounded-2xl border border-sky-300/30 bg-sky-500/10 p-4">
          Palpite do detetive: {detectiveResult.correct ? 'voce acertou.' : 'voce errou.'}
        </section>
      ) : null}

      {error ? <p className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <PlayerList players={game.players} votedIds={votedIds} />
          {game.phase === 'VOTING' ? <VotePanel players={game.players} playerId={playerId} votedIds={votedIds} /> : null}
        </div>
        <aside className="space-y-4">
          {game.phase === 'DAY_DISCUSSION' ? <SkipButton disabled={!me?.isAlive} /> : null}
          <ChatBox messages={messages} disabled={game.phase !== 'DAY_DISCUSSION' || !me?.isAlive} />
        </aside>
      </div>
    </main>
  )
}
