'use client'

import { io, type Socket } from 'socket.io-client'
import type { ClientToServerEvents, ServerToClientEvents } from '../../server/src/socket/events'

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined

export const getSocketUrl = (): string => process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:4000'

export const getSocket = (): Socket<ServerToClientEvents, ClientToServerEvents> => {
  if (!socket) {
    socket = io(getSocketUrl(), {
      autoConnect: true,
    })
  }
  return socket
}
