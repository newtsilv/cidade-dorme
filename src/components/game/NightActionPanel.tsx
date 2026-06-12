'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GameTimer } from './GameTimer'
import { PhaseBanner } from './PhaseBanner'
import { PlayerCard } from './PlayerCard'
import { GameBackdrop } from '@/components/layout/GameBackdrop'
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

export function NightActionPanel({ players, playerId, role, nightTurn, timer }: { players: PublicPlayer[]; playerId?: string; role?: RoleId; nightTurn?: NightTurn; timer: number }) {
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
    <GameBackdrop className="fixed inset-0 z-40 overflow-hidden px-5 py-8" visibility={canAct ? 'muted' : 'balanced'}>
      <div className="fixed inset-x-4 top-4 z-[95] grid gap-4 md:grid-cols-[1fr_auto]">
        <PhaseBanner phase="NIGHT" />
        <GameTimer seconds={timer} />
      </div>
      <div className="mx-auto flex h-screen max-w-6xl flex-col justify-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className={canAct ? 'mb-6 text-center' : 'text-center'}>
          <p className="text-sm font-black uppercase tracking-[0.45em] text-[#eac8a6] [text-shadow:2px_2px_0_#171717]">Noite</p>
          <h1 className="font-display text-5xl font-black leading-none tracking-[-0.07em] text-[#dacbb6] [text-shadow:4px_4px_0_#171717,7px_7px_0_rgba(94,115,129,0.95)] md:text-7xl">{details.title}</h1>
          <p className="mt-3 font-bold text-[#dacbb6]/80 [text-shadow:2px_2px_0_#171717]">{canAct ? 'Sua vez. Escolha uma carta e confirme.' : details.helper}</p>
        </motion.div>

        {canAct ? (
          <div className="grid max-h-[58vh] grid-cols-2 gap-4 overflow-hidden sm:grid-cols-3 md:grid-cols-4">
            {targets.map((player) => (
              <div key={player.id}>
                <PlayerCard player={player} selected={selectedTargetId === player.id} onClick={() => setSelectedTargetId(player.id)} />
              </div>
            ))}
          </div>
        ) : null}

        {canAct && selectedTarget ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-x-4 bottom-4 mx-auto max-w-xl bg-[#dacbb6]/95 p-4 text-center text-[#171717] shadow-[8px_9px_0_rgba(94,115,129,0.82)] [clip-path:polygon(2%_0,98%_3%,100%_100%,0_96%)]"
          >
            <p className="text-sm font-bold text-[#171717]/70">Tem certeza que quer escolher esse?</p>
            <h2 className="font-display mt-1 text-3xl font-black leading-none tracking-[-0.04em]">{selectedTarget.name}</h2>
            <div className="mt-4 flex justify-center gap-3">
              <Button variant="ghost" onClick={() => setSelectedTargetId(undefined)}>Trocar alvo</Button>
              <Button onClick={confirmChoice}>Confirmar escolha</Button>
            </div>
          </motion.div>
        ) : null}
      </div>
    </GameBackdrop>
  )
}
