import type { ChatMessage, GamePhase, GameState, NightActionType, Player, PublicPlayer, RoleId, Room, Winner } from '../../../src/features/game/types'

export type PublicRoom = Omit<Room, 'players'> & {
  players: PublicPlayer[]
}

export type ClientToServerEvents = {
  'room:create': (payload: { name: string; avatar: string }, callback?: (response: RoomResponse) => void) => void
  'room:join': (payload: { code: string; name: string; avatar: string }, callback?: (response: RoomResponse) => void) => void
  'player:updateAvatar': (payload: { avatar: string }) => void
  'player:leave': () => void
  'game:start': () => void
  'game:nightAction': (payload: { targetId: string; type: NightActionType }) => void
  'game:vote': (payload: { targetId: string }) => void
  'game:skip': () => void
  'chat:message': (payload: { text: string }) => void
}

export type ServerToClientEvents = {
  'room:updated': (room: PublicRoom) => void
  'game:started': (state: GameState) => void
  'game:roleAssigned': (payload: { role: RoleId }) => void
  'game:phaseChanged': (state: GameState) => void
  'game:timerUpdated': (payload: { phase: GamePhase; timer: number }) => void
  'game:playerEliminated': (payload: { playerId: string; reason: 'night' | 'vote' }) => void
  'game:voteUpdated': (payload: { votedPlayerIds: string[] }) => void
  'game:detectiveResult': (payload: { targetId: string; correct: boolean }) => void
  'game:ended': (payload: { winner: Winner; state: GameState }) => void
  'chat:messageReceived': (message: ChatMessage) => void
  error: (payload: { message: string }) => void
}

export type InterServerEvents = Record<string, never>
export type SocketData = { playerId?: string; roomId?: string }

export type RoomResponse =
  | { ok: true; roomId: string; code: string; playerId: string }
  | { ok: false; message: string }

export type ServerPlayer = Player
