import { describe, expect, test } from 'vitest'
import { AVATARS } from './types'

describe('avatar assets', () => {
  test('every avatar points to an image in the public avatars folder', () => {
    expect(AVATARS.every((avatar) => avatar.imagePath.startsWith('/avatars/'))).toBe(true)
    expect(AVATARS.every((avatar) => avatar.imagePath.endsWith('.png'))).toBe(true)
  })
})
