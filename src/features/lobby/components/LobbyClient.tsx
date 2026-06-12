'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlayerList } from '@/components/game/PlayerList'
import { GameBackdrop } from '@/components/layout/GameBackdrop'
import { RoomCodeBox } from '@/components/lobby/RoomCodeBox'
import { Button } from '@/components/ui/Button'
import { useSocketEvents } from '@/features/game/hooks/useSocketEvents'
import { useGameStore } from '@/features/game/store'
import { getSocket } from '@/lib/socket'

export function LobbyClient() {
  useSocketEvents()
  const router = useRouter()
  const { room, playerId, error, resetSession } = useGameStore()
  const me = room?.players.find((player) => player.id === playerId)

  useEffect(() => {
    if (!room) router.push('/')
  }, [room, router])

  if (!room) return null

  const leave = () => {
    getSocket().emit('player:leave')
    resetSession()
    router.push('/')
  }

  return (
    <GameBackdrop className="px-5 py-8" contentClassName="mx-auto max-w-6xl" visibility="strong">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[#eac8a6] [text-shadow:2px_2px_0_#171717]">Lobby</p>
          <h1 className="font-display text-5xl font-black leading-none tracking-[-0.05em] text-[#dacbb6] [text-shadow:3px_3px_0_#171717,5px_5px_0_rgba(94,115,129,0.9)]">Prepare a mesa</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={leave}>Sair</Button>
          {me?.isHost ? (
            <Button disabled={room.players.length < 4} onClick={() => getSocket().emit('game:start')}>
              Iniciar jogo
            </Button>
          ) : null}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-4">
          <RoomCodeBox code={room.code} />
          <p className="bg-[#dacbb6]/95 p-4 text-sm font-bold text-[#171717] shadow-[6px_7px_0_rgba(23,23,23,0.45)] [clip-path:polygon(2%_0,98%_3%,100%_100%,0_96%)]">
            {room.players.length < 4 ? `Faltam ${4 - room.players.length} jogador(es) para iniciar.` : 'Minimo atingido. O host pode iniciar.'}
          </p>
          {error ? <p className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}
        </aside>
        <PlayerList players={room.players} />
      </div>
    </GameBackdrop>
  )
}
