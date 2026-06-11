'use client'

import { motion } from 'framer-motion'
import { getRole } from '@/features/game/roles'
import type { RoleId } from '@/features/game/types'

export function RoleRevealCard({ role }: { role?: RoleId }) {
  if (!role) return null
  const details = getRole(role)

  return (
    <motion.div
      initial={{ rotateY: 180, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: 'spring' }}
      className="mx-auto max-w-sm rounded-[2rem] border border-amber-300/60 bg-slate-950 p-4 shadow-[0_0_60px_rgba(252,211,77,0.25)]"
    >
      <div className="card-back flex aspect-[3/4] flex-col justify-between rounded-[1.5rem] p-6">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-amber-200">Seu cargo</p>
        <div className="rounded-2xl border border-white/20 bg-black/35 p-8 text-center text-6xl">?</div>
        <div>
          <h2 className="font-display text-4xl font-black text-white">{details.name}</h2>
          <p className="mt-2 text-sm text-slate-200">{details.description}</p>
        </div>
      </div>
    </motion.div>
  )
}
