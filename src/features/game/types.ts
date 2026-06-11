export type GamePhase =
  | 'LOBBY'
  | 'REVEAL_ROLES'
  | 'NIGHT'
  | 'DAY_DISCUSSION'
  | 'VOTING'
  | 'RESOLUTION'
  | 'GAME_OVER'

export type RoleId = 'citizen' | 'assassin' | 'detective' | 'doctor' | 'liar'

export type NightTurn = 'NIGHT_INTRO' | 'ASSASSIN_TURN' | 'DOCTOR_TURN' | 'DETECTIVE_TURN' | 'NIGHT_END'

export type Team = 'citizens' | 'assassins' | 'solo'

export type ActionType = 'kill' | 'protect' | 'guess-assassin' | 'none'

export type Winner = 'citizens' | 'assassins' | 'liar'

export type Role = {
  id: RoleId
  name: string
  description: string
  team: Team
  actionType: ActionType
}

export type Player = {
  id: string
  name: string
  avatar: string
  role?: RoleId
  isAlive: boolean
  isHost: boolean
  socketId: string
}

export type PublicPlayer = Omit<Player, 'role' | 'socketId'> & {
  role?: RoleId
}

export type RoomStatus = 'lobby' | 'playing' | 'finished'

export type Room = {
  id: string
  code: string
  hostId: string
  players: Player[]
  status: RoomStatus
  createdAt: string
}

export type NightActionType = 'kill' | 'protect' | 'guess-assassin'

export type NightAction = {
  actorId: string
  targetId: string
  type: NightActionType
}

export type GameState = {
  roomId: string
  phase: GamePhase
  players: PublicPlayer[]
  round: number
  timer: number
  votes: Record<string, string>
  nightActions: NightAction[]
  winner?: Winner
  nightTurn?: NightTurn
  lastNightEliminatedPlayerId?: string
  lastVoteEliminatedPlayerId?: string
}

export type ChatMessage = {
  id: string
  roomId: string
  playerId: string
  playerName: string
  text: string
  createdAt: string
}
