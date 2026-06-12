'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { GamePhase } from '@/features/game/types'

const labels: Record<GamePhase, string> = {
  LOBBY: 'Lobby',
  REVEAL_ROLES: 'Revelacao de cargos',
  NIGHT: 'A cidade dorme',
  DAY_DISCUSSION: 'A cidade acorda',
  VOTING: 'Votacao',
  RESOLUTION: 'Resultado',
  GAME_OVER: 'Fim de jogo',
}

export function PhaseBanner({ phase }: { phase: GamePhase }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={phase}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        className="bg-[#dacbb6]/95 px-5 py-4 text-center text-[#171717] shadow-[7px_8px_0_rgba(94,115,129,0.72)] [clip-path:polygon(2%_0,98%_3%,100%_100%,0_96%)]"
      >
        <p className="text-xs font-black uppercase tracking-[0.35em] text-[#5e7381]">Fase atual</p>
        <h1 className="font-display text-3xl font-black leading-none tracking-[-0.05em]">{labels[phase]}</h1>
      </motion.div>
    </AnimatePresence>
  )
}
