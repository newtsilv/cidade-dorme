import { describe, expect, test } from 'vitest'
import { getRoleImagePath } from './role-assets'

describe('role assets', () => {
  test('maps each role to its public image asset', () => {
    expect(getRoleImagePath('assassin')).toBe('/avatars/assassino.png')
    expect(getRoleImagePath('detective')).toBe('/avatars/detetive.png')
    expect(getRoleImagePath('doctor')).toBe('/avatars/medico.png')
    expect(getRoleImagePath('citizen')).toBe('/avatars/cidadao.png')
    expect(getRoleImagePath('liar')).toBe('/avatars/mentiroso.png')
  })
})
