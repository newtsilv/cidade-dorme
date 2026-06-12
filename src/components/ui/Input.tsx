import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-[1rem_1.25rem_0.9rem_1.1rem] border-2 border-[#171717] bg-[#eac8a6]/85 px-4 py-3 font-bold text-[#171717] shadow-[4px_5px_0_rgba(23,23,23,0.25)] outline-none transition placeholder:text-[#171717]/55 focus:border-[#5e7381] focus:ring-2 focus:ring-[#5e7381]/25',
        className,
      )}
      {...props}
    />
  )
}
