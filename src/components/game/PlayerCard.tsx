'use client'

import { motion } from 'framer-motion'
import { AVATARS } from '@/features/lobby/types'
import type { PublicPlayer, RoleId } from '@/features/game/types'
import { getRole } from '@/features/game/roles'
import { cn } from '@/lib/utils'

type PlayerCardProps = {
  player: PublicPlayer
  selected?: boolean
  disabled?: boolean
  voted?: boolean
  onClick?: () => void
}

export function PlayerCard({ player, selected, disabled, voted, onClick }: PlayerCardProps) {
  const avatar = AVATARS.find((option) => option.id === player.avatar) ?? AVATARS[0]
  const roleName = player.role ? getRole(player.role as RoleId).name : undefined

  return (
    <motion.button
      layout
      type="button"
      disabled={disabled || !onClick}
      onClick={onClick}
      initial={{ opacity: 0, y: 18, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      whileHover={!disabled && onClick ? { y: -8, rotate: 1.5 } : undefined}
      className={cn(
        'group relative aspect-[3/4] min-h-44 overflow-hidden rounded-2xl border bg-slate-950 p-2 text-left shadow-2xl transition',
        player.isAlive ? 'border-white/15' : 'border-slate-700 opacity-45 grayscale',
        selected && 'border-amber-300 shadow-[0_0_28px_rgba(252,211,77,0.4)]',
        !disabled && onClick && 'cursor-pointer',
      )}
    >
      <div className={cn('flex h-full flex-col justify-between rounded-xl bg-gradient-to-br p-3', avatar.gradient)}>
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.25em] text-white/75">
          <span>{player.isHost ? 'Host' : 'Carta'}</span>
          <span>{voted ? 'Votou' : player.isAlive ? 'Vivo' : 'Morto'}</span>
        </div>
        <div
          className="flex-1 overflow-hidden rounded-xl border border-white/20 bg-black/25 bg-cover bg-center shadow-inner"
          style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.45), transparent 60%), url('${avatar.imagePath}')` }}
          aria-label={avatar.label}
        />
        <div>
          <p className="font-display text-xl font-black text-white drop-shadow">{player.name}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-white/70">{roleName ?? avatar.label}</p>
        </div>
      </div>
    </motion.button>
  )
}
