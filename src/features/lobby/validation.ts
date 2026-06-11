export const getPlayerNameError = (name: string): string | undefined => {
  if (name.trim().length < 2) return 'Digite um nome com pelo menos 2 caracteres.'
  return undefined
}

export const getJoinRoomError = (name: string, code: string): string | undefined =>
  getPlayerNameError(name) ?? (code.trim().length < 4 ? 'Digite um codigo de sala valido.' : undefined)
