'use client'

import { useState } from 'react'
import { PlayerCard } from '@/components/game/PlayerCard'
import { Button } from '@/components/ui/Button'
import type { PublicPlayer } from '@/features/game/types'
import { getSocket } from '@/lib/socket'

export function VotePanel({ players, playerId, votedIds }: { players: PublicPlayer[]; playerId?: string; votedIds: string[] }) {
  const [selectedTargetId, setSelectedTargetId] = useState<string>()
  const me = players.find((player) => player.id === playerId)
  const canVote = Boolean(me?.isAlive && playerId && !votedIds.includes(playerId))
  const selectedTarget = players.find((player) => player.id === selectedTargetId)

  const confirmVote = () => {
    if (!selectedTargetId) return
    getSocket().emit('game:vote', { targetId: selectedTargetId })
    setSelectedTargetId(undefined)
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <h2 className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-amber-200">Escolha uma carta para eliminar</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {players.filter((player) => player.isAlive && player.id !== playerId).map((player) => (
          <PlayerCard key={player.id} player={player} selected={selectedTargetId === player.id} disabled={!canVote} onClick={() => setSelectedTargetId(player.id)} />
        ))}
      </div>
      {canVote && selectedTarget ? (
        <div className="mt-4 rounded-2xl border border-amber-300/50 bg-amber-300/10 p-4 text-center">
          <p className="text-sm text-slate-300">Tem certeza que quer votar em</p>
          <p className="font-display text-3xl font-black text-amber-100">{selectedTarget.name}?</p>
          <div className="mt-3 flex justify-center gap-3">
            <Button variant="ghost" onClick={() => setSelectedTargetId(undefined)}>Trocar voto</Button>
            <Button onClick={confirmVote}>Confirmar voto</Button>
          </div>
        </div>
      ) : null}
      <p className="mt-3 text-sm text-slate-400">Ja votaram: {votedIds.length}</p>
    </section>
  )
}
