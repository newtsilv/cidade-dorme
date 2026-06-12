'use client'

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
    <button
      type="button"
      disabled={disabled || !onClick}
      onClick={onClick}
      className={cn(
        'group relative aspect-[3/4] min-h-44 origin-bottom overflow-hidden rounded-[1.1rem_1.5rem_1rem_1.3rem] bg-[#171717] p-2 text-left text-[#dacbb6] shadow-[8px_9px_0_rgba(94,115,129,0.55)] transition',
        player.isAlive ? 'opacity-100' : 'opacity-45 grayscale',
        selected && 'bg-[#5e7381] shadow-[0_0_0_4px_#eac8a6,9px_10px_0_rgba(23,23,23,0.45)]',
        !disabled && onClick && 'cursor-pointer hover:-translate-y-1',
      )}
    >
      <div
        className="flex h-full flex-col justify-between rounded-[0.8rem_1.15rem_0.75rem_1rem] bg-cover bg-center p-3 text-[#dacbb6]"
        style={{ backgroundImage: `linear-gradient(to top, rgba(23,23,23,0.92), rgba(23,23,23,0.22) 54%, rgba(23,23,23,0.08)), url('${avatar.imagePath}')` }}
        aria-label={avatar.label}
      >
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.25em] text-[#eac8a6] [text-shadow:1px_1px_0_#171717]">
          <span>{player.isHost ? 'Host' : 'Carta'}</span>
          <span>{voted ? 'Votou' : player.isAlive ? 'Vivo' : 'Morto'}</span>
        </div>
        <div>
          <p className="font-display text-2xl font-black leading-none tracking-[-0.05em] text-[#dacbb6] [text-shadow:2px_2px_0_#171717]">{player.name}</p>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#eac8a6] [text-shadow:1px_1px_0_#171717]">{roleName ?? avatar.label}</p>
        </div>
      </div>
    </button>
  )
}
