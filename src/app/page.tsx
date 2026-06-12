'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AvatarSelector } from '@/components/character/AvatarSelector'
import { GameBackdrop } from '@/components/layout/GameBackdrop'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useSocketEvents } from '@/features/game/hooks/useSocketEvents'
import { useGameStore } from '@/features/game/store'
import { getJoinRoomError, getPlayerNameError } from '@/features/lobby/validation'
import { getSocket } from '@/lib/socket'

export default function HomePage() {
  useSocketEvents()
  const router = useRouter()
  const { name, avatar, setName, setAvatar, setPlayerId, setError, error } = useGameStore()
  const [code, setCode] = useState('')

  const createRoom = () => {
    const validationError = getPlayerNameError(name)
    if (validationError) {
      setError(validationError)
      return
    }

    const socket = getSocket()
    if (!socket.connected) {
      setError('Conectando ao servidor... tente de novo em alguns segundos. Rode npm run dev para subir o backend junto.')
    }

    socket.emit('room:create', { name, avatar }, (response) => {
      if (!response.ok) return setError(response.message)
      setPlayerId(response.playerId)
      router.push(`/room/${response.roomId}`)
    })
  }

  const joinRoom = () => {
    const validationError = getJoinRoomError(name, code)
    if (validationError) {
      setError(validationError)
      return
    }

    getSocket().emit('room:join', { code, name, avatar }, (response) => {
      if (!response.ok) return setError(response.message)
      setPlayerId(response.playerId)
      router.push(`/room/${response.roomId}`)
    })
  }

  return (
    <GameBackdrop className="flex px-5 py-8 sm:px-8 lg:px-12" contentClassName="mx-auto flex w-full max-w-6xl flex-1" visibility="strong">
      <section className="flex w-full flex-col justify-center gap-10 py-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.45em] text-[#eac8a6] [text-shadow:2px_2px_0_#171717]">oxydorme</p>
          <h1 className="font-display text-6xl font-black leading-[0.82] tracking-[-0.08em] text-[#dacbb6] [text-shadow:4px_4px_0_#171717,7px_7px_0_rgba(94,115,129,0.95)] md:text-8xl lg:text-9xl">
            Blefes,
            <br />
            cartas
            <br />e sombras.
          </h1>
          <p className="mt-7 max-w-xl text-xl font-bold leading-snug text-[#dacbb6]/85 [text-shadow:2px_2px_0_#171717]">
            Crie uma sala, chame a mesa e descubra quem acorda quando todo mundo finge que dorme.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {['Noite', 'Suspeitos', 'Votacao'].map((label) => (
              <span key={label} className="rounded-full border-2 border-[#171717] bg-[#eac8a6] px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#171717] shadow-[4px_4px_0_#5e7381]">
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative w-full max-w-md rotate-[1.2deg] lg:mr-4">
          <div className="absolute inset-3 translate-x-3 translate-y-3 -rotate-3 rounded-[2rem] bg-[#5e7381]/80" />
          <div className="relative bg-[#dacbb6]/95 p-6 text-[#171717] shadow-[14px_16px_0_rgba(23,23,23,0.55)] [clip-path:polygon(2%_0,97%_2%,100%_30%,97%_100%,3%_98%,0_54%)] sm:p-7">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-[#5e7381]">Entrar na rodada</p>
            <h2 className="font-display mt-1 text-4xl font-black leading-[0.88] tracking-[-0.06em]">Puxe sua carta</h2>

            <div className="mt-5 space-y-4">
              <Input
                className="border-0 border-b-4 border-[#171717] bg-[#eac8a6]/70 px-1 text-[#171717] placeholder:text-[#171717]/55 focus:border-[#5e7381] focus:ring-0"
                placeholder="Seu nome"
                value={name}
                maxLength={24}
                onChange={(event) => setName(event.target.value)}
              />
              <AvatarSelector value={avatar} onChange={setAvatar} />
              <Button className="w-full rounded-[999px_1.2rem_999px_1.4rem] border-[#171717] bg-[#171717] text-[#eac8a6] shadow-[6px_7px_0_#5e7381] hover:bg-[#171717]/90" onClick={createRoom}>
                Criar sala
              </Button>
              <div className="flex gap-2">
                <Input
                  className="border-0 border-b-4 border-[#171717] bg-[#eac8a6]/70 px-1 text-[#171717] placeholder:text-[#171717]/55 focus:border-[#5e7381] focus:ring-0"
                  placeholder="Codigo"
                  value={code}
                  onChange={(event) => setCode(event.target.value.toUpperCase())}
                />
                <Button className="rounded-full border-[#5e7381] bg-[#5e7381] text-[#dacbb6] shadow-[4px_5px_0_#171717] hover:bg-[#526775]" variant="secondary" onClick={joinRoom}>
                  Entrar
                </Button>
              </div>
              {error ? <p className="rounded-xl border border-red-500/40 bg-red-500/15 p-3 text-sm font-bold text-red-950">{error}</p> : null}
            </div>
          </div>
        </div>
      </section>
    </GameBackdrop>
  )
}
