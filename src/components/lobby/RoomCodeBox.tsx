'use client'

import { Button } from '@/components/ui/Button'

export function RoomCodeBox({ code }: { code: string }) {
  return (
    <div className="bg-[#dacbb6]/95 p-4 text-center text-[#171717] shadow-[8px_9px_0_rgba(94,115,129,0.75)] [clip-path:polygon(2%_0,96%_3%,100%_100%,0_96%)]">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-[#5e7381]">Codigo da sala</p>
      <p className="font-display my-2 text-4xl font-black tracking-[0.25em]">{code}</p>
      <Button variant="primary" onClick={() => navigator.clipboard.writeText(code)}>
        Copiar
      </Button>
    </div>
  )
}
