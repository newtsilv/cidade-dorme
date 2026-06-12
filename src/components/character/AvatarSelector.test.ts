import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { describe, expect, test } from 'vitest'
import { AvatarSelector } from './AvatarSelector'

describe('AvatarSelector', () => {
  test('renders a compact character picker trigger with the selected character name', () => {
    const html = renderToStaticMarkup(createElement(AvatarSelector, { value: 'judas', onChange: () => undefined }))

    expect(html).toContain('Escolher personagem')
    expect(html).toContain('judas')
    expect(html).not.toContain('grid-cols-5')
  })
})
