'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PlayerCard } from './PlayerCard'
import { Button } from '@/components/ui/Button'
import type { NightTurn, PublicPlayer, RoleId } from '@/features/game/types'
import { getSocket } from '@/lib/socket'

const turnDetails: Record<NightTurn, { title: string; helper: string; activeRole?: RoleId; type?: 'kill' | 'protect' | 'guess-assassin' }> = {
  NIGHT_INTRO: { title: 'A cidade dorme', helper: 'Todos fecham os olhos. Os cargos vao acordar em ordem.' },
  ASSASSIN_TURN: { title: 'O assassino acorda', helper: 'O assassino escolhe uma vitima.', activeRole: 'assassin', type: 'kill' },
  DOCTOR_TURN: { title: 'O medico acorda', helper: 'O medico escolhe alguem para proteger.', activeRole: 'doctor', type: 'protect' },
  DETECTIVE_TURN: { title: 'O detetive acorda', helper: 'O detetive da um palpite de quem e assassino.', activeRole: 'detective', type: 'guess-assassin' },
  NIGHT_END: { title: 'Todos voltam a dormir', helper: 'A cidade esta prestes a acordar.' },
}

export function NightActionPanel({ players, playerId, role, nightTurn }: { players: PublicPlayer[]; playerId?: string; role?: RoleId; nightTurn?: NightTurn }) {
  const [selectedTargetId, setSelectedTargetId] = useState<string>()
  const details = turnDetails[nightTurn ?? 'NIGHT_INTRO']
  const canAct = Boolean(details.activeRole && role === details.activeRole && details.type)
  const targets = players.filter((player) => player.isAlive && player.id !== playerId)
  const selectedTarget = targets.find((player) => player.id === selectedTargetId)

  const confirmChoice = () => {
    if (!selectedTargetId || !details.type) return
    getSocket().emit('game:nightAction', { targetId: selectedTargetId, type: details.type })
    setSelectedTargetId(undefined)
  }

  return (
    <section className="fixed inset-0 z-40 overflow-y-auto bg-black px-5 py-8 text-white">
      <div className="mx-auto flex min-h-full max-w-6xl flex-col justify-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <p className="text-sm font-black uppercase tracking-[0.45em] text-red-300">Noite</p>
          <h1 className="font-display text-5xl font-black md:text-7xl">{details.title}</h1>
          <p className="mt-3 text-slate-300">{canAct ? 'Sua vez. Escolha uma carta e confirme.' : details.helper}</p>
        </motion.div>

        <AnimatePresence>
          {canAct ? (
            <motion.div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {targets.map((player, index) => (
                <motion.div key={player.id} initial={{ y: 30, opacity: 0 }} animate={{ y: index % 2 === 0 ? -8 : 8, opacity: 1 }} transition={{ delay: index * 0.05 }}>
                  <PlayerCard player={player} selected={selectedTargetId === player.id} onClick={() => setSelectedTargetId(player.id)} />
                </motion.div>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>

        {canAct && selectedTarget ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-x-4 bottom-4 mx-auto max-w-xl rounded-3xl border border-amber-300/60 bg-slate-950/95 p-4 text-center shadow-[0_0_48px_rgba(252,211,77,0.28)] backdrop-blur"
          >
            <p className="text-sm text-slate-300">Tem certeza que quer escolher esse?</p>
            <h2 className="font-display mt-1 text-3xl font-black text-amber-100">{selectedTarget.name}</h2>
            <div className="mt-4 flex justify-center gap-3">
              <Button variant="ghost" onClick={() => setSelectedTargetId(undefined)}>Trocar alvo</Button>
              <Button onClick={confirmChoice}>Confirmar escolha</Button>
            </div>
          </motion.div>
        ) : null}
      </div>
    </section>
  )
}
