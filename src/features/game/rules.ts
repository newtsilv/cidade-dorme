import type { NightAction, Player, PublicPlayer, RoleId, Winner } from './types'

type RandomSource = () => number

const shuffle = <T>(items: T[], random: RandomSource): T[] => {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}

export const getRoleDeck = (playerCount: number): RoleId[] => {
  if (playerCount < 4) {
    throw new Error('Minimo de 4 jogadores para iniciar')
  }

  const roles: RoleId[] = ['assassin', 'detective', 'doctor']

  if (playerCount >= 7) {
    roles.push('assassin')
  }

  if (playerCount >= 5) {
    roles.push('liar')
  }

  while (roles.length < playerCount) {
    roles.push('citizen')
  }

  return roles
}

export const assignRoles = (players: Player[], random: RandomSource = Math.random): Player[] => {
  const roleDeck = shuffle(getRoleDeck(players.length), random)
  return players.map((player, index) => ({ ...player, role: roleDeck[index], isAlive: true }))
}

export const resolveDetectiveGuess = ({ target }: { target?: Player }): { correct: boolean } => ({
  correct: target?.role === 'assassin',
})

export const resolveNight = ({
  players,
  actions,
}: {
  players: Player[]
  actions: NightAction[]
}): { eliminatedPlayerId?: string } => {
  const kill = actions.find((action) => action.type === 'kill')
  if (!kill) return {}

  const protectedIds = new Set(
    actions.filter((action) => action.type === 'protect').map((action) => action.targetId),
  )
  const target = players.find((player) => player.id === kill.targetId && player.isAlive)

  if (!target || protectedIds.has(target.id)) return {}

  return { eliminatedPlayerId: target.id }
}

export const resolveVote = ({
  players,
  votes,
}: {
  players: Player[]
  votes: Record<string, string>
}): { eliminatedPlayerId?: string; winner?: Winner } => {
  const aliveIds = new Set(players.filter((player) => player.isAlive).map((player) => player.id))
  const counts = new Map<string, number>()

  Object.entries(votes).forEach(([voterId, targetId]) => {
    if (!aliveIds.has(voterId) || !aliveIds.has(targetId)) return
    counts.set(targetId, (counts.get(targetId) ?? 0) + 1)
  })

  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1])
  if (ranked.length === 0 || ranked[0][1] === ranked[1]?.[1]) return {}

  const eliminatedPlayerId = ranked[0][0]
  const eliminated = players.find((player) => player.id === eliminatedPlayerId)

  if (eliminated?.role === 'liar') {
    return { eliminatedPlayerId, winner: 'liar' }
  }

  return { eliminatedPlayerId }
}

export const checkWinner = (players: Player[]): Winner | undefined => {
  const alive = players.filter((player) => player.isAlive)
  const assassins = alive.filter((player) => player.role === 'assassin').length
  const nonAssassins = alive.length - assassins

  if (assassins === 0) return 'citizens'
  if (assassins >= nonAssassins) return 'assassins'

  return undefined
}

export const sanitizePlayers = (players: Player[], revealRoles: boolean): PublicPlayer[] =>
  players.map((player) => ({
    id: player.id,
    name: player.name,
    avatar: player.avatar,
    isAlive: player.isAlive,
    isHost: player.isHost,
    ...(revealRoles ? { role: player.role } : {}),
  }))
