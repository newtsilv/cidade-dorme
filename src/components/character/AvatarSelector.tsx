'use client'

import { useState } from 'react'
import { AVATARS } from '@/features/lobby/types'
import { cn } from '@/lib/utils'

export function AvatarSelector({ value, onChange }: { value: string; onChange: (avatar: string) => void }) {
  const [open, setOpen] = useState(false)
  const selectedAvatar = AVATARS.find((avatar) => avatar.id === value) ?? AVATARS[0]

  const selectAvatar = (avatar: string) => {
    onChange(avatar)
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full items-center gap-4 rounded-[1.4rem] bg-[#eac8a6]/80 px-4 py-3 text-left text-[#171717] shadow-[6px_7px_0_rgba(94,115,129,0.82)] transition hover:-translate-y-0.5 hover:shadow-[8px_9px_0_rgba(94,115,129,0.82)]"
      >
        <span
          className="h-20 w-16 shrink-0 rotate-[-2deg] rounded-[0.8rem_1rem_0.7rem_1.1rem] border-2 border-[#171717] bg-cover bg-center shadow-[4px_5px_0_rgba(23,23,23,0.26)] transition group-hover:rotate-1"
          style={{ backgroundImage: `linear-gradient(to top, rgba(23,23,23,0.62), transparent 58%), url('${selectedAvatar.imagePath}')` }}
          aria-hidden="true"
        />
        <span className="min-w-0">
          <span className="block text-[0.65rem] font-black uppercase tracking-[0.28em] text-[#5e7381]">Escolher personagem</span>
          <span className="font-display block truncate text-3xl font-black leading-none tracking-[-0.05em]">{selectedAvatar.label}</span>
        </span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/80 px-4 py-8 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Escolher personagem">
          <div className="relative max-h-full w-full max-w-4xl overflow-y-auto bg-[#dacbb6] p-5 text-[#171717] shadow-[14px_16px_0_rgba(94,115,129,0.82)] [clip-path:polygon(1%_0,98%_1%,100%_24%,98%_100%,2%_98%,0_52%)] md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.34em] text-[#5e7381]">Baralho de personagens</p>
                <h2 className="font-display mt-1 text-4xl font-black leading-none tracking-[-0.06em] md:text-5xl">Escolha sua carta</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-[#171717] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#eac8a6] shadow-[4px_5px_0_rgba(94,115,129,0.8)]"
              >
                Fechar
              </button>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-4">
              {AVATARS.map((avatar, index) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => selectAvatar(avatar.id)}
                  className={cn(
                    'group w-32 origin-bottom rounded-[1rem_1.4rem_0.9rem_1.2rem] bg-[#171717] p-2 text-left text-[#dacbb6] shadow-[6px_7px_0_rgba(94,115,129,0.55)] transition hover:-translate-y-2 hover:rotate-0',
                    index % 2 === 0 ? 'rotate-[-2deg]' : 'rotate-[2deg]',
                    value === avatar.id && 'bg-[#5e7381] shadow-[0_0_0_4px_#eac8a6,7px_8px_0_rgba(23,23,23,0.35)]',
                  )}
                >
                  <span
                    className="block aspect-[3/4] rounded-[0.7rem_1rem_0.6rem_0.9rem] border-2 border-[#dacbb6]/70 bg-cover bg-center"
                    style={{ backgroundImage: `linear-gradient(to top, rgba(23,23,23,0.68), rgba(23,23,23,0.04) 62%, transparent), url('${avatar.imagePath}')` }}
                  />
                  <span className="mt-2 block truncate text-xs font-black uppercase tracking-[0.16em]">{avatar.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
