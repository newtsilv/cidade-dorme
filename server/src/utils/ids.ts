export const createId = (): string => crypto.randomUUID()

export const createRoomCode = (): string =>
  Math.random().toString(36).slice(2, 8).toUpperCase()
