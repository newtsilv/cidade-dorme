import { describe, expect, test } from 'vitest'
import { getJoinRoomError, getPlayerNameError } from './validation'

describe('lobby validation', () => {
  test('explains why an empty player name cannot create a room', () => {
    expect(getPlayerNameError('')).toBe('Digite um nome com pelo menos 2 caracteres.')
  })

  test('accepts a player name with two visible characters', () => {
    expect(getPlayerNameError('Lu')).toBeUndefined()
  })

  test('explains why a short room code cannot be used to join', () => {
    expect(getJoinRoomError('Ana', 'A1')).toBe('Digite um codigo de sala valido.')
  })
})
