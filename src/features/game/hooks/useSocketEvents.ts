'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSocket, getSocketUrl } from '@/lib/socket'
import { useGameStore } from '../store'

export const useSocketEvents = () => {
  const router = useRouter()

  useEffect(() => {
    const socket = getSocket()
    const store = useGameStore.getState()

    socket.on('room:updated', (room) => useGameStore.getState().setRoom(room))
    socket.on('game:started', (game) => {
      useGameStore.getState().setGame(game)
      router.push(`/game/${game.roomId}`)
    })
    socket.on('game:roleAssigned', ({ role }) => useGameStore.getState().setOwnRole(role))
    socket.on('game:phaseChanged', (game) => useGameStore.getState().setGame(game))
    socket.on('game:timerUpdated', ({ timer }) => {
      const current = useGameStore.getState().game
      if (current) useGameStore.getState().setGame({ ...current, timer })
    })
    socket.on('game:voteUpdated', ({ votedPlayerIds }) => {
      const current = useGameStore.getState().game
      if (current) useGameStore.getState().setGame({ ...current, votes: Object.fromEntries(votedPlayerIds.map((id) => [id, ''])) })
    })
    socket.on('game:ended', ({ state }) => useGameStore.getState().setGame(state))
    socket.on('game:detectiveResult', (result) => useGameStore.getState().setDetectiveResult(result))
    socket.on('chat:messageReceived', (message) => useGameStore.getState().addMessage(message))
    socket.on('error', ({ message }) => useGameStore.getState().setError(message))
    socket.on('connect_error', () => {
      useGameStore.getState().setError(`Nao consegui conectar ao servidor em ${getSocketUrl()}. Verifique a NEXT_PUBLIC_SOCKET_URL na Vercel.`)
    })

    return () => {
      store.setError(undefined)
      socket.off('room:updated')
      socket.off('game:started')
      socket.off('game:roleAssigned')
      socket.off('game:phaseChanged')
      socket.off('game:timerUpdated')
      socket.off('game:voteUpdated')
      socket.off('game:ended')
      socket.off('game:detectiveResult')
      socket.off('chat:messageReceived')
      socket.off('error')
      socket.off('connect_error')
    }
  }, [router])
}
