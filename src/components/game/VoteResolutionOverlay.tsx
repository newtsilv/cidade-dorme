'use client'

import { motion } from 'framer-motion'
import { PlayerCard } from './PlayerCard'
import type { GameState } from '@/features/game/types'

export function VoteResolutionOverlay({ game }: { game: GameState }) {
  if (game.phase !== 'RESOLUTION') return null

  const eliminated = game.lastVoteEliminatedPlayerId
    ? game.players.find((player) => player.id === game.lastVoteEliminatedPlayerId)
    : undefined

  return (
    <section className="fixed inset-0 z-40 grid place-items-center overflow-y-auto bg-black px-5 py-8 text-white">
      <div className="mx-auto w-full max-w-4xl text-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-black uppercase tracking-[0.45em] text-amber-200">Votacao encerrada</p>
          <h1 className="font-display mt-2 text-5xl font-black md:text-7xl">
            {eliminated ? 'A cidade decidiu...' : 'A cidade nao chegou a uma decisao.'}
          </h1>
          <p className="mt-4 text-lg text-slate-300">
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
            className="mx-auto mt-8 max-w-sm rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl"
          >
            <div className="card-back grid aspect-[3/4] place-items-center rounded-[1.5rem] text-7xl text-white/70">?</div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
