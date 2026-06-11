import { describe, expect, test } from 'vitest'
import { getServerPort } from './config'

describe('server config', () => {
  test('uses Railway PORT before local SERVER_PORT', () => {
    expect(getServerPort({ PORT: '1234', SERVER_PORT: '4000' })).toBe(1234)
  })

  test('falls back to SERVER_PORT for local development', () => {
    expect(getServerPort({ SERVER_PORT: '4000' })).toBe(4000)
  })

  test('falls back to 4000 when no valid port is provided', () => {
    expect(getServerPort({ PORT: 'not-a-number' })).toBe(4000)
  })
})
