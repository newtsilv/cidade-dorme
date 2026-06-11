import { describe, expect, test } from 'vitest'
import {
  getFirstNightTurn,
  getNextNightTurn,
  roleForNightTurn,
} from './game-machine'
import {
  assignRoles,
  checkWinner,
  resolveDetectiveGuess,
  resolveNight,
  resolveVote,
  sanitizePlayers,
} from './rules'
import type { Player } from './types'

const players = (count: number): Player[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `p${index + 1}`,
    name: `Player ${index + 1}`,
    avatar: `avatar-${index + 1}`,
    isAlive: true,
    isHost: index === 0,
    socketId: `socket-${index + 1}`,
  }))

describe('game rules', () => {
  test('assigns base roles for four players without liar', () => {
    const assigned = assignRoles(players(4), () => 0)
    const roles = assigned.map((player) => player.role).sort()

    expect(roles).toEqual(['assassin', 'citizen', 'detective', 'doctor'])
  })

  test('adds liar from five players onward', () => {
    const assigned = assignRoles(players(5), () => 0)
    const roles = assigned.map((player) => player.role)

    expect(roles).toContain('liar')
    expect(roles.filter((role) => role === 'assassin')).toHaveLength(1)
  })

  test('adds two assassins for seven or more players', () => {
    const assigned = assignRoles(players(7), () => 0)

    expect(assigned.filter((player) => player.role === 'assassin')).toHaveLength(2)
  })

  test('detective guess returns only whether target is assassin', () => {
    const result = resolveDetectiveGuess({
      target: { ...players(1)[0], role: 'assassin' },
    })

    expect(result).toEqual({ correct: true })
  })

  test('night kill is prevented when doctor protects victim', () => {
    const [victim] = players(1)
    const result = resolveNight({
      players: [{ ...victim, role: 'citizen' }],
      actions: [
        { actorId: 'killer', targetId: victim.id, type: 'kill' },
        { actorId: 'doctor', targetId: victim.id, type: 'protect' },
      ],
    })

    expect(result.eliminatedPlayerId).toBeUndefined()
  })

  test('vote elimination gives liar immediate solo victory', () => {
    const table = [
      { ...players(1)[0], id: 'liar', role: 'liar' as const },
      { ...players(1)[0], id: 'voter1', role: 'citizen' as const },
      { ...players(1)[0], id: 'voter2', role: 'assassin' as const },
    ]

    const result = resolveVote({
      players: table,
      votes: { voter1: 'liar', voter2: 'liar' },
    })

    expect(result).toEqual({ eliminatedPlayerId: 'liar', winner: 'liar' })
  })

  test('vote tie eliminates nobody', () => {
    const table = players(3).map((player, index) => ({
      ...player,
      role: index === 0 ? ('assassin' as const) : ('citizen' as const),
    }))

    const result = resolveVote({
      players: table,
      votes: { p1: 'p2', p2: 'p1' },
    })

    expect(result).toEqual({})
  })

  test('citizens win when all assassins are dead', () => {
    const result = checkWinner([
      { ...players(1)[0], role: 'assassin', isAlive: false },
      { ...players(1)[0], role: 'citizen', isAlive: true },
    ])

    expect(result).toBe('citizens')
  })

  test('assassins win when they equal non-assassins alive', () => {
    const result = checkWinner([
      { ...players(1)[0], role: 'assassin', isAlive: true },
      { ...players(1)[0], role: 'citizen', isAlive: true },
    ])

    expect(result).toBe('assassins')
  })

  test('sanitized players hide roles and socket ids until game over', () => {
    const [player] = players(1)
    const hidden = sanitizePlayers([{ ...player, role: 'doctor' }], false)
    const revealed = sanitizePlayers([{ ...player, role: 'doctor' }], true)

    expect(hidden[0]).not.toHaveProperty('socketId')
    expect(hidden[0].role).toBeUndefined()
    expect(revealed[0].role).toBe('doctor')
  })

  test('night turns start with the assassin when an assassin is alive', () => {
    const table = [
      { ...players(1)[0], role: 'assassin' as const },
      { ...players(1)[0], id: 'doctor', role: 'doctor' as const },
    ]

    expect(getFirstNightTurn(table)).toBe('ASSASSIN_TURN')
  })

  test('night turns skip roles with no living player', () => {
    const table = [
      { ...players(1)[0], role: 'assassin' as const, isAlive: false },
      { ...players(1)[0], id: 'doctor', role: 'doctor' as const },
      { ...players(1)[0], id: 'detective', role: 'detective' as const },
    ]

    expect(getFirstNightTurn(table)).toBe('DOCTOR_TURN')
    expect(getNextNightTurn('DOCTOR_TURN', table)).toBe('DETECTIVE_TURN')
    expect(getNextNightTurn('DETECTIVE_TURN', table)).toBe('NIGHT_END')
  })

  test('night turn maps to the active role', () => {
    expect(roleForNightTurn('ASSASSIN_TURN')).toBe('assassin')
    expect(roleForNightTurn('DOCTOR_TURN')).toBe('doctor')
    expect(roleForNightTurn('DETECTIVE_TURN')).toBe('detective')
    expect(roleForNightTurn('NIGHT_END')).toBeUndefined()
  })
})
