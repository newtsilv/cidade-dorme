import type { GamePhase, NightTurn, Player, RoleId } from './types'

export const PHASE_DURATIONS: Record<Exclude<GamePhase, 'LOBBY' | 'GAME_OVER'>, number> = {
  REVEAL_ROLES: 10,
  NIGHT: 45,
  DAY_DISCUSSION: 90,
  VOTING: 45,
  RESOLUTION: 10,
}

export const nextPhase = (phase: GamePhase): GamePhase => {
  switch (phase) {
    case 'LOBBY':
      return 'REVEAL_ROLES'
    case 'REVEAL_ROLES':
      return 'NIGHT'
    case 'NIGHT':
      return 'DAY_DISCUSSION'
    case 'DAY_DISCUSSION':
      return 'VOTING'
    case 'VOTING':
      return 'RESOLUTION'
    case 'RESOLUTION':
      return 'NIGHT'
    case 'GAME_OVER':
      return 'GAME_OVER'
  }
}

export const roleCanActAtNight = (role?: RoleId): boolean =>
  role === 'assassin' || role === 'doctor' || role === 'detective'

export const NIGHT_TURN_DURATIONS: Record<NightTurn, number> = {
  NIGHT_INTRO: 4,
  ASSASSIN_TURN: 20,
  DOCTOR_TURN: 20,
  DETECTIVE_TURN: 20,
  NIGHT_END: 4,
}

const NIGHT_TURN_ORDER: NightTurn[] = ['ASSASSIN_TURN', 'DOCTOR_TURN', 'DETECTIVE_TURN']

export const roleForNightTurn = (turn: NightTurn): RoleId | undefined => {
  switch (turn) {
    case 'ASSASSIN_TURN':
      return 'assassin'
    case 'DOCTOR_TURN':
      return 'doctor'
    case 'DETECTIVE_TURN':
      return 'detective'
    case 'NIGHT_INTRO':
    case 'NIGHT_END':
      return undefined
  }
}

const hasLivingRole = (players: Player[], role: RoleId): boolean =>
  players.some((player) => player.isAlive && player.role === role)

export const getFirstNightTurn = (players: Player[]): NightTurn =>
  NIGHT_TURN_ORDER.find((turn) => {
    const role = roleForNightTurn(turn)
    return role ? hasLivingRole(players, role) : false
  }) ?? 'NIGHT_END'

export const getNextNightTurn = (current: NightTurn, players: Player[]): NightTurn => {
  const currentIndex = NIGHT_TURN_ORDER.indexOf(current)
  const remainingTurns = currentIndex === -1 ? NIGHT_TURN_ORDER : NIGHT_TURN_ORDER.slice(currentIndex + 1)

  return remainingTurns.find((turn) => {
    const role = roleForNightTurn(turn)
    return role ? hasLivingRole(players, role) : false
  }) ?? 'NIGHT_END'
}
