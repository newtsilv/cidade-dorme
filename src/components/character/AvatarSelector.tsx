'use client'

import { AVATARS } from '@/features/lobby/types'
import { cn } from '@/lib/utils'

export function AvatarSelector({ value, onChange }: { value: string; onChange: (avatar: string) => void }) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {AVATARS.map((avatar) => (
        <button
          key={avatar.id}
          type="button"
          onClick={() => onChange(avatar.id)}
          className={cn(
            'aspect-[3/4] rounded-xl border p-1 transition hover:-translate-y-1',
            value === avatar.id ? 'border-amber-300 shadow-[0_0_24px_rgba(252,211,77,0.35)]' : 'border-white/10',
          )}
          title={avatar.label}
        >
          <span className={cn('flex h-full overflow-hidden rounded-lg bg-gradient-to-br text-left text-[10px] font-black uppercase', avatar.gradient)}>
            <span
              className="flex min-h-full w-full items-end bg-cover bg-center p-2"
              style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0.08) 58%, transparent), url('${avatar.imagePath}')` }}
            >
              <span className="rounded-md bg-black/45 px-2 py-1 text-[8px] leading-tight text-white shadow-sm backdrop-blur-sm">
                {avatar.label}
              </span>
            </span>
          </span>
        </button>
      ))}
    </div>
  )
}
