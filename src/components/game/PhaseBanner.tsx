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
        className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center backdrop-blur"
      >
        <p className="text-xs font-black uppercase tracking-[0.35em] text-amber-200">Fase atual</p>
        <h1 className="font-display text-3xl font-black">{labels[phase]}</h1>
      </motion.div>
    </AnimatePresence>
  )
}
