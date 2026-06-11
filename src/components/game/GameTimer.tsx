import { formatTimer } from '@/lib/utils'

export function GameTimer({ seconds }: { seconds: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/35 px-5 py-3 text-center">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Tempo</p>
      <p className="font-display text-3xl font-black text-amber-200">{formatTimer(seconds)}</p>
    </div>
  )
}
