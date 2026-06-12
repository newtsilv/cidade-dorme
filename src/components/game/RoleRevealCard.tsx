'use client'

import { motion } from 'framer-motion'
import { getRoleImagePath } from '@/features/game/role-assets'
import { getRole } from '@/features/game/roles'
import type { RoleId } from '@/features/game/types'

export function RoleRevealCard({ role }: { role?: RoleId }) {
  if (!role) return null
  const details = getRole(role)
  const roleImagePath = getRoleImagePath(role)

  return (
    <motion.div
      initial={{ rotateY: 180, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: 'spring' }}
      className="mx-auto max-w-sm bg-[#171717] p-3 text-[#171717] shadow-[12px_14px_0_rgba(94,115,129,0.75)] [clip-path:polygon(2%_0,98%_2%,100%_52%,96%_100%,4%_98%,0_34%)]"
    >
      <div
        className="flex aspect-[3/4] flex-col justify-between rounded-[1.2rem] bg-cover bg-center p-6"
        style={{ backgroundImage: `linear-gradient(to top, rgba(23,23,23,0.92), rgba(23,23,23,0.26) 56%, rgba(23,23,23,0.1)), url('${roleImagePath}')` }}
      >
        <p className="text-xs font-black uppercase tracking-[0.35em] text-[#eac8a6] [text-shadow:1px_1px_0_#171717]">Seu cargo</p>
        <div>
          <h2 className="font-display text-5xl font-black leading-none tracking-[-0.06em] text-[#dacbb6] [text-shadow:3px_3px_0_#171717]">{details.name}</h2>
          <p className="mt-2 text-sm font-bold text-[#dacbb6]/85 [text-shadow:1px_1px_0_#171717]">{details.description}</p>
        </div>
      </div>
    </motion.div>
  )
}
