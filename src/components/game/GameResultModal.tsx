'use client'

import { motion } from 'framer-motion'
import { GameBackdrop } from '@/components/layout/GameBackdrop'
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
    <GameBackdrop className="fixed inset-0 z-50 grid place-items-center p-5" visibility="balanced">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl bg-[#dacbb6]/95 p-6 text-[#171717] shadow-[14px_16px_0_rgba(94,115,129,0.82)] [clip-path:polygon(1%_0,98%_1%,100%_24%,98%_100%,2%_98%,0_52%)]">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-[#5e7381]">Fim de jogo</p>
        <h2 className="font-display mt-2 text-5xl font-black leading-none tracking-[-0.06em]">{winnerLabel[game.winner]}</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {game.players.map((player) => (
            <div key={player.id} className="bg-[#eac8a6]/70 p-3 shadow-[4px_5px_0_rgba(23,23,23,0.22)] [clip-path:polygon(3%_0,100%_5%,96%_100%,0_94%)]">
              <p className="font-bold">{player.name}</p>
              <p className="text-sm font-black uppercase tracking-[0.12em] text-[#5e7381]">{player.role ? getRole(player.role).name : 'Sem cargo'}</p>
            </div>
          ))}
        </div>
        <Button className="mt-6" onClick={() => window.location.assign('/')}>Jogar novamente</Button>
      </motion.div>
    </GameBackdrop>
  )
}
