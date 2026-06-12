'use client'

import { motion } from 'framer-motion'
import { PlayerCard } from './PlayerCard'
import { GameBackdrop } from '@/components/layout/GameBackdrop'
import type { GameState } from '@/features/game/types'

export function VoteResolutionOverlay({ game }: { game: GameState }) {
  if (game.phase !== 'RESOLUTION') return null

  const eliminated = game.lastVoteEliminatedPlayerId
    ? game.players.find((player) => player.id === game.lastVoteEliminatedPlayerId)
    : undefined

  return (
    <GameBackdrop className="fixed inset-0 z-40 grid place-items-center overflow-y-auto px-5 py-8" visibility="balanced">
      <div className="mx-auto w-full max-w-4xl text-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-black uppercase tracking-[0.45em] text-[#eac8a6] [text-shadow:2px_2px_0_#171717]">Votacao encerrada</p>
          <h1 className="font-display mt-2 text-5xl font-black leading-none tracking-[-0.06em] text-[#dacbb6] [text-shadow:4px_4px_0_#171717,7px_7px_0_rgba(94,115,129,0.95)] md:text-7xl">
            {eliminated ? 'A cidade decidiu...' : 'A cidade nao chegou a uma decisao.'}
          </h1>
          <p className="mt-4 text-lg font-bold text-[#dacbb6]/85 [text-shadow:2px_2px_0_#171717]">
            {eliminated ? `${eliminated.name} foi eliminado pela votacao.` : 'Ninguem foi eliminado.'}
          </p>
        </motion.div>

        {eliminated ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.84, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 180 }}
            className="mx-auto mt-8 max-w-xs"
          >
            <PlayerCard player={eliminated} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="mx-auto mt-8 max-w-sm bg-[#dacbb6]/95 p-8 shadow-[10px_11px_0_rgba(94,115,129,0.75)] [clip-path:polygon(2%_0,98%_3%,100%_100%,0_96%)]"
          >
            <div className="card-back grid aspect-[3/4] place-items-center rounded-[1.2rem] bg-[#171717] text-7xl text-[#eac8a6]">?</div>
          </motion.div>
        )}
      </div>
    </GameBackdrop>
  )
}
