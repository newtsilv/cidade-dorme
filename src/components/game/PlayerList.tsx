'use client'

import { PlayerCard } from './PlayerCard'
import type { PublicPlayer } from '@/features/game/types'

type PlayerListProps = {
  players: PublicPlayer[]
  votedIds?: string[]
  disabled?: boolean
  disableCardHover?: boolean
  selectedPlayerId?: string
  excludePlayerId?: string
  onSelectPlayer?: (playerId: string) => void
}

export function PlayerList({ players, votedIds = [], disabled, disableCardHover, selectedPlayerId, excludePlayerId, onSelectPlayer }: PlayerListProps) {
  const alive = players.filter((player) => player.isAlive)
  const dead = players.filter((player) => !player.isAlive)

  return (
    <div className="space-y-5">
      <section>
        <h2 className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-[#eac8a6] [text-shadow:2px_2px_0_#171717]">Vivos</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {alive.map((player, index) => (
            <div key={player.id} className={index % 2 === 0 ? 'rotate-[-1.2deg]' : 'rotate-[1.2deg]'}>
              <PlayerCard
                player={player}
                voted={votedIds.includes(player.id)}
                disableHover={disableCardHover}
                selected={selectedPlayerId === player.id}
                disabled={disabled || player.id === excludePlayerId}
                onClick={onSelectPlayer && player.id !== excludePlayerId ? () => onSelectPlayer(player.id) : undefined}
              />
            </div>
          ))}
        </div>
      </section>
      {dead.length > 0 ? (
        <section>
          <h2 className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-[#dacbb6]/55 [text-shadow:2px_2px_0_#171717]">Mortos</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {dead.map((player, index) => (
              <div key={player.id} className={index % 2 === 0 ? 'rotate-[1deg]' : 'rotate-[-1deg]'}>
                <PlayerCard player={player} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
