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
    <section className="bg-[#dacbb6]/95 p-4 text-[#171717] shadow-[8px_9px_0_rgba(94,115,129,0.7)] [clip-path:polygon(1%_0,98%_1%,100%_100%,0_98%)]">
      <h2 className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-[#5e7381]">Escolha uma carta para eliminar</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {players.filter((player) => player.isAlive && player.id !== playerId).map((player) => (
          <PlayerCard key={player.id} player={player} selected={selectedTargetId === player.id} disabled={!canVote} onClick={() => setSelectedTargetId(player.id)} />
        ))}
      </div>
      {canVote && selectedTarget ? (
        <div className="mt-4 bg-[#eac8a6]/80 p-4 text-center shadow-[5px_6px_0_rgba(23,23,23,0.28)] [clip-path:polygon(2%_0,98%_3%,100%_100%,0_96%)]">
          <p className="text-sm font-bold text-[#171717]/70">Tem certeza que quer votar em</p>
          <p className="font-display text-3xl font-black leading-none tracking-[-0.04em] text-[#171717]">{selectedTarget.name}?</p>
          <div className="mt-3 flex justify-center gap-3">
            <Button variant="ghost" onClick={() => setSelectedTargetId(undefined)}>Trocar voto</Button>
            <Button onClick={confirmVote}>Confirmar voto</Button>
          </div>
        </div>
      ) : null}
      <p className="mt-3 text-sm font-black uppercase tracking-[0.18em] text-[#5e7381]">Ja votaram: {votedIds.length}</p>
    </section>
  )
}
