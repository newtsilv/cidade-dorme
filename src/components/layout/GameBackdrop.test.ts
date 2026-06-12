import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test } from 'vitest'
import { GameBackdrop } from './GameBackdrop'

describe('GameBackdrop', () => {
  test('uses manel 4 as a cover background and renders children above it', () => {
    const html = renderToStaticMarkup(createElement(GameBackdrop, { visibility: 'strong' }, 'Mesa'))

    expect(html).toContain('/avatars/manel%20(4).svg')
    expect(html).toContain('bg-cover')
    expect(html).toContain('Mesa')
  })
})
