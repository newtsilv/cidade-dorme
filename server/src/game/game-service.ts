import type { Server } from 'socket.io'
import {
  getFirstNightTurn,
  getNextNightTurn,
  nextPhase,
  NIGHT_TURN_DURATIONS,
  PHASE_DURATIONS,
  roleForNightTurn,
} from '../../../src/features/game/game-machine'
import {
  assignRoles,
  checkWinner,
  resolveDetectiveGuess,
  resolveNight,
  resolveVote,
  sanitizePlayers,
} from '../../../src/features/game/rules'
import type { GamePhase, GameState, NightAction, NightActionType, NightTurn, Player, Winner } from '../../../src/features/game/types'
import type { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from '../socket/events'

type Io = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>

type InternalGame = {
  roomId: string
  phase: GamePhase
  round: number
  timer: number
  votes: Record<string, string>
  skips: Set<string>
  nightActions: NightAction[]
  winner?: Winner
  nightTurn?: NightTurn
  lastNightEliminatedPlayerId?: string
  lastVoteEliminatedPlayerId?: string
  interval?: NodeJS.Timeout
}

const games = new Map<string, InternalGame>()

const buildState = (roomId: string, players: Player[], revealRoles = false): GameState => {
  const game = games.get(roomId)
  return {
    roomId,
    phase: game?.phase ?? 'LOBBY',
    players: sanitizePlayers(players, revealRoles),
    round: game?.round ?? 0,
    timer: game?.timer ?? 0,
    votes: game?.votes ?? {},
    nightActions: game?.nightActions ?? [],
    winner: game?.winner,
    nightTurn: game?.nightTurn,
    lastNightEliminatedPlayerId: game?.lastNightEliminatedPlayerId,
    lastVoteEliminatedPlayerId: game?.lastVoteEliminatedPlayerId,
  }
}

const clearTimer = (game: InternalGame) => {
  if (game.interval) clearInterval(game.interval)
  game.interval = undefined
}

const durationFor = (phase: GamePhase): number =>
  phase === 'LOBBY' || phase === 'GAME_OVER' ? 0 : PHASE_DURATIONS[phase]

const actionTypeForTurn = (turn?: NightTurn): NightActionType | undefined => {
  switch (turn) {
    case 'ASSASSIN_TURN':
      return 'kill'
    case 'DOCTOR_TURN':
      return 'protect'
    case 'DETECTIVE_TURN':
      return 'guess-assassin'
    default:
      return undefined
  }
}

export const gameService = {
  start({ io, roomId, players }: { io: Io; roomId: string; players: Player[] }) {
    const assignedPlayers = assignRoles(players)
    players.splice(0, players.length, ...assignedPlayers)

    const game: InternalGame = {
      roomId,
      phase: 'REVEAL_ROLES',
      round: 1,
      timer: PHASE_DURATIONS.REVEAL_ROLES,
      votes: {},
      skips: new Set(),
      nightActions: [],
    }
    games.set(roomId, game)

    players.forEach((player) => {
      if (player.role) io.to(player.socketId).emit('game:roleAssigned', { role: player.role })
    })
    io.to(roomId).emit('game:started', buildState(roomId, players))
    this.runTimer({ io, players, roomId })
  },

  state(roomId: string, players: Player[], revealRoles = false) {
    return buildState(roomId, players, revealRoles)
  },

  addNightAction({ io, players, roomId, actorId, targetId, type }: { io: Io; players: Player[]; roomId: string; actorId: string; targetId: string; type: NightActionType }) {
    const game = games.get(roomId)
    const actor = players.find((player) => player.id === actorId)
    const target = players.find((player) => player.id === targetId)
    if (!game || game.phase !== 'NIGHT') throw new Error('Acao noturna indisponivel agora')
    if (!actor?.isAlive || !target?.isAlive) throw new Error('Jogador invalido para acao')
    const activeRole = game.nightTurn ? roleForNightTurn(game.nightTurn) : undefined
    const activeActionType = actionTypeForTurn(game.nightTurn)
    if (!activeRole || !activeActionType) throw new Error('Aguarde o cargo ativo acordar')
    if (actor.role !== activeRole || type !== activeActionType) throw new Error('Nao e o turno do seu cargo')
    if (type === 'kill' && actor.role !== 'assassin') throw new Error('Apenas assassino pode eliminar')
    if (type === 'protect' && actor.role !== 'doctor') throw new Error('Apenas medico pode proteger')
    if (type === 'guess-assassin' && actor.role !== 'detective') throw new Error('Apenas detetive pode palpitar')

    game.nightActions = game.nightActions.filter((action) => action.actorId !== actorId)
    game.nightActions.push({ actorId, targetId, type })

    if (type === 'guess-assassin') {
      io.to(actor.socketId).emit('game:detectiveResult', { targetId, ...resolveDetectiveGuess({ target }) })
    }
    this.advanceNightTurn({ io, players, roomId })
  },

  advanceNightTurn({ io, players, roomId }: { io: Io; players: Player[]; roomId: string }) {
    const game = games.get(roomId)
    if (!game || game.phase !== 'NIGHT') return
    clearTimer(game)

    if (game.nightTurn === 'NIGHT_INTRO') {
      game.nightTurn = getFirstNightTurn(players)
    } else if (game.nightTurn === 'NIGHT_END') {
      this.advance({ io, players, roomId })
      return
    } else if (game.nightTurn) {
      game.nightTurn = getNextNightTurn(game.nightTurn, players)
    } else {
      game.nightTurn = getFirstNightTurn(players)
    }

    if (game.nightTurn === 'NIGHT_END') {
      game.timer = NIGHT_TURN_DURATIONS.NIGHT_END
    } else {
      game.timer = NIGHT_TURN_DURATIONS[game.nightTurn]
    }
    io.to(roomId).emit('game:phaseChanged', buildState(roomId, players))
    this.runTimer({ io, players, roomId })
  },

  vote({ io, players, roomId, voterId, targetId }: { io: Io; players: Player[]; roomId: string; voterId: string; targetId: string }) {
    const game = games.get(roomId)
    const voter = players.find((player) => player.id === voterId)
    const target = players.find((player) => player.id === targetId)
    if (!game || game.phase !== 'VOTING') throw new Error('Votacao indisponivel agora')
    if (!voter?.isAlive || !target?.isAlive) throw new Error('Apenas vivos podem votar e receber votos')

    game.votes[voterId] = targetId
    const aliveCount = players.filter((player) => player.isAlive).length
    io.to(roomId).emit('game:voteUpdated', { votedPlayerIds: Object.keys(game.votes) })
    if (Object.keys(game.votes).length >= aliveCount) this.advance({ io, players, roomId })
  },

  skip({ io, players, roomId, playerId }: { io: Io; players: Player[]; roomId: string; playerId: string }) {
    const game = games.get(roomId)
    const player = players.find((candidate) => candidate.id === playerId)
    if (!game || game.phase !== 'DAY_DISCUSSION') throw new Error('So e possivel pular durante discussao')
    if (!player?.isAlive) throw new Error('Jogador morto nao pode pular')
    game.skips.add(playerId)
    if (game.skips.size >= players.filter((candidate) => candidate.isAlive).length) this.advance({ io, players, roomId })
  },

  runTimer({ io, players, roomId }: { io: Io; players: Player[]; roomId: string }) {
    const game = games.get(roomId)
    if (!game) return
    clearTimer(game)
    game.interval = setInterval(() => {
      game.timer -= 1
      io.to(roomId).emit('game:timerUpdated', { phase: game.phase, timer: game.timer })
      if (game.timer <= 0) this.advance({ io, players, roomId })
    }, 1000)
  },

  advance({ io, players, roomId }: { io: Io; players: Player[]; roomId: string }) {
    const game = games.get(roomId)
    if (!game || game.phase === 'GAME_OVER') return
    clearTimer(game)

    if (game.phase === 'NIGHT') {
      if (game.nightTurn && game.nightTurn !== 'NIGHT_END') {
        this.advanceNightTurn({ io, players, roomId })
        return
      }
      const night = resolveNight({ players, actions: game.nightActions })
      game.lastNightEliminatedPlayerId = night.eliminatedPlayerId
      if (night.eliminatedPlayerId) {
        const victim = players.find((player) => player.id === night.eliminatedPlayerId)
        if (victim) victim.isAlive = false
        io.to(roomId).emit('game:playerEliminated', { playerId: night.eliminatedPlayerId, reason: 'night' })
      }
      game.nightActions = []
      game.nightTurn = undefined
    }

    if (game.phase === 'VOTING') {
      const vote = resolveVote({ players, votes: game.votes })
      game.lastVoteEliminatedPlayerId = vote.eliminatedPlayerId
      if (vote.eliminatedPlayerId) {
        const eliminated = players.find((player) => player.id === vote.eliminatedPlayerId)
        if (eliminated) eliminated.isAlive = false
        io.to(roomId).emit('game:playerEliminated', { playerId: vote.eliminatedPlayerId, reason: 'vote' })
      }
      if (vote.winner) game.winner = vote.winner
      game.votes = {}
    }

    game.winner = game.winner ?? checkWinner(players)
    if (game.winner) {
      game.phase = 'GAME_OVER'
      const state = buildState(roomId, players, true)
      io.to(roomId).emit('game:phaseChanged', state)
      io.to(roomId).emit('game:ended', { winner: game.winner, state })
      return
    }

    game.phase = nextPhase(game.phase)
    if (game.phase === 'NIGHT') {
      game.round += 1
      game.lastNightEliminatedPlayerId = undefined
      game.lastVoteEliminatedPlayerId = undefined
      game.nightTurn = 'NIGHT_INTRO'
    }
    game.skips.clear()
    game.timer = game.phase === 'NIGHT' && game.nightTurn ? NIGHT_TURN_DURATIONS[game.nightTurn] : durationFor(game.phase)
    io.to(roomId).emit('game:phaseChanged', buildState(roomId, players))
    this.runTimer({ io, players, roomId })
  },

  reset(roomId: string) {
    const game = games.get(roomId)
    if (game) clearTimer(game)
    games.delete(roomId)
  },
}
