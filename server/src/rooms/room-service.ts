import { sanitizePlayers } from '../../../src/features/game/rules'
import type { Player, Room } from '../../../src/features/game/types'
import { createId, createRoomCode } from '../utils/ids'
import type { PublicRoom } from '../socket/events'

const rooms = new Map<string, Room>()

const toPublicRoom = (room: Room, revealRoles = false): PublicRoom => ({
  ...room,
  players: sanitizePlayers(room.players, revealRoles),
})

export const roomService = {
  createRoom({ name, avatar, socketId }: { name: string; avatar: string; socketId: string }) {
    const playerId = createId()
    const roomId = createId()
    const player: Player = {
      id: playerId,
      name,
      avatar,
      isAlive: true,
      isHost: true,
      socketId,
    }
    const room: Room = {
      id: roomId,
      code: createRoomCode(),
      hostId: playerId,
      players: [player],
      status: 'lobby',
      createdAt: new Date().toISOString(),
    }

    rooms.set(room.id, room)
    return { room, player }
  },

  joinRoom({ code, name, avatar, socketId }: { code: string; name: string; avatar: string; socketId: string }) {
    const room = [...rooms.values()].find((candidate) => candidate.code === code.toUpperCase())
    if (!room) throw new Error('Sala nao encontrada')
    if (room.status !== 'lobby') throw new Error('Esta sala ja esta em jogo')

    const player: Player = {
      id: createId(),
      name,
      avatar,
      isAlive: true,
      isHost: false,
      socketId,
    }
    room.players.push(player)
    return { room, player }
  },

  getRoom(roomId?: string) {
    return roomId ? rooms.get(roomId) : undefined
  },

  getRoomByPlayer(playerId?: string) {
    if (!playerId) return undefined
    return [...rooms.values()].find((room) => room.players.some((player) => player.id === playerId))
  },

  updateAvatar(playerId: string, avatar: string) {
    const room = this.getRoomByPlayer(playerId)
    const player = room?.players.find((candidate) => candidate.id === playerId)
    if (!room || !player) throw new Error('Jogador nao encontrado')
    player.avatar = avatar
    return room
  },

  leave(playerId?: string) {
    const room = this.getRoomByPlayer(playerId)
    if (!room || !playerId) return undefined

    room.players = room.players.filter((player) => player.id !== playerId)
    if (room.players.length === 0) {
      rooms.delete(room.id)
      return undefined
    }

    if (room.hostId === playerId) {
      room.hostId = room.players[0].id
      room.players = room.players.map((player, index) => ({ ...player, isHost: index === 0 }))
    }

    return room
  },

  publicRoom: toPublicRoom,
}
