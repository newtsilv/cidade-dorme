import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test } from 'vitest'
import { PlayerList } from './PlayerList'
import type { PublicPlayer } from '@/features/game/types'

const players: PublicPlayer[] = [
  { id: 'player-1', name: 'Ana', avatar: 'judas', isAlive: true, isHost: false },
  { id: 'player-2', name: 'Beto', avatar: 'predo', isAlive: true, isHost: false },
]

describe('PlayerList', () => {
  test('can render selectable players without hover lift for voting', () => {
    const html = renderToStaticMarkup(
      createElement(PlayerList, {
        players,
        disableCardHover: true,
        onSelectPlayer: () => undefined,
      }),
    )

    expect(html).not.toContain('hover:-translate-y-1')
  })
})
