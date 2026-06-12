import { formatTimer } from '@/lib/utils'

export function GameTimer({ seconds }: { seconds: number }) {
  return (
    <div className="bg-[#171717] px-5 py-3 text-center text-[#eac8a6] shadow-[6px_7px_0_rgba(94,115,129,0.72)] [clip-path:polygon(4%_0,100%_5%,96%_100%,0_94%)]">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#dacbb6]/65">Tempo</p>
      <p className="font-display text-3xl font-black leading-none tracking-[-0.04em]">{formatTimer(seconds)}</p>
    </div>
  )
}
