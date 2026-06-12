import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
}

const variants = {
  primary: 'border-[#171717] bg-[#171717] text-[#eac8a6] shadow-[5px_6px_0_#5e7381] hover:-translate-y-0.5 hover:bg-[#171717]/90 hover:shadow-[7px_8px_0_#5e7381]',
  secondary: 'border-[#5e7381] bg-[#5e7381] text-[#dacbb6] shadow-[4px_5px_0_#171717] hover:-translate-y-0.5 hover:bg-[#526775]',
  danger: 'border-red-950 bg-red-800 text-[#eac8a6] shadow-[4px_5px_0_#171717] hover:-translate-y-0.5 hover:bg-red-900',
  ghost: 'border-[#dacbb6]/55 bg-[#dacbb6]/10 text-[#dacbb6] shadow-[4px_5px_0_rgba(23,23,23,0.45)] hover:-translate-y-0.5 hover:bg-[#dacbb6]/20',
}

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-[999px_1.15rem_999px_1.35rem] border-2 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] transition disabled:cursor-not-allowed disabled:opacity-45',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
