'use client'

import { PlayerCard } from './PlayerCard'
import type { PublicPlayer } from '@/features/game/types'

export function PlayerList({ players, votedIds = [] }: { players: PublicPlayer[]; votedIds?: string[] }) {
  const alive = players.filter((player) => player.isAlive)
  const dead = players.filter((player) => !player.isAlive)

  return (
    <div className="space-y-5">
      <section>
        <h2 className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-slate-300">Vivos</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {alive.map((player) => (
            <PlayerCard key={player.id} player={player} voted={votedIds.includes(player.id)} />
          ))}
        </div>
      </section>
      {dead.length > 0 ? (
        <section>
          <h2 className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-slate-500">Mortos</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {dead.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
