import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type GameBackdropProps = {
  children?: ReactNode
  className?: string
  contentClassName?: string
  visibility?: 'strong' | 'balanced' | 'muted'
}

const overlays = {
  strong:
    'linear-gradient(90deg, rgba(23,23,23,0.78), rgba(23,23,23,0.3) 48%, rgba(23,23,23,0.68)), linear-gradient(to top, rgba(23,23,23,0.82), rgba(23,23,23,0.08) 56%, rgba(23,23,23,0.42))',
  balanced:
    'linear-gradient(90deg, rgba(23,23,23,0.9), rgba(23,23,23,0.52) 48%, rgba(23,23,23,0.82)), linear-gradient(to top, rgba(23,23,23,0.92), rgba(23,23,23,0.18) 58%, rgba(23,23,23,0.62))',
  muted:
    'linear-gradient(90deg, rgba(23,23,23,0.96), rgba(23,23,23,0.76) 48%, rgba(23,23,23,0.92)), linear-gradient(to top, rgba(23,23,23,0.96), rgba(23,23,23,0.48) 58%, rgba(23,23,23,0.78))',
}

export function GameBackdrop({ children, className, contentClassName, visibility = 'balanced' }: GameBackdropProps) {
  return (
    <main className={cn('relative min-h-screen bg-[#171717] text-[#dacbb6]', className)}>
      <div
        className="fixed inset-0 bg-cover bg-[center_18%] opacity-95 saturate-90"
        style={{ backgroundImage: `${overlays[visibility]}, url('/avatars/manel%20(4).svg')` }}
      />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(234,200,166,0.2),transparent_24rem),radial-gradient(circle_at_82%_72%,rgba(94,115,129,0.24),transparent_28rem)] mix-blend-screen" />
      <div className="fixed inset-x-4 top-4 bottom-4 rounded-[2rem] border border-[#dacbb6]/18 sm:inset-x-6 sm:top-6 sm:bottom-6" />
      <div className={cn('relative z-10', contentClassName)}>{children}</div>
    </main>
  )
}
