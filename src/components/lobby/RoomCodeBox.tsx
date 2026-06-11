'use client'

import { Button } from '@/components/ui/Button'

export function RoomCodeBox({ code }: { code: string }) {
  return (
    <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-center">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-200">Codigo da sala</p>
      <p className="font-display my-2 text-4xl font-black tracking-[0.25em]">{code}</p>
      <Button variant="ghost" onClick={() => navigator.clipboard.writeText(code)}>
        Copiar
      </Button>
    </div>
  )
}
