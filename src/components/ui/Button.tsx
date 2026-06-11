import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
}

const variants = {
  primary: 'border-amber-300/70 bg-amber-300 text-slate-950 hover:bg-amber-200',
  secondary: 'border-violet-300/40 bg-violet-500/15 text-violet-100 hover:bg-violet-500/25',
  danger: 'border-red-400/60 bg-red-500/20 text-red-100 hover:bg-red-500/30',
  ghost: 'border-white/10 bg-white/5 text-slate-100 hover:bg-white/10',
}

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-xl border px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] transition disabled:cursor-not-allowed disabled:opacity-45',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
