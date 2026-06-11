'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { getRole } from '@/features/game/roles'
import type { GameState } from '@/features/game/types'

const winnerLabel = {
  citizens: 'Cidadaos venceram',
  assassins: 'Assassinos venceram',
  liar: 'Mentiroso venceu sozinho',
}

export function GameResultModal({ game }: { game: GameState }) {
  if (game.phase !== 'GAME_OVER' || !game.winner) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-5 backdrop-blur">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl rounded-[2rem] border border-amber-300/40 bg-slate-950 p-6 shadow-2xl">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-amber-200">Fim de jogo</p>
        <h2 className="font-display mt-2 text-5xl font-black">{winnerLabel[game.winner]}</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {game.players.map((player) => (
            <div key={player.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="font-bold">{player.name}</p>
              <p className="text-sm text-amber-200">{player.role ? getRole(player.role).name : 'Sem cargo'}</p>
            </div>
          ))}
        </div>
        <Button className="mt-6" onClick={() => window.location.assign('/')}>Jogar novamente</Button>
      </motion.div>
    </div>
  )
}
