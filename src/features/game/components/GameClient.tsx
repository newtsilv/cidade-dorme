'use client'

import { useState } from 'react'
import { ChatBox } from '@/components/chat/ChatBox'
import { GameResultModal } from '@/components/game/GameResultModal'
import { GameTimer } from '@/components/game/GameTimer'
import { GameBackdrop } from '@/components/layout/GameBackdrop'
import { NightActionPanel } from '@/components/game/NightActionPanel'
import { PhaseBanner } from '@/components/game/PhaseBanner'
import { PlayerList } from '@/components/game/PlayerList'
import { RoleRevealCard } from '@/components/game/RoleRevealCard'
import { SkipButton } from '@/components/game/SkipButton'
import { VoteResolutionOverlay } from '@/components/game/VoteResolutionOverlay'
import { Button } from '@/components/ui/Button'
import { useSocketEvents } from '@/features/game/hooks/useSocketEvents'
import { useGameStore } from '@/features/game/store'
import { getSocket } from '@/lib/socket'

export function GameClient() {
  useSocketEvents()
  const { game, ownRole, playerId, messages, detectiveResult, error } = useGameStore()
  const [selectedVoteTargetId, setSelectedVoteTargetId] = useState<string>()

  if (!game) {
    return <GameBackdrop className="grid place-items-center p-5" visibility="strong">Aguardando estado da partida...</GameBackdrop>
  }

  const me = game.players.find((player) => player.id === playerId)
  const votedIds = Object.keys(game.votes)
  const canVote = Boolean(game.phase === 'DAY_DISCUSSION' && me?.isAlive && playerId && !votedIds.includes(playerId))
  const selectedVoteTarget = game.players.find((player) => player.id === selectedVoteTargetId)
  const playerDiedTonight = Boolean(playerId && game.lastNightEliminatedPlayerId === playerId)
  const nightDeath = game.lastNightEliminatedPlayerId
    ? game.players.find((player) => player.id === game.lastNightEliminatedPlayerId)?.name
    : undefined

  const confirmVote = () => {
    if (!selectedVoteTargetId) return
    getSocket().emit('game:vote', { targetId: selectedVoteTargetId })
    setSelectedVoteTargetId(undefined)
  }

  return (
    <GameBackdrop className="px-5 py-6" contentClassName="mx-auto max-w-7xl pt-28 md:pt-24" visibility="muted">
      {game.phase === 'NIGHT' ? <NightActionPanel players={game.players} playerId={playerId} role={ownRole} nightTurn={game.nightTurn} timer={game.timer} /> : null}
      <VoteResolutionOverlay game={game} />
      <GameResultModal game={game} />

      {game.phase !== 'NIGHT' ? (
        <div className="fixed inset-x-4 top-4 z-[90] grid gap-4 md:grid-cols-[1fr_auto]">
          <PhaseBanner phase={game.phase} />
          <GameTimer seconds={game.timer} />
        </div>
      ) : null}

      {game.phase === 'REVEAL_ROLES' ? (
        <div className="py-10"><RoleRevealCard role={ownRole} /></div>
      ) : null}

      {game.phase === 'DAY_DISCUSSION' ? (
        <section className="mb-5 bg-[#dacbb6]/95 p-4 text-[#171717] shadow-[7px_8px_0_rgba(94,115,129,0.72)] [clip-path:polygon(1%_0,99%_2%,100%_100%,0_96%)]">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-[#5e7381]">A cidade acordou</p>
          <h2 className="font-display text-3xl font-black leading-none tracking-[-0.05em]">{nightDeath ? `${nightDeath} morreu durante a noite.` : 'Ninguem morreu durante a noite.'}</h2>
          {playerDiedTonight ? <p className="mt-3 bg-red-900 px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#eac8a6] shadow-[4px_5px_0_#171717] [clip-path:polygon(2%_0,98%_3%,100%_100%,0_96%)]">Voce morreu. Agora observe a cidade decidir.</p> : null}
        </section>
      ) : null}

      {detectiveResult ? (
        <section className="mb-5 bg-[#5e7381]/95 p-4 font-bold text-[#dacbb6] shadow-[7px_8px_0_rgba(23,23,23,0.55)] [clip-path:polygon(1%_0,99%_2%,100%_100%,0_96%)]">
          Palpite do detetive: {detectiveResult.correct ? 'voce acertou.' : 'voce errou.'}
        </section>
      ) : null}

      {error ? <p className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}

      {game.phase === 'DAY_DISCUSSION' ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <PlayerList
              players={game.players}
              votedIds={votedIds}
              disabled={!canVote}
              selectedPlayerId={selectedVoteTargetId}
              excludePlayerId={playerId}
              onSelectPlayer={setSelectedVoteTargetId}
            />
          </div>
          <aside className="space-y-4">
            <SkipButton disabled={!me?.isAlive} />
            <ChatBox messages={messages} disabled={!me?.isAlive} />
          </aside>
        </div>
      ) : null}
      {canVote && selectedVoteTarget ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#171717]/78 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Confirmar voto">
          <div className="w-full max-w-lg bg-[#dacbb6]/95 p-6 text-center text-[#171717] shadow-[14px_16px_0_rgba(94,115,129,0.82)] [clip-path:polygon(1%_0,98%_1%,100%_24%,98%_100%,2%_98%,0_52%)]">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-[#5e7381]">Confirmar voto</p>
            <h2 className="font-display mt-2 text-5xl font-black leading-none tracking-[-0.06em]">{selectedVoteTarget.name}?</h2>
            <p className="mt-3 text-sm font-bold text-[#171717]/70">Essa carta sera seu voto nesta rodada.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button variant="ghost" onClick={() => setSelectedVoteTargetId(undefined)}>Cancelar</Button>
              <Button onClick={confirmVote}>Confirmar voto</Button>
            </div>
          </div>
        </div>
      ) : null}
    </GameBackdrop>
  )
}
