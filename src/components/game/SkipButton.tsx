'use client'

import { Button } from '@/components/ui/Button'
import { getSocket } from '@/lib/socket'

export function SkipButton({ disabled }: { disabled?: boolean }) {
  return (
    <Button variant="secondary" disabled={disabled} onClick={() => getSocket().emit('game:skip')}>
      Pular discussão/votação
    </Button>
  )
}
