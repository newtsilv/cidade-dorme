import type { Server, Socket } from 'socket.io'
import { createMessage } from '../chat/chat-service'
import { gameService } from '../game/game-service'
import { roomService } from '../rooms/room-service'
import type { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './events'

type Io = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>

const isValidName = (name: string): boolean => name.trim().length >= 2 && name.trim().length <= 24

const emitRoom = (io: Io, roomId: string, revealRoles = false) => {
  const room = roomService.getRoom(roomId)
  if (room) io.to(room.id).emit('room:updated', roomService.publicRoom(room, revealRoles))
}

const handleError = (socket: AppSocket, error: unknown) => {
  const message = error instanceof Error ? error.message : 'Erro inesperado'
  socket.emit('error', { message })
}

export const registerSocketHandlers = (io: Io) => {
  io.on('connection', (socket) => {
    socket.on('room:create', ({ name, avatar }, callback) => {
      try {
        if (!isValidName(name)) throw new Error('Nome deve ter entre 2 e 24 caracteres')
        const { room, player } = roomService.createRoom({ name: name.trim(), avatar, socketId: socket.id })
        socket.data.playerId = player.id
        socket.data.roomId = room.id
        socket.join(room.id)
        callback?.({ ok: true, roomId: room.id, code: room.code, playerId: player.id })
        emitRoom(io, room.id)
      } catch (error) {
        callback?.({ ok: false, message: error instanceof Error ? error.message : 'Erro ao criar sala' })
        handleError(socket, error)
      }
    })

    socket.on('room:join', ({ code, name, avatar }, callback) => {
      try {
        if (!isValidName(name)) throw new Error('Nome deve ter entre 2 e 24 caracteres')
        const { room, player } = roomService.joinRoom({ code, name: name.trim(), avatar, socketId: socket.id })
        socket.data.playerId = player.id
        socket.data.roomId = room.id
        socket.join(room.id)
        callback?.({ ok: true, roomId: room.id, code: room.code, playerId: player.id })
        emitRoom(io, room.id)
      } catch (error) {
        callback?.({ ok: false, message: error instanceof Error ? error.message : 'Erro ao entrar na sala' })
        handleError(socket, error)
      }
    })

    socket.on('player:updateAvatar', ({ avatar }) => {
      try {
        if (!socket.data.playerId || !socket.data.roomId) throw new Error('Jogador nao conectado a uma sala')
        roomService.updateAvatar(socket.data.playerId, avatar)
        emitRoom(io, socket.data.roomId)
      } catch (error) {
        handleError(socket, error)
      }
    })

    socket.on('game:start', () => {
      try {
        const room = roomService.getRoom(socket.data.roomId)
        const playerId = socket.data.playerId
        if (!room || !playerId) throw new Error('Sala nao encontrada')
        if (room.hostId !== playerId) throw new Error('Apenas o host pode iniciar')
        if (room.players.length < 4) throw new Error('Minimo de 4 jogadores para iniciar')
        room.status = 'playing'
        gameService.start({ io, roomId: room.id, players: room.players })
        emitRoom(io, room.id)
      } catch (error) {
        handleError(socket, error)
      }
    })

    socket.on('game:nightAction', ({ targetId, type }) => {
      try {
        const room = roomService.getRoom(socket.data.roomId)
        if (!room || !socket.data.playerId) throw new Error('Sala nao encontrada')
        gameService.addNightAction({
          io,
          players: room.players,
          roomId: room.id,
          actorId: socket.data.playerId,
          targetId,
          type,
        })
      } catch (error) {
        handleError(socket, error)
      }
    })

    socket.on('game:vote', ({ targetId }) => {
      try {
        const room = roomService.getRoom(socket.data.roomId)
        if (!room || !socket.data.playerId) throw new Error('Sala nao encontrada')
        gameService.vote({ io, players: room.players, roomId: room.id, voterId: socket.data.playerId, targetId })
      } catch (error) {
        handleError(socket, error)
      }
    })

    socket.on('game:skip', () => {
      try {
        const room = roomService.getRoom(socket.data.roomId)
        if (!room || !socket.data.playerId) throw new Error('Sala nao encontrada')
        gameService.skip({ io, players: room.players, roomId: room.id, playerId: socket.data.playerId })
      } catch (error) {
        handleError(socket, error)
      }
    })

    socket.on('chat:message', ({ text }) => {
      try {
        const room = roomService.getRoom(socket.data.roomId)
        const player = room?.players.find((candidate) => candidate.id === socket.data.playerId)
        const state = room ? gameService.state(room.id, room.players) : undefined
        if (!room || !player || !state) throw new Error('Sala nao encontrada')
        if (!player.isAlive) throw new Error('Jogadores mortos nao podem conversar')
        if (state.phase !== 'DAY_DISCUSSION') throw new Error('Chat liberado apenas durante discussao')
        if (!text.trim()) return

        io.to(room.id).emit('chat:messageReceived', createMessage({ roomId: room.id, player, text }))
      } catch (error) {
        handleError(socket, error)
      }
    })

    const leave = () => {
      const roomId = socket.data.roomId
      const room = roomService.leave(socket.data.playerId)
      if (roomId) socket.leave(roomId)
      if (room) emitRoom(io, room.id)
    }

    socket.on('player:leave', leave)
    socket.on('disconnect', leave)
  })
}
