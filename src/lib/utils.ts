export const cn = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ')

export const formatTimer = (seconds: number): string => {
  const safeSeconds = Math.max(0, seconds)
  const minutes = Math.floor(safeSeconds / 60)
  const remainder = safeSeconds % 60
  return `${minutes}:${remainder.toString().padStart(2, '0')}`
}
