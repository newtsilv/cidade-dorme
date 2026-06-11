'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AvatarSelector } from '@/components/character/AvatarSelector'
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
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-10">
      <section className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-black uppercase tracking-[0.45em] text-amber-200">Cidade Dorme</p>
          <h1 className="font-display text-6xl font-black leading-none md:text-8xl">Uma mesa de cartas, blefes e sombras.</h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            Crie uma sala, chame seus amigos e descubra quem acorda durante a noite.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur">
          <div className="space-y-4">
            <Input placeholder="Seu nome" value={name} maxLength={24} onChange={(event) => setName(event.target.value)} />
            <AvatarSelector value={avatar} onChange={setAvatar} />
            <Button className="w-full" onClick={createRoom}>
              Criar sala
            </Button>
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <Input placeholder="Codigo" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} />
              <Button variant="secondary" onClick={joinRoom}>
                Entrar
              </Button>
            </div>
            {error ? <p className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}
          </div>
        </div>
      </section>
    </main>
  )
}
